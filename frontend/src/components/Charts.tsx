'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Chart data interfaces
interface DataPoint {
  label: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    fill?: boolean;
  }[];
}

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

interface PieChartData {
  data: DataPoint[];
}

interface ChartProps {
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

// Default colors
const defaultColors = [
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#ef4444', // red-500
];

// Format number for display
const formatNumber = (value: number): string => {
  if (value >= 10000000) {
    return `â‚¹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `â‚¹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Line Chart Component
interface LineChartProps extends ChartProps {
  data: LineChartData;
  curved?: boolean;
}

export function LineChart({
  data,
  title,
  subtitle,
  className = '',
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  curved = true,
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ datasetIndex: number; pointIndex: number } | null>(null);
  
  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = 100; // percentage
  const chartHeight = height - padding.top - padding.bottom;
  
  // Calculate scales
  const allValues = data.datasets.flatMap(d => d.data);
  const maxValue = Math.max(...allValues) * 1.1;
  const minValue = Math.min(0, ...allValues);
  
  const scaleY = (value: number) => {
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };
  
  const scaleX = (index: number) => {
    return (index / (data.labels.length - 1)) * 100;
  };
  
  // Generate path for a dataset
  const generatePath = (values: number[]) => {
    const points = values.map((value, index) => ({
      x: scaleX(index),
      y: scaleY(value),
    }));
    
    if (curved) {
      // Generate smooth curve
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = (prev.x + curr.x) / 2;
        path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
      }
      return path;
    } else {
      return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }
  };
  
  // Generate Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = (maxValue - minValue) / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => minValue + step * i);
  }, [maxValue, minValue]);
  
  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Chart */}
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="text-gray-200">
              {yTicks.map((tick, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={padding.top + scaleY(tick)}
                  x2="100"
                  y2={padding.top + scaleY(tick)}
                  stroke="currentColor"
                  strokeDasharray="2"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          )}
          
          {/* Lines */}
          <g transform={`translate(0, ${padding.top})`}>
            {data.datasets.map((dataset, datasetIndex) => {
              const color = dataset.color || defaultColors[datasetIndex % defaultColors.length];
              const path = generatePath(dataset.data);
              
              return (
                <g key={datasetIndex}>
                  {/* Fill area */}
                  {dataset.fill && (
                    <motion.path
                      initial={animate ? { opacity: 0 } : undefined}
                      animate={{ opacity: 0.1 }}
                      d={`${path} L 100 ${chartHeight} L 0 ${chartHeight} Z`}
                      fill={color}
                    />
                  )}
                  
                  {/* Line */}
                  <motion.path
                    initial={animate ? { pathLength: 0 } : undefined}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  
                  {/* Points */}
                  {dataset.data.map((value, pointIndex) => (
                    <motion.circle
                      key={pointIndex}
                      initial={animate ? { scale: 0 } : undefined}
                      animate={{ scale: 1 }}
                      transition={{ delay: pointIndex * 0.05 }}
                      cx={`${scaleX(pointIndex)}%`}
                      cy={scaleY(value)}
                      r="4"
                      fill="white"
                      stroke={color}
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ datasetIndex, pointIndex })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-5 text-xs text-gray-500">
          {yTicks.reverse().map((tick, i) => (
            <span key={i}>{formatNumber(tick)}</span>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
          {data.labels.map((label, i) => (
            <span key={i} className="text-center">{label}</span>
          ))}
        </div>
        
        {/* Tooltip */}
        {showTooltip && hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
            style={{
              left: `${scaleX(hoveredPoint.pointIndex)}%`,
              top: padding.top + scaleY(data.datasets[hoveredPoint.datasetIndex].data[hoveredPoint.pointIndex]) - 30,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-medium">{data.datasets[hoveredPoint.datasetIndex].label}</p>
            <p>{formatNumber(data.datasets[hoveredPoint.datasetIndex].data[hoveredPoint.pointIndex])}</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.color || defaultColors[i % defaultColors.length] }}
              />
              <span className="text-sm text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Bar Chart Component
interface BarChartProps extends ChartProps {
  data: BarChartData;
  horizontal?: boolean;
  stacked?: boolean;
}

export function BarChart({
  data,
  title,
  subtitle,
  className = '',
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true,
  horizontal = false,
  stacked = false,
}: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ datasetIndex: number; barIndex: number } | null>(null);
  
  // Calculate max value
  const maxValue = stacked
    ? Math.max(...data.labels.map((_, i) => 
        data.datasets.reduce((sum, d) => sum + d.data[i], 0)
      )) * 1.1
    : Math.max(...data.datasets.flatMap(d => d.data)) * 1.1;
  
  const barWidth = 100 / data.labels.length / (stacked ? 1 : data.datasets.length) * 0.7;
  const barGap = barWidth * 0.3;
  
  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Chart */}
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
          {data.labels.map((label, barIndex) => {
            let cumulativeHeight = 0;
            
            return (
              <div key={barIndex} className="flex items-end gap-1" style={{ flex: 1 }}>
                {data.datasets.map((dataset, datasetIndex) => {
                  const value = dataset.data[barIndex];
                  const barHeight = (value / maxValue) * 100;
                  const color = dataset.color || defaultColors[datasetIndex % defaultColors.length];
                  
                  if (stacked) {
                    const prevHeight = cumulativeHeight;
                    cumulativeHeight += barHeight;
                    
                    return (
                      <motion.div
                        key={datasetIndex}
                        initial={animate ? { height: 0 } : undefined}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ delay: barIndex * 0.1, duration: 0.5 }}
                        className="absolute w-full rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: color,
                          bottom: `${prevHeight}%`,
                          left: 0,
                          right: 0,
                          maxWidth: '40px',
                          margin: '0 auto',
                        }}
                        onMouseEnter={() => setHoveredBar({ datasetIndex, barIndex })}
                        onMouseLeave={() => setHoveredBar(null)}
                      />
                    );
                  }
                  
                  return (
                    <motion.div
                      key={datasetIndex}
                      initial={animate ? { height: 0 } : undefined}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ delay: (barIndex * data.datasets.length + datasetIndex) * 0.05, duration: 0.5 }}
                      className="flex-1 max-w-[30px] rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: color }}
                      onMouseEnter={() => setHoveredBar({ datasetIndex, barIndex })}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4 text-xs text-gray-500">
          {data.labels.map((label, i) => (
            <span key={i} className="text-center truncate" style={{ flex: 1 }}>{label}</span>
          ))}
        </div>
        
        {/* Tooltip */}
        {hoveredBar && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg z-10">
            <p className="font-medium">{data.labels[hoveredBar.barIndex]}</p>
            <p className="text-gray-300">
              {data.datasets[hoveredBar.datasetIndex].label}: {formatNumber(data.datasets[hoveredBar.datasetIndex].data[hoveredBar.barIndex])}
            </p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: dataset.color || defaultColors[i % defaultColors.length] }}
              />
              <span className="text-sm text-gray-600">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Pie/Donut Chart Component
interface PieChartProps extends ChartProps {
  data: PieChartData;
  donut?: boolean;
  centerLabel?: string;
  centerValue?: string;
}

export function PieChart({
  data,
  title,
  subtitle,
  className = '',
  height = 300,
  showLegend = true,
  animate = true,
  donut = false,
  centerLabel,
  centerValue,
}: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  
  // Calculate total and percentages
  const total = data.data.reduce((sum, d) => sum + d.value, 0);
  
  // Generate pie slices
  const slices = useMemo(() => {
    let startAngle = -90; // Start from top
    
    return data.data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const endAngle = startAngle + angle;
      
      // Calculate arc path
      const largeArcFlag = angle > 180 ? 1 : 0;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const outerRadius = 45;
      const innerRadius = donut ? 25 : 0;
      
      const x1 = 50 + outerRadius * Math.cos(startRad);
      const y1 = 50 + outerRadius * Math.sin(startRad);
      const x2 = 50 + outerRadius * Math.cos(endRad);
      const y2 = 50 + outerRadius * Math.sin(endRad);
      
      const x3 = 50 + innerRadius * Math.cos(endRad);
      const y3 = 50 + innerRadius * Math.sin(endRad);
      const x4 = 50 + innerRadius * Math.cos(startRad);
      const y4 = 50 + innerRadius * Math.sin(startRad);
      
      const path = donut
        ? `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`
        : `M 50 50 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      startAngle = endAngle;
      
      return {
        ...item,
        path,
        percentage,
        color: item.color || defaultColors[index % defaultColors.length],
      };
    });
  }, [data.data, total, donut]);
  
  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Chart */}
      <div className="flex items-center justify-center gap-8">
        <div className="relative" style={{ width: height * 0.8, height: height * 0.8 }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slices.map((slice, index) => (
              <motion.path
                key={index}
                initial={animate ? { scale: 0, opacity: 0 } : undefined}
                animate={{ 
                  scale: hoveredSlice === index ? 1.05 : 1,
                  opacity: 1,
                }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                d={slice.path}
                fill={slice.color}
                className="cursor-pointer transition-transform origin-center"
                style={{ transformOrigin: '50% 50%' }}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            ))}
          </svg>
          
          {/* Center label for donut */}
          {donut && (centerLabel || centerValue) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span className="text-2xl font-bold text-gray-900">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="text-sm text-gray-500">{centerLabel}</span>
              )}
            </div>
          )}
          
          {/* Tooltip */}
          {hoveredSlice !== null && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg z-10 pointer-events-none">
              <p className="font-medium">{slices[hoveredSlice].label}</p>
              <p>{formatNumber(slices[hoveredSlice].value)} ({slices[hoveredSlice].percentage.toFixed(1)}%)</p>
            </div>
          )}
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-2">
            {slices.map((slice, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                  hoveredSlice !== null && hoveredSlice !== index ? 'opacity-50' : ''
                }`}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-600">{slice.label}</span>
                <span className="text-sm text-gray-400 ml-auto">
                  {slice.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Area Chart Component (variant of Line Chart)
interface AreaChartProps extends LineChartProps {
  gradient?: boolean;
}

export function AreaChart({
  data,
  gradient = true,
  ...props
}: AreaChartProps) {
  // Add fill to all datasets
  const filledData = {
    ...data,
    datasets: data.datasets.map(d => ({ ...d, fill: true })),
  };
  
  return <LineChart data={filledData} {...props} />;
}

// Stats Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'red';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  color = 'orange',
  className = '',
}: StatCardProps) {
  const colorClasses = {
    orange: 'from-orange-500 to-amber-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-violet-500',
    red: 'from-red-500 to-rose-500',
  };
  
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && (
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              )}
              {isNegative && (
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'
              }`}>
                {isPositive && '+'}{change}%
              </span>
              <span className="text-sm text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Progress Ring Component
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#f97316',
  label,
  className = '',
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{percentage.toFixed(0)}%</span>
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  );
}

// Export types
export type { DataPoint, LineChartData, BarChartData, PieChartData };
