/**
 * AdminSummaryCard 컴포넌트
 *
 * 관리자 대시보드 상단에 표시하는 요약 통계 카드입니다.
 * 전체 코스 수, 게시된 코스 수, 완보 코스 수 등을 표시합니다.
 *
 * 사용 예시:
 * <AdminSummaryCard label="전체 코스" count={12} />
 * <AdminSummaryCard label="게시된 코스" count={8} className="border-blue-200" />
 */

import { cn } from '@/lib/utils';

// =====================================================
// Props 타입 정의
// =====================================================

interface AdminSummaryCardProps {
  /** 카드 레이블 (예: "전체 코스", "게시된 코스") */
  label: string;
  /** 표시할 숫자 */
  count: number;
  /** 로딩 중 여부 */
  isLoading?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * AdminSummaryCard
 *
 * 대시보드 상단의 요약 통계 카드 컴포넌트입니다.
 * 레이블과 숫자를 카드 형태로 표시합니다.
 */
export function AdminSummaryCard({ label, count, isLoading = false, className }: AdminSummaryCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-5',
        'dark:border-slate-800 dark:bg-slate-900',
        'transition-opacity',
        isLoading && 'opacity-50',
        className
      )}
    >
      {/* 레이블 */}
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </p>

      {/* 숫자 */}
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {isLoading ? '-' : count.toLocaleString()}
      </p>
    </div>
  );
}
