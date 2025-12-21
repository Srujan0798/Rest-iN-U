import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Photo Upload Service with S3 and Image Optimization
class PhotoUploadService {
    private s3Client: S3Client;
    private bucket: string;
    private cdnUrl: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: process.env.AWS_ACCESS_KEY_ID ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            } : undefined
        });
        this.bucket = process.env.AWS_S3_BUCKET || 'restinu-photos';
        this.cdnUrl = process.env.CDN_URL || `https://${this.bucket}.s3.amazonaws.com`;
    }

    // ============================================
    // PROPERTY PHOTO UPLOAD
    // ============================================

    async uploadPropertyPhoto(
        propertyId: string,
        file: { buffer: Buffer; mimetype: string; originalname: string },
        options: {
            caption?: string;
            type?: 'exterior' | 'interior' | 'aerial' | 'floor_plan';
            room?: string;
            order?: number;
        } = {}
    ): Promise<PhotoUploadResult> {
        const photoId = uuidv4();
        const timestamp = Date.now();
        const baseKey = `properties/${propertyId}/photos/${photoId}`;

        try {
            // Load and analyze image
            const image = sharp(file.buffer);
            const metadata = await image.metadata();

            // Generate optimized versions
            const [original, optimized, thumbnail] = await Promise.all([
                // Original (compressed JPEG)
                this.processImage(file.buffer, {
                    quality: 90,
                    format: 'jpeg',
                    maxWidth: 4000
                }),
                // Optimized WebP for web
                this.processImage(file.buffer, {
                    quality: 85,
                    format: 'webp',
                    maxWidth: 2000
                }),
                // Thumbnail
                this.processImage(file.buffer, {
                    quality: 80,
                    format: 'webp',
                    width: 400,
                    height: 300
                })
            ]);

            // Upload to S3
            const [originalUrl, optimizedUrl, thumbnailUrl] = await Promise.all([
                this.uploadToS3(`${baseKey}/${timestamp}-original.jpg`, original.buffer, 'image/jpeg'),
                this.uploadToS3(`${baseKey}/${timestamp}-optimized.webp`, optimized.buffer, 'image/webp'),
                this.uploadToS3(`${baseKey}/${timestamp}-thumb.webp`, thumbnail.buffer, 'image/webp')
            ]);

            return {
                photoId,
                propertyId,
                url: optimizedUrl,
                originalUrl,
                thumbnailUrl,
                width: metadata.width || 0,
                height: metadata.height || 0,
                sizeBytes: optimized.buffer.length,
                originalSizeBytes: file.buffer.length,
                compressionRatio: Math.round((1 - optimized.buffer.length / file.buffer.length) * 100),
                caption: options.caption,
                type: options.type || 'interior',
                room: options.room,
                order: options.order || 0,
                uploadedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Photo upload failed:', error);
            throw new Error('Failed to upload photo');
        }
    }

    // ============================================
    // BATCH UPLOAD
    // ============================================

    async uploadMultiplePhotos(
        propertyId: string,
        files: Array<{ buffer: Buffer; mimetype: string; originalname: string }>,
        baseOrder: number = 0
    ): Promise<PhotoUploadResult[]> {
        const results = await Promise.all(
            files.map((file, index) =>
                this.uploadPropertyPhoto(propertyId, file, { order: baseOrder + index })
            )
        );
        return results;
    }

    // ============================================
    // AGENT PHOTO UPLOAD
    // ============================================

    async uploadAgentPhoto(
        agentId: string,
        file: { buffer: Buffer; mimetype: string }
    ): Promise<{ url: string; thumbnailUrl: string }> {
        const photoId = uuidv4();
        const baseKey = `agents/${agentId}`;

        const [profile, thumbnail] = await Promise.all([
            this.processImage(file.buffer, {
                quality: 90,
                format: 'jpeg',
                width: 500,
                height: 500,
                fit: 'cover'
            }),
            this.processImage(file.buffer, {
                quality: 80,
                format: 'webp',
                width: 100,
                height: 100,
                fit: 'cover'
            })
        ]);

        const [profileUrl, thumbnailUrl] = await Promise.all([
            this.uploadToS3(`${baseKey}/${photoId}-profile.jpg`, profile.buffer, 'image/jpeg'),
            this.uploadToS3(`${baseKey}/${photoId}-thumb.webp`, thumbnail.buffer, 'image/webp')
        ]);

        return { url: profileUrl, thumbnailUrl };
    }

    // ============================================
    // DOCUMENT UPLOAD
    // ============================================

    async uploadDocument(
        entityType: 'property' | 'transaction' | 'user',
        entityId: string,
        file: { buffer: Buffer; mimetype: string; originalname: string }
    ): Promise<{ documentId: string; url: string; downloadUrl: string }> {
        const documentId = uuidv4();
        const extension = path.extname(file.originalname);
        const key = `${entityType}s/${entityId}/documents/${documentId}${extension}`;

        await this.uploadToS3(key, file.buffer, file.mimetype, {
            'Content-Disposition': `attachment; filename="${file.originalname}"`
        });

        // Generate signed URL for download (valid for 1 hour)
        const downloadUrl = await this.getSignedDownloadUrl(key);

        return {
            documentId,
            url: `${this.cdnUrl}/${key}`,
            downloadUrl
        };
    }

    // ============================================
    // DELETE OPERATIONS
    // ============================================

    async deletePhoto(photoUrl: string): Promise<void> {
        const key = this.urlToKey(photoUrl);
        await this.deleteFromS3(key);
    }

    async deletePropertyPhotos(propertyId: string): Promise<void> {
        // In production, use listObjects and batch delete
        console.log(`Deleting all photos for property: ${propertyId}`);
    }

    // ============================================
    // PRESIGNED URLS
    // ============================================

    async getPresignedUploadUrl(
        propertyId: string,
        filename: string,
        contentType: string
    ): Promise<{ uploadUrl: string; key: string; expiresIn: number }> {
        const photoId = uuidv4();
        const key = `properties/${propertyId}/photos/${photoId}/${filename}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

        return {
            uploadUrl,
            key,
            expiresIn: 3600
        };
    }

    async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    // ============================================
    // IMAGE PROCESSING
    // ============================================

    private async processImage(
        buffer: Buffer,
        options: {
            quality?: number;
            format?: 'jpeg' | 'webp' | 'png';
            width?: number;
            height?: number;
            maxWidth?: number;
            maxHeight?: number;
            fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
        }
    ): Promise<{ buffer: Buffer; width: number; height: number }> {
        let image = sharp(buffer);
        const metadata = await image.metadata();

        // Resize if dimensions specified
        if (options.width || options.height) {
            image = image.resize({
                width: options.width,
                height: options.height,
                fit: options.fit || 'cover',
                withoutEnlargement: true
            });
        } else if (options.maxWidth || options.maxHeight) {
            const needsResize =
                (options.maxWidth && metadata.width && metadata.width > options.maxWidth) ||
                (options.maxHeight && metadata.height && metadata.height > options.maxHeight);

            if (needsResize) {
                image = image.resize({
                    width: options.maxWidth,
                    height: options.maxHeight,
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }
        }

        // Apply format and quality
        switch (options.format) {
            case 'webp':
                image = image.webp({ quality: options.quality || 85 });
                break;
            case 'png':
                image = image.png({ quality: options.quality || 90 });
                break;
            case 'jpeg':
            default:
                image = image.jpeg({ quality: options.quality || 90, progressive: true });
        }

        const processedBuffer = await image.toBuffer();
        const processedMetadata = await sharp(processedBuffer).metadata();

        return {
            buffer: processedBuffer,
            width: processedMetadata.width || 0,
            height: processedMetadata.height || 0
        };
    }

    // ============================================
    // S3 OPERATIONS
    // ============================================

    private async uploadToS3(
        key: string,
        buffer: Buffer,
        contentType: string,
        additionalMetadata?: Record<string, string>
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'max-age=31536000', // 1 year
            ...additionalMetadata
        });

        await this.s3Client.send(command);
        return `${this.cdnUrl}/${key}`;
    }

    private async deleteFromS3(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        await this.s3Client.send(command);
    }

    private urlToKey(url: string): string {
        return url.replace(`${this.cdnUrl}/`, '');
    }

    // ============================================
    // UTILITIES
    // ============================================

    async getImageMetadata(buffer: Buffer): Promise<{
        width: number;
        height: number;
        format: string;
        size: number;
    }> {
        const metadata = await sharp(buffer).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: buffer.length
        };
    }

    validateImageType(mimetype: string): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        return allowedTypes.includes(mimetype);
    }

    validateImageSize(sizeBytes: number, maxSizeMB: number = 20): boolean {
        return sizeBytes <= maxSizeMB * 1024 * 1024;
    }
}

// Types
interface PhotoUploadResult {
    photoId: string;
    propertyId: string;
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    sizeBytes: number;
    originalSizeBytes: number;
    compressionRatio: number;
    caption?: string;
    type: string;
    room?: string;
    order: number;
    uploadedAt: string;
}

// Export singleton instance
export const photoUploadService = new PhotoUploadService();
export default PhotoUploadService;
