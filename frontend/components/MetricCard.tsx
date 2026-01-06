'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
}

export function MetricCard({
    title,
    value,
    icon,
    trend,
    trendUp = true,
}: MetricCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {trend && (
                            <p
                                className={cn(
                                    'text-xs font-medium',
                                    trendUp ? 'text-green-600' : 'text-red-600'
                                )}
                            >
                                {trend} from last month
                            </p>
                        )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
