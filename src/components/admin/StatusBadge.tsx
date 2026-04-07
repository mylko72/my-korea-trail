/**
 * StatusBadge 컴포넌트
 *
 * 완보/미완, 게시됨/미게시 상태를 시각적으로 표시하는 배지입니다.
 * shadcn/ui Badge 컴포넌트를 기반으로 상태에 따라 색상을 변경합니다.
 *
 * 사용 예시:
 * <StatusBadge type="completed" value={true} />
 * <StatusBadge type="published" value={false} />
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// =====================================================
// Props 타입 정의
// =====================================================

interface StatusBadgeProps {
  /** 배지 타입: 완보 여부 또는 게시 여부 */
  type: 'completed' | 'published';
  /** 상태 값 */
  value: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

// =====================================================
// 상태별 스타일 및 레이블 매핑
// =====================================================

const statusConfig = {
  completed: {
    true: {
      label: '완보',
      className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    },
    false: {
      label: '미완',
      className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700',
    },
  },
  published: {
    true: {
      label: '게시됨',
      className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    },
    false: {
      label: '미게시',
      className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700',
    },
  },
} as const;

/**
 * StatusBadge
 *
 * 코스의 완보 여부 또는 게시 여부를 색상 배지로 표시합니다.
 */
export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  const config = statusConfig[type][String(value) as 'true' | 'false'];

  return (
    <Badge
      className={cn(
        'font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
