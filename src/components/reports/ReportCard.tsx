'use client';

import { useState } from 'react';
import { Report } from '@/types';
import ReportStatus from './ReportStatus';
import { toBanglaDate } from '@/utils/bengaliHelper';

interface ReportCardProps {
  report: Report;
  onVote?: (id: string) => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

const statusText = {
  PENDING: 'বিচারাধীন',
  PROCESSING: 'প্রক্রিয়াধীন',
  RESOLVED: 'সমাধান済み',
};

const problemTypeIcons = {
  ROAD: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  OTHER: '📝',
};

export default function ReportCard({ report, onVote }: ReportCardProps) {
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    if (voting) return;
    setVoting(true);
    await onVote?.(report.id);
    setVoting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* হেডার */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-2xl">{problemTypeIcons[report.problemType]}</span>
            <ReportStatus status={report.status} size="sm" />
            <span className="text-xs text-gray-500">
              {toBanglaDate(report.createdAt)}
            </span>
          </div>

          {/* বিবরণ */}
          <p className="text-gray-700 mb-3">{report.description}</p>

          {/* ইউজার ও লোকেশন */}
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              👤 {report.user?.name}
            </span>
            <span className="flex items-center gap-1">
              📍 {report.user?.village}
            </span>
          </div>

          {/* ছবি (যদি থাকে) */}
          {report.imageUrl && (
            <div className="mt-3">
              <img
                src={report.imageUrl}
                alt="Report"
                className="h-32 w-auto rounded object-cover"
              />
            </div>
          )}
        </div>

        {/* ভোট বাটন */}
        <button
          onClick={handleVote}
          disabled={voting}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition"
        >
          <span className="text-2xl">👍</span>
          <span className="text-sm font-semibold mt-1">
            {report.upVotes ?? (report as any).upvoteCount ?? 0}
          </span>
        </button>
      </div>
    </div>
  );
}
