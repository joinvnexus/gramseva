'use client';

import { useState } from 'react';
import { Report } from '@/types';
import ReportStatus from './ReportStatus';
import { toBanglaDate } from '@/utils/bengaliHelper';
import { MapPin, Droplets, Zap, FileText, ThumbsUp, User, MapPinned } from 'lucide-react';
import Image from 'next/image';

interface ReportCardProps {
  report: Report;
  onVote?: (id: string) => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  RESOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
};

const statusText = {
  PENDING: 'বিচারাধীন',
  PROCESSING: 'প্রক্রিয়াধীন',
  RESOLVED: 'সমাধান',
};

const problemTypeIcons: Record<string, React.ElementType> = {
  ROAD: MapPinned,
  WATER: Droplets,
  ELECTRICITY: Zap,
  OTHER: FileText,
};

export default function ReportCard({ report, onVote }: ReportCardProps) {
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    await onVote?.(report.id);
    setVoting(false);
  };

  const ProblemIcon = problemTypeIcons[report.problemType] || FileText;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* হেডার */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
              <ProblemIcon className="w-4 h-4" />
            </span>
            <ReportStatus status={report.status} size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {toBanglaDate(report.createdAt)}
            </span>
          </div>

          {/* বিবরণ */}
          <p className="text-gray-700 dark:text-gray-300 mb-3">{report.description}</p>

          {/* ইউজার ও লোকেশন */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {report.user?.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {report.user?.village}
            </span>
          </div>

          {/* ছবি (যদি থাকে) */}
          {report.imageUrl && (
            <div className="mt-3">
              <Image
                src={report.imageUrl}
                alt="Report"
                width={300}
                height={128}
                className="h-32 w-auto rounded object-cover"
              />
            </div>
          )}
        </div>

        {/* ভোট বাটন */}
        <button
          onClick={handleVote}
          disabled={voting}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ThumbsUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-semibold mt-1 text-gray-700 dark:text-gray-300">
            {report.upVotes ?? (report as any).upvoteCount ?? 0}
          </span>
        </button>
      </div>
    </div>
  );
}
