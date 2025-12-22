'use client';

import { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// File with preview interface
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

// Component props
interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (file: UploadedFile) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  uploadedFiles?: UploadedFile[];
  variant?: 'default' | 'compact' | 'avatar';
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

// File type icons
const fileTypeIcons: Record<string, JSX.Element> = {
  image: (
    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  pdf: (
    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  spreadsheet: (
    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  default: (
    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeCategory = (type: string): string => {
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'pdf';
  if (type.includes('word') || type.includes('document')) return 'document';
  if (type.includes('sheet') || type.includes('excel')) return 'spreadsheet';
  if (type.startsWith('video/')) return 'video';
  return 'default';
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// File preview component
const FilePreview = ({
  file,
  onRemove,
  showProgress,
}: {
  file: UploadedFile;
  onRemove: () => void;
  showProgress: boolean;
}) => {
  const category = getFileTypeCategory(file.type);
  const isImage = category === 'image';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden"
    >
      {/* Preview */}
      <div className="aspect-square flex items-center justify-center bg-gray-50 overflow-hidden">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            {fileTypeIcons[category] || fileTypeIcons.default}
            <span className="mt-2 text-xs text-gray-500 uppercase">
              {file.name.split('.').pop()}
            </span>
          </div>
        )}
        
        {/* Status overlay */}
        {file.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {file.status === 'error' && (
          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )}
        
        {file.status === 'complete' && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* File info */}
      <div className="p-2">
        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        
        {/* Progress bar */}
        {showProgress && file.status === 'uploading' && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${file.progress}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
          </div>
        )}
        
        {/* Error message */}
        {file.error && (
          <p className="text-xs text-red-500 mt-1">{file.error}</p>
        )}
      </div>
    </motion.div>
  );
};

// File list item component
const FileListItem = ({
  file,
  onRemove,
  showProgress,
}: {
  file: UploadedFile;
  onRemove: () => void;
  showProgress: boolean;
}) => {
  const category = getFileTypeCategory(file.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
    >
      {/* Icon or preview */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
        {category === 'image' && file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="scale-75">
            {fileTypeIcons[category] || fileTypeIcons.default}
          </div>
        )}
      </div>
      
      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        
        {/* Progress bar */}
        {showProgress && file.status === 'uploading' && (
          <div className="mt-1">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${file.progress}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
          </div>
        )}
        
        {file.error && (
          <p className="text-xs text-red-500 mt-1">{file.error}</p>
        )}
      </div>
      
      {/* Status */}
      <div className="flex-shrink-0">
        {file.status === 'uploading' && (
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        )}
        {file.status === 'complete' && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {file.status === 'error' && (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        {file.status === 'pending' && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Main FileUpload component
export default function FileUpload({
  onFilesSelected,
  onFileRemove,
  onUpload,
  accept = '*/*',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  showPreview = true,
  showProgress = true,
  uploadedFiles: externalFiles,
  variant = 'default',
  label = 'Upload files',
  description = 'Drag and drop files here, or click to browse',
  className = '',
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(externalFiles || []);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Validate file
  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`;
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'));
        }
        return file.type === type;
      });
      
      if (!isAccepted) {
        return `File type not accepted`;
      }
    }
    
    return null;
  };
  
  // Create file preview
  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise(resolve => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  };
  
  // Process files
  const processFiles = useCallback(async (fileList: FileList) => {
    setError(null);
    
    const newFiles: File[] = [];
    const errors: string[] = [];
    
    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;
    
    if (availableSlots <= 0) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const filesToProcess = Array.from(fileList).slice(0, availableSlots);
    
    for (const file of filesToProcess) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        newFiles.push(file);
      }
    }
    
    if (errors.length > 0) {
      setError(errors.join(', '));
    }
    
    if (newFiles.length === 0) return;
    
    // Create upload file objects with previews
    const uploadFiles: UploadedFile[] = await Promise.all(
      newFiles.map(async file => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: await createPreview(file),
        progress: 0,
        status: 'pending' as const,
      }))
    );
    
    setFiles(prev => [...prev, ...uploadFiles]);
    onFilesSelected?.(newFiles);
  }, [files.length, maxFiles, maxSize, accept, onFilesSelected]);
  
  // Handle drag events
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles && droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };
  
  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  // Remove file
  const handleRemoveFile = (fileToRemove: UploadedFile) => {
    setFiles(prev => prev.filter(f => f.id !== fileToRemove.id));
    // Revoke preview URL to free memory
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onFileRemove?.(fileToRemove);
  };
  
  // Click to upload
  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };
  
  // Render avatar variant
  if (variant === 'avatar') {
    const currentFile = files[0];
    
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex items-center gap-4">
          {/* Avatar preview */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
              {currentFile?.preview ? (
                <img
                  src={currentFile.preview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <button
              onClick={handleClick}
              disabled={disabled}
              className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }
  
  // Render compact variant
  if (variant === 'compact') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <button
          onClick={handleClick}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>{label}</span>
        </button>
        
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {files.map(file => (
                <FileListItem
                  key={file.id}
                  file={file}
                  onRemove={() => handleRemoveFile(file)}
                  showProgress={showProgress}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }
  
  // Render default variant
  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      {/* Drop zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        animate={{
          borderColor: isDragging ? '#f97316' : '#e5e7eb',
          backgroundColor: isDragging ? '#fff7ed' : '#f9fafb',
        }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-400 hover:bg-orange-50/50'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <p className="text-lg font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Max {formatFileSize(maxSize)}</span>
            <span>â€¢</span>
            <span>Up to {maxFiles} files</span>
            {accept !== '*/*' && (
              <>
                <span>â€¢</span>
                <span>{accept}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-orange-50 border-2 border-orange-500 border-dashed rounded-xl flex items-center justify-center"
            >
              <div className="text-center">
                <svg className="w-12 h-12 text-orange-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <p className="text-orange-600 font-medium">Drop files here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
      
      {/* File previews */}
      {showPreview && files.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => {
                files.forEach(f => {
                  if (f.preview) URL.revokeObjectURL(f.preview);
                });
                setFiles([]);
              }}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {files.map(file => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onRemove={() => handleRemoveFile(file)}
                  showProgress={showProgress}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Upload button */}
      {files.length > 0 && onUpload && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onUpload(files.map(f => f.file))}
            disabled={files.some(f => f.status === 'uploading')}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {files.some(f => f.status === 'uploading') ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Export types
export type { UploadedFile, FileUploadProps };
