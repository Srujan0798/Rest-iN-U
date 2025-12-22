import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';

interface PhotoUploadResult {
    photo_id: string;
    url: string;
    thumbnail_url: string;
    optimized_url: string;
    size_bytes: number;
    width: number;
    height: number;
}

@Injectable()
export class PhotoUploadService {
    private s3Client: S3Client;
    private bucket: string;
    private cdnUrl: string;

    constructor(private prisma: PrismaService) {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
        this.bucket = process.env.AWS_S3_BUCKET!;
        this.cdnUrl = process.env.CDN_URL!;
    }

    async uploadPropertyPhoto(
        propertyId: string,
        file: Express.Multer.File,
        options: {
            caption?: string;
            type?: 'exterior' | 'interior' | 'aerial' | 'floor_plan';
            room?: string;
            order?: number;
        }
    ): Promise<PhotoUploadResult> {
        const photoId = uuidv4();
        const timestamp = Date.now();

        // Generate unique filenames
        const baseKey = `properties/${propertyId}/photos/${photoId}`;
        const originalKey = `${baseKey}/${timestamp}-original.jpg`;
        const optimizedKey = `${baseKey}/${timestamp}-optimized.webp`;
        const thumbnailKey = `${baseKey}/${timestamp}-thumb.webp`;

        try {
            // Load image with sharp
            const image = sharp(file.buffer);
            const metadata = await image.metadata();

            // 1. Upload original (compressed JPEG)
            const originalBuffer = await image
                .jpeg({ quality: 90, mozjpeg: true })
                .toBuffer();

            await this.uploadToS3(originalKey, originalBuffer, 'image/jpeg');

            // 2. Create and upload optimized WebP (max 2000px width)
            const optimizedBuffer = await image
                .resize(2000, null, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 85 })
                .toBuffer();

            await this.uploadToS3(optimizedKey, optimizedBuffer, 'image/webp');

            // 3. Create and upload thumbnail (400px width)
            const thumbnailBuffer = await image
                .resize(400, 300, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer();

            await this.uploadToS3(thumbnailKey, thumbnailBuffer, 'image/webp');

            // 4. Extract EXIF data for metadata
            const exif = await this.extractEXIF(file.buffer);

            // 5. Save to database
            const photo = await this.prisma.photo.create({
                data: {
                    photo_id: photoId,
                    property_id: propertyId,
                    url: `${this.cdnUrl}/${optimizedKey}`,
                    thumbnail_url: `${this.cdnUrl}/${thumbnailKey}`,
                    caption: options.caption,
                    type: options.type || 'interior',
                    room: options.room,
                    order: options.order || 0,
                    metadata: {
                        original_key: originalKey,
                        optimized_key: optimizedKey,
                        thumbnail_key: thumbnailKey,
                        original_size: file.size,
                        optimized_size: optimizedBuffer.length,
                        width: metadata.width,
                        height: metadata.height,
                        format: metadata.format,
                        exif: exif
                    }
                }
            });

            console.log(`Uploaded photo ${photoId} for property ${propertyId}`);

            return {
                photo_id: photoId,
                url: photo.url,
                thumbnail_url: photo.thumbnail_url!,
                optimized_url: photo.url,
                size_bytes: optimizedBuffer.length,
                width: metadata.width!,
                height: metadata.height!
            };

        } catch (error) {
            console.error('Photo upload failed:', error);
            // Cleanup any uploaded files
            await this.cleanupFailedUpload([originalKey, optimizedKey, thumbnailKey]);
            throw error;
        }
    }

    async uploadMultiplePhotos(
        propertyId: string,
        files: Express.Multer.File[],
        startOrder: number = 0
    ): Promise<PhotoUploadResult[]> {
        const results: PhotoUploadResult[] = [];

        for (let i = 0; i < files.length; i++) {
            const result = await this.uploadPropertyPhoto(propertyId, files[i], {
                type: 'interior',
                order: startOrder + i
            });
            results.push(result);
        }

        return results;
    }

    async reorderPhotos(propertyId: string, photoOrders: { photo_id: string; order: number }[]) {
        // Update all photo orders in a transaction
        await this.prisma.$transaction(
            photoOrders.map(({ photo_id, order }) =>
                this.prisma.photo.update({
                    where: { photo_id },
                    data: { order }
                })
            )
        );

        console.log(`Reordered ${photoOrders.length} photos for property ${propertyId}`);
    }

    async deletePhoto(photoId: string) {
        // Get photo metadata
        const photo = await this.prisma.photo.findUnique({
            where: { photo_id: photoId }
        });

        if (!photo) {
            throw new Error('Photo not found');
        }

        // Delete from S3
        const metadata = photo.metadata as any;
        await Promise.all([
            this.deleteFromS3(metadata.original_key),
            this.deleteFromS3(metadata.optimized_key),
            this.deleteFromS3(metadata.thumbnail_key)
        ]);

        // Delete from database
        await this.prisma.photo.delete({
            where: { photo_id: photoId }
        });

        console.log(`Deleted photo ${photoId}`);
    }

