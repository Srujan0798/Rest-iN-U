'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecommendedProperties } from '@/components/RecommendedProperties';
import { Sparkles } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Recommended for You</h1>
          <p className="text-muted-foreground mt-1">
            Personalized property recommendations based on your preferences
          </p>
        </div>
      </div>

      <RecommendedProperties limit={20} />
    </div>
  );
}
