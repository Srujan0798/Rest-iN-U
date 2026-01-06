'use client';

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BarChartProps {
    data: any[];
    xKey: string;
    yKey: string;
}

export function BarChart({ data, xKey, yKey }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data}>
                <XAxis dataKey={xKey} stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey={yKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
