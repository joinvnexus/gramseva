'use client';

interface ReportStatusProps {
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PENDING: {
    label: 'বিচারাধীন',
    icon: '⏳',
    color: 'bg-yellow-100 text-yellow-800',
  },
  PROCESSING: {
    label: 'প্রক্রিয়াধীন',
    icon: '🔄',
    color: 'bg-blue-100 text-blue-800',
  },
  RESOLVED: {
    label: 'সমাধান済み',
    icon: '✅',
    color: 'bg-green-100 text-green-800',
  },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function ReportStatus({ status, size = 'md' }: ReportStatusProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}