/**
 * DifficultyBadge 컴포넌트
 *
 * 코스 난이도를 시각적으로 구분하는 배지 컴포넌트입니다.
 * - 쉬움: outline (테두리만)
 * - 보통: secondary (회색 배경)
 * - 어려움: destructive (빨간 배경)
 *
 * 사용 예시:
 * <DifficultyBadge difficulty="어려움" />
 */

import { Badge } from "@/components/ui/badge";
import { TrailDifficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

// =====================================================
// Props 타입 정의
// =====================================================

interface DifficultyBadgeProps {
  /** 표시할 난이도 값 */
  difficulty: TrailDifficulty;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

// =====================================================
// 난이도별 Badge variant 및 색상 매핑
// =====================================================

const difficultyConfig: Record<
  TrailDifficulty,
  { label: string; className: string }
> = {
  쉬움: {
    label: "쉬움",
    // 초록색 계열로 쉬운 난이도를 표현
    className: "border-green-400 text-green-700 dark:border-green-600 dark:text-green-400 bg-transparent",
  },
  보통: {
    label: "보통",
    // 기본 secondary 스타일 (회색 배경)
    className: "bg-secondary text-secondary-foreground",
  },
  어려움: {
    label: "어려움",
    // 빨간 계열로 어려운 난이도를 강조
    className: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400 border-destructive/30",
  },
};

/**
 * DifficultyBadge
 *
 * 난이도에 따라 색상이 달라지는 배지 컴포넌트입니다.
 * shadcn/ui Badge 컴포넌트를 베이스로 사용합니다.
 */
export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
      aria-label={`난이도: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}
