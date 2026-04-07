/**
 * 관리자 페이지 로딩 상태
 *
 * Suspense fallback으로 표시됩니다.
 */

import { LoadingSkeleton } from '@/components/trail/LoadingSkeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      {/* 제목 스켈레톤 */}
      <div>
        <div className="mb-2 h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 요약 카드 스켈레톤 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-4 w-20 rounded-lg bg-slate-300 dark:bg-slate-700" />
            <div className="h-8 w-12 rounded-lg bg-slate-300 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <LoadingSkeleton key={i} variant="list" />
        ))}
      </div>
    </div>
  );
}
