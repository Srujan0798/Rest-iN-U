'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Button, Card, CardContent, Input, Spinner } from '@/components/ui';

// Validation Schemas
const step1Schema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    propertyType: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'MULTI_FAMILY', 'COMMERCIAL', 'VILLA', 'PENTHOUSE', 'FARMHOUSE', 'ASHRAM', 'PLOT']),
    listingType: z.enum(['SALE', 'RENT', 'LEASE', 'AUCTION']),
    price: z.coerce.number().positive('Price must be positive'),
    streetAddress: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().default('USA'),
});

const step2Schema = z.object({
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().min(0),
    squareFeet: z.coerce.number().int().positive().optional(),
    yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear() + 2).optional(),
    features: z.array(z.string()).default([]),
});

const step3Schema = z.object({
    entranceDirection: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
    kitchenLocation: z.string().optional(),
    masterBedroomLocation: z.string().optional(),
});

const combinedSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type FormData = z.infer<typeof combinedSchema>;

export default function CreateListingPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { register, handleSubmit, control, formState: { errors }, watch, trigger } = useForm<FormData>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            country: 'USA',
            features: [],
            propertyType: 'HOUSE',
            listingType: 'SALE',
            entranceDirection: 'EAST',
        },
        mode: 'onChange',
    });

    // Check auth
    if (typeof window !== 'undefined' && !isAuthenticated) {
        // Simple client-side redirect protection
        router.push('/login?redirect=/properties/create');
        return null;
    }

    const nextStep = async () => {
        let valid = false;
        if (step === 1) {
            valid = await trigger(['title', 'description', 'price', 'streetAddress', 'city', 'state', 'zipCode']);
        } else if (step === 2) {
            valid = await trigger(['bedrooms', 'bathrooms', 'squareFeet']);
        } else if (step === 3) {
            valid = true;
        }

        if (valid) setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            setPhotos(prev => [...prev, ...newPhotos]);

            // Generate previews
            const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
            setPhotoPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            // 1. Create Property
            const propertyData = {
                title: data.title,
                description: data.description,
                propertyType: data.propertyType,
                listingType: data.listingType,
                streetAddress: data.streetAddress,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                country: data.country,
                latitude: 0, // Mock lat/long for now
                longitude: 0,
                price: Number(data.price),
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                squareFeet: data.squareFeet ? Number(data.squareFeet) : undefined,
                yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
                features: data.features,
            };

            const propRes = await api.request<any>('/properties', {
                method: 'POST',
                body: propertyData,
            });

            const newPropertyId = propRes.data.id;
            setPropertyId(newPropertyId);

            // 2. Submit Vastu Analysis (Manual)
            const vastuPayload = {
                propertyId: newPropertyId,
                orientation: data.entranceDirection,
                propertyType: data.propertyType === 'APARTMENT' ? 'APARTMENT' : 'HOUSE',
                entrance: {
                    direction: data.entranceDirection,
                    position: 'CENTER' // Default
                },
                language: 'en'
            };

            await api.request('/vastu/analyze', {
                method: 'POST',
                body: vastuPayload
            }).catch(err => console.error("Vastu analysis failed", err));

            // 3. Upload Photos
            if (photos.length > 0) {
                // In a real app with S3/Cloudinary, we'd upload files and get URLs.
                // Here we are mocking the upload process as requested, but hitting the endpoint.
                // However, the backend endpoint expects an array of objects { url, ... }.
                // So we need to "upload" them first.
                // Since I cannot implement a full file upload server side in this step without changing backend significantly,
                // I will mock the "upload to storage" part client side by generating fake URLs or using data URIs if small enough,
                // BUT better to just assume they were uploaded and send placeholder URLs to the backend so the DB record is created.

                // For demonstration, we'll create photo records pointing to a placeholder service or dummy S3 bucket.
                const uploadedPhotos = photos.map((file, index) => ({
                    url: `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`, // Mock URL
                    thumbnailUrl: `https://placehold.co/150x150?text=${encodeURIComponent(file.name)}`,
                    caption: file.name,
                    roomType: 'LIVING_ROOM', // Default
                    orderIndex: index,
                    isPrimary: index === 0
                }));

                await api.request(`/properties/${newPropertyId}/photos`, {
                    method: 'POST',
                    body: { photos: uploadedPhotos }
                });
            }

            // Success! Redirect to dashboard
            router.push('/agent/dashboard');

        } catch (error: any) {
            console.error('Submission error:', error);
            alert(`Failed to create listing: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
                    <div className="mt-4 flex items-center">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                    step >= s ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {s}
                                </div>
                                {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-amber-500' : 'bg-gray-200'} mx-2`} />}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600">
                        {step === 1 && 'Basic Details'}
                        {step === 2 && 'Features & Amenities'}
                        {step === 3 && 'Vastu & Energy'}
                        {step === 4 && 'Photos'}
                    </div>
                </div>

                <Card>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Step 1: Basic Details */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <Input label="Property Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Modern Villa in Downtown" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                            <select {...register('propertyType')} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500">
                                                {['HOUSE', 'CONDO', 'APARTMENT', 'VILLA', 'LAND'].map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                                            <select {...register('listingType')} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500">
                                                <option value="SALE">For Sale</option>
                                                <option value="RENT">For Rent</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Input label="Price ($)" type="number" {...register('price')} error={errors.price?.message} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            {...register('description')}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500"
                                            placeholder="Describe the property..."
                                        />
                                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900">Location</h3>
                                        <Input label="Street Address" {...register('streetAddress')} error={errors.streetAddress?.message} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="City" {...register('city')} error={errors.city?.message} />
                                            <Input label="State" {...register('state')} error={errors.state?.message} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="ZIP Code" {...register('zipCode')} error={errors.zipCode?.message} />
                                            <Input label="Country" {...register('country')} disabled />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Features */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input label="Bedrooms" type="number" {...register('bedrooms')} error={errors.bedrooms?.message} />
                                        <Input label="Bathrooms" type="number" step="0.5" {...register('bathrooms')} error={errors.bathrooms?.message} />
                                        <Input label="Square Feet" type="number" {...register('squareFeet')} error={errors.squareFeet?.message} />
                                    </div>

                                    <Input label="Year Built" type="number" {...register('yearBuilt')} error={errors.yearBuilt?.message} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Garage', 'Pool', 'Garden', 'Fireplace', 'Solar Panels', 'Smart Home', 'Waterfront', 'Gated'].map((feature) => (
                                                <label key={feature} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        value={feature}
                                                        {...register('features')}
                                                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                                    />
                                                    <span>{feature}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Vastu */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm mb-4">
                                        Providing accurate Vastu details helps our AI generate a compliance score and suggestions.
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Entrance Direction</label>
                                        <select {...register('entranceDirection')} className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500">
                                            {['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST'].map(d => (
                                                <option key={d} value={d}>{d.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Input label="Kitchen Location (Optional)" {...register('kitchenLocation')} placeholder="e.g. South East Corner" />
                                    <Input label="Master Bedroom Location (Optional)" {...register('masterBedroomLocation')} placeholder="e.g. South West Corner" />
                                </div>
                            )}

                            {/* Step 4: Photos */}
                            {step === 4 && (
                                <div className="text-center space-y-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:bg-gray-50 transition relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handlePhotoChange}
                                        />
                                        <div className="text-4xl mb-4">📸</div>
                                        <p className="font-medium text-gray-900">Click to upload photos</p>
                                        <p className="text-sm text-gray-500">or drag and drop</p>
                                    </div>

                                    {photoPreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {photoPreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-400 text-left">
                                        * For this prototype, uploaded images will be mocked with placeholder URLs.
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                                {step > 1 ? (
                                    <Button type="button" variant="secondary" onClick={prevStep}>
                                        Back
                                    </Button>
                                ) : <div />}

                                {step < 4 ? (
                                    <Button type="button" onClick={nextStep}>
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button type="submit" loading={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Listing'}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