    async generateVirtualTourImages(propertyId: string, photoIds: string[]) {
        // Create 360-degree panorama composite from multiple photos
        // This is a simplified version - real implementation would use specialized tools

        const photos = await this.prisma.photo.findMany({
            where: {
                photo_id: { in: photoIds },
                property_id: propertyId
            }
        });

        if (photos.length < 4) {
            throw new Error('Need at least 4 photos for virtual tour');
        }

        // Download images
        const imageBuffers = await Promise.all(
            photos.map(photo => this.downloadFromCDN(photo.url))
        );

        // Create panorama (simplified - would use specialized stitching algorithm)
        const panorama = await this.stitchPanorama(imageBuffers);

        // Upload panorama
        const panoramaKey = `properties/${propertyId}/virtual-tour/panorama-${Date.now()}.jpg`;
        await this.uploadToS3(panoramaKey, panorama, 'image/jpeg');

        return {
            panorama_url: `${this.cdnUrl}/${panoramaKey}`,
            viewer_url: `/virtual-tour/${propertyId}`
        };
    }

    async analyzePhotoQuality(file: Express.Multer.File): Promise<{
        score: number;
        issues: string[];
        suggestions: string[];
    }> {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();
        const stats = await image.stats();

        let score = 100;
        const issues: string[] = [];
        const suggestions: string[] = [];

        // Check resolution
        if (metadata.width! < 1920 || metadata.height! < 1080) {
            score -= 20;
            issues.push('Low resolution');
            suggestions.push('Use a camera with at least 1920x1080 resolution');
        }

        // Check brightness
        const brightness = stats.channels.reduce((sum, ch) => sum + ch.mean, 0) / stats.channels.length;
        if (brightness < 50) {
            score -= 15;
            issues.push('Image too dark');
            suggestions.push('Increase lighting or exposure');
        } else if (brightness > 200) {
            score -= 15;
            issues.push('Image overexposed');
            suggestions.push('Reduce exposure or use diffused lighting');
        }

        // Check sharpness (simplified - would use edge detection)
        const sharpness = stats.channels[0].stdev; // Standard deviation as proxy
        if (sharpness < 20) {
            score -= 10;
            issues.push('Image appears blurry');
            suggestions.push('Use tripod and ensure proper focus');
        }

        // Check file size
        if (file.size > 10 * 1024 * 1024) {
            suggestions.push('Consider compressing image before upload');
        }

        return {
            score: Math.max(0, score),
            issues,
            suggestions
        };
    }

    async generatePhotoAltText(photoId: string): Promise<string> {
        // Use AI vision API to generate descriptive alt text
        const photo = await this.prisma.photo.findUnique({
            where: { photo_id: photoId },
            include: { property: true }
        });

        if (!photo) throw new Error('Photo not found');

        // Download image
        const imageBuffer = await this.downloadFromCDN(photo.url);

        // Call AI vision API (e.g., Google Cloud Vision)
        const labels = await this.detectLabels(imageBuffer);

        // Generate descriptive text
        const room = photo.room || photo.type;
        const address = photo.property.street;

        const altText = `${room} at ${address} featuring ${labels.slice(0, 3).join(', ')}`;

        // Update photo with alt text
        await this.prisma.photo.update({
            where: { photo_id: photoId },
            data: { caption: altText }
        });

        return altText;
    }

    private async uploadToS3(key: string, buffer: Buffer, contentType: string) {
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'max-age=31536000', // 1 year
            ACL: 'public-read'
        }));
    }

    private async deleteFromS3(key: string) {
        try {
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            }));
        } catch (error) {
            console.error(`Failed to delete ${key}:`, error);
        }
    }

    private async cleanupFailedUpload(keys: string[]) {
        await Promise.all(keys.map(key => this.deleteFromS3(key)));
    }

    private async extractEXIF(buffer: Buffer): Promise<any> {
        try {
            const exif = await sharp(buffer).metadata();
            return {
                camera: exif.exif?.Make || null,
                model: exif.exif?.Model || null,
                date: exif.exif?.DateTime || null,
                exposure: exif.exif?.ExposureTime || null,
                iso: exif.exif?.ISOSpeedRatings || null,
                focal_length: exif.exif?.FocalLength || null,
                gps: exif.exif?.GPSLatitude ? {
                    lat: this.parseGPS(exif.exif.GPSLatitude),
                    lng: this.parseGPS(exif.exif.GPSLongitude)
                } : null
            };
        } catch (error) {
            return {};
        }
    }

    private parseGPS(gps: any): number {
        // Simplified GPS parsing
        if (Array.isArray(gps) && gps.length === 3) {
            return gps[0] + gps[1] / 60 + gps[2] / 3600;
        }
        return 0;
    }

    private async downloadFromCDN(url: string): Promise<Buffer> {
        const response = await fetch(url);
        return Buffer.from(await response.arrayBuffer());
    }

    private async stitchPanorama(images: Buffer[]): Promise<Buffer> {
        // Simplified panorama stitching
        // Real implementation would use OpenCV or specialized library

        // For now, just create a wide composite
        const compositeImages = await Promise.all(
            images.map(img => sharp(img).resize(1000, 750).toBuffer())
        );

        const panorama = sharp({
            create: {
                width: 1000 * images.length,
                height: 750,
                channels: 3,
                background: { r: 0, g: 0, b: 0 }
            }
        });

        const composite = compositeImages.map((img, i) => ({
            input: img,
            left: i * 1000,
            top: 0
        }));

        return panorama.composite(composite).jpeg().toBuffer();
    }

    private async detectLabels(imageBuffer: Buffer): Promise<string[]> {
        // Call Google Cloud Vision API
        // Mock implementation
        return ['Modern', 'Spacious', 'Bright'];
    }
}
