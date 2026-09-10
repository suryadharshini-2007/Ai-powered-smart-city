import React from 'react';

interface MetricGaugeProps {
  value: number; // 0 to 100
  label: string;
  unit?: string;
  color?: string; // e.g. '#10b981'
  size?: number;
  sublabel?: string;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({
  value,
  label,
  unit = '%',
  color = '#10b981',
  size = 120,
  sublabel,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc representing 75% circle (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, value))) / 100;

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-135"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {Math.round(value)}
            <span className="text-xs font-medium text-slate-400 ml-0.5">{unit}</span>
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 max-w-[85px] truncate">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <span className="text-[11px] text-slate-400 mt-1 text-center">{sublabel}</span>
      )}
    </div>
  );
};
