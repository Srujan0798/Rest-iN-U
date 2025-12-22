'use client';

import React from 'react';

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', animate = true }) => {
  return (
    <div
      className={`
        bg-gray-200 rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
};

// Text Line Skeleton
interface TextSkeletonProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  lastLineWidth = '60%',
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? '' : 'w-full'}`}
          style={index === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
};

// Avatar Skeleton
interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 'md',
  className = '',
}) => {
  return <Skeleton className={`${avatarSizes[size]} rounded-full ${className}`} />;
};

// Button Skeleton
interface ButtonSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  className?: string;
}

const buttonSizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'md',
  width = 'w-24',
  className = '',
}) => {
  return <Skeleton className={`${buttonSizes[size]} ${width} rounded-lg ${className}`} />;
};

// Image Skeleton
interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  className?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  aspectRatio = 'landscape',
  className = '',
}) => {
  return (
    <Skeleton className={`w-full ${aspectRatios[aspectRatio]} rounded-lg ${className}`}>
      <div className="flex items-center justify-center h-full">
        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm4.5-7.5l2.5 3.01L14.5 11l3 4H6l3.5-4.5z" />
        </svg>
      </div>
    </Skeleton>
  );
};

// Card Skeleton
interface CardSkeletonProps {
  hasImage?: boolean;
  imageAspect?: 'square' | 'video' | 'portrait' | 'landscape';
  lines?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasImage = true,
  imageAspect = 'landscape',
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 ${className}`}>
      {hasImage && <ImageSkeleton aspectRatio={imageAspect} className="rounded-none" />}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <TextSkeleton lines={lines} />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Property Card Skeleton
export const PropertyCardSkeleton: React.FC<{ variant?: 'default' | 'horizontal' | 'compact' }> = ({
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
        <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="w-72 flex-shrink-0">
          <ImageSkeleton aspectRatio="landscape" className="h-full rounded-none" />
        </div>
        <div className="flex-1 p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <TextSkeleton lines={2} />
          <div className="flex gap-2 pt-2">
            <ButtonSkeleton size="sm" width="w-24" />
            <ButtonSkeleton size="sm" width="w-28" />
          </div>
        </div>
      </div>
    );
  }

  // Default vertical card
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative">
        <ImageSkeleton aspectRatio="landscape" className="rounded-none" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
        <div className="absolute bottom-3 right-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

// Table Skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="flex gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-6 py-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// List Skeleton
interface ListSkeletonProps {
  items?: number;
  hasAvatar?: boolean;
  hasAction?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  hasAvatar = true,
  hasAction = false,
  className = '',
}) => {
  return (
    <div className={`divide-y divide-gray-100 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          {hasAvatar && <AvatarSkeleton size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {hasAction && <ButtonSkeleton size="sm" width="w-20" />}
        </div>
      ))}
    </div>
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

// Chart Skeleton
interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie';
  className?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'bar',
  className = '',
}) => {
  if (type === 'pie') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Skeleton className="w-48 h-48 rounded-full" />
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={`h-64 flex items-end justify-between gap-2 px-4 ${className}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    );
  }

  // Bar chart
  return (
    <div className={`h-64 flex items-end justify-between gap-4 px-4 ${className}`}>
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <Skeleton
            className="w-full rounded-t"
            style={{ height: `${Math.random() * 70 + 20}%` }}
          />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <AvatarSkeleton size="xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <ButtonSkeleton size="md" width="w-24" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <Skeleton className="h-6 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
      <TextSkeleton lines={4} />
    </div>
  );
};

// Form Skeleton
interface FormSkeletonProps {
  fields?: number;
  hasSubmit?: boolean;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  hasSubmit = true,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      {hasSubmit && (
        <div className="flex gap-3 pt-4">
          <ButtonSkeleton size="lg" width="w-32" />
          <ButtonSkeleton size="lg" width="w-24" />
        </div>
      )}
    </div>
  );
};

// Dashboard Page Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <ButtonSkeleton size="sm" width="w-16" />
              <ButtonSkeleton size="sm" width="w-16" />
              <ButtonSkeleton size="sm" width="w-16" />
            </div>
          </div>
          <ChartSkeleton type="bar" />
        </div>
        
        {/* Activity Feed */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <Skeleton className="h-6 w-28 mb-6" />
          <ListSkeleton items={5} hasAvatar />
        </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-40" />
          <ButtonSkeleton size="md" width="w-32" />
        </div>
        <TableSkeleton rows={5} columns={6} />
      </div>
    </div>
  );
};

// Search Results Skeleton
interface SearchResultsSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
}

export const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({
  count = 6,
  layout = 'grid',
}) => {
  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} variant={layout === 'list' ? 'horizontal' : 'default'} />
      ))}
    </div>
  );
};

// Page Header Skeleton
export const PageHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <ButtonSkeleton size="md" width="w-28" />
          <ButtonSkeleton size="md" width="w-32" />
        </div>
      </div>
    </div>
  );
};

// Message/Chat Skeleton
export const MessageSkeleton: React.FC<{ isOwn?: boolean }> = ({ isOwn = false }) => {
  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && <AvatarSkeleton size="sm" />}
      <div className={`space-y-2 max-w-xs ${isOwn ? 'items-end' : ''}`}>
        <Skeleton className={`h-16 w-48 rounded-2xl ${isOwn ? 'rounded-br-none' : 'rounded-bl-none'}`} />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <MessageSkeleton />
      <MessageSkeleton isOwn />
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton isOwn />
    </div>
  );
};

// Export all
export default {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  ImageSkeleton,
  CardSkeleton,
  PropertyCardSkeleton,
  TableSkeleton,
  ListSkeleton,
  StatsCardSkeleton,
  ChartSkeleton,
  ProfileSkeleton,
  FormSkeleton,
  DashboardSkeleton,
  SearchResultsSkeleton,
  PageHeaderSkeleton,
  MessageSkeleton,
  ChatSkeleton,
};
