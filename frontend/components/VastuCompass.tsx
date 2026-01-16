import React from 'react';

interface VastuCompassProps {
  zoneScores: Record<string, number>;
  className?: string;
  size?: number;
}

export const VastuCompass: React.FC<VastuCompassProps> = ({
  zoneScores,
  className = '',
  size = 300
}) => {
  const center = size / 2;
  const radius = (size / 2) - 10; // Padding
  const innerRadius = radius * 0.3; // Center hole size

  // Order matters for drawing the slices
  const zones = [
    { key: 'NORTH', label: 'N', angle: -90 },
    { key: 'NORTH_EAST', label: 'NE', angle: -45 },
    { key: 'EAST', label: 'E', angle: 0 },
    { key: 'SOUTH_EAST', label: 'SE', angle: 45 },
    { key: 'SOUTH', label: 'S', angle: 90 },
    { key: 'SOUTH_WEST', label: 'SW', angle: 135 },
    { key: 'WEST', label: 'W', angle: 180 },
    { key: 'NORTH_WEST', label: 'NW', angle: 225 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green-500
    if (score >= 60) return '#eab308'; // Yellow-500
    return '#ef4444'; // Red-500
  };

  const getSlicePath = (startAngle: number, endAngle: number, r: number, innerR: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + r * Math.cos(startRad);
    const y1 = center + r * Math.sin(startRad);
    const x2 = center + r * Math.cos(endRad);
    const y2 = center + r * Math.sin(endRad);

    const x3 = center + innerR * Math.cos(endRad);
    const y3 = center + innerR * Math.sin(endRad);
    const x4 = center + innerR * Math.cos(startRad);
    const y4 = center + innerR * Math.sin(startRad);

    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Mystical Glow Background */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-20 bg-amber-500"
        style={{ transform: 'scale(0.9)' }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Decorative Outer Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          strokeOpacity="0.1"
          strokeDasharray="4 4"
        />

        {/* Zones */}
        {zones.map((zone) => {
          const score = zoneScores[zone.key] || 70; // Default to neutral if missing
          const startAngle = zone.angle - 22.5;
          const endAngle = zone.angle + 22.5;
          const color = getScoreColor(score);

          return (
            <g key={zone.key} className="transition-all duration-300 hover:opacity-90 cursor-pointer group">
              {/* Slice */}
              <path
                d={getSlicePath(startAngle, endAngle, radius, innerRadius)}
                fill={color}
                stroke="white"
                strokeWidth="2"
                opacity="0.8"
              >
                <title>{`${zone.label}: ${score}/100`}</title>
              </path>

              {/* Text Label */}
              <text
                x={center + (radius * 0.7) * Math.cos((zone.angle * Math.PI) / 180)}
                y={center + (radius * 0.7) * Math.sin((zone.angle * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {zone.label}
              </text>

              {/* Score on Hover (or small visible) */}
               <text
                x={center + (radius * 0.5) * Math.cos((zone.angle * Math.PI) / 180)}
                y={center + (radius * 0.5) * Math.sin((zone.angle * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="10"
                fontWeight="normal"
              >
                {score}
              </text>
            </g>
          );
        })}

        {/* Center Brahma Sthana */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 2}
          fill="white"
          className="drop-shadow-md"
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          className="text-amber-600 font-bold"
        >
          ॐ
        </text>
      </svg>
    </div>
  );
};
