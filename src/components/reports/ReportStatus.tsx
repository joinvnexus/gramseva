'use client';

import { Clock, RefreshCw, CheckCircle } from 'lucide-react';

interface ReportStatusProps {
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PENDING: {
    label: 'বিচারাধীন',
    icon: Clock,
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  },
  PROCESSING: {
    label: 'প্রক্রিয়াধীন',
    icon: RefreshCw,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  },
  RESOLVED: {
    label: 'সমাধান',
    icon: CheckCircle,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function ReportStatus({ status, size = 'md' }: ReportStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}