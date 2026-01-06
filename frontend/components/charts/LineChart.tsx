'use client';

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LineChartProps {
    data: any[];
    xKey: string;
    yKey: string;
}

export function LineChart({ data, xKey, yKey }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data}>
                <XAxis dataKey={xKey} stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey={yKey}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
}
