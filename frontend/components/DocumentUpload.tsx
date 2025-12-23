'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
    onUploadComplete: (files: File[]) => void;
    maxFiles?: number;
    acceptedTypes?: string[];
}

export default function DocumentUpload({
    onUploadComplete,
    maxFiles = 5,
    acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png']
}: DocumentUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            validateAndAddFiles(newFiles);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            validateAndAddFiles(newFiles);
        }
    };

    const validateAndAddFiles = (newFiles: File[]) => {
        setError(null);

        if (files.length + newFiles.length > maxFiles) {
            setError(`You can only upload a maximum of ${maxFiles} files.`);
            return;
        }

        const validFiles = newFiles.filter(file => {
            const extension = '.' + file.name.split('.').pop()?.toLowerCase();
            return acceptedTypes.includes(extension);
        });

        if (validFiles.length !== newFiles.length) {
            setError('Some files were rejected due to invalid type.');
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        onUploadComplete(files);
        setFiles([]);
        setUploading(false);
    };

    return (
        <div className="w-full">
            <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileChange}
                />
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Click to upload or drag and drop</h3>
                <p className="text-sm text-gray-500">
                    Supported formats: {acceptedTypes.join(', ')} (Max {maxFiles} files)
                </p>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-900">Selected Files ({files.length})</h4>
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload {files.length} Files
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
