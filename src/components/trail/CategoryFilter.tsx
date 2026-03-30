/**
 * CategoryFilter 컴포넌트 (F004)
 *
 * 카테고리 탭/버튼 필터 컴포넌트입니다.
 * "전체" 선택을 포함하며, 선택된 카테고리를 시각적으로 강조합니다.
 *
 * 사용 예시:
 * <CategoryFilter selected="동해안" onChange={(cat) => setCategory(cat)} />
 */

"use client";

import { TrailCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// =====================================================
// Props 타입 정의
// =====================================================

interface CategoryFilterProps {
  /** 현재 선택된 카테고리 (null이면 "전체" 선택됨) */
  selected: TrailCategory | null;
  /** 카테고리 변경 시 호출되는 콜백 */
  onChange: (category: TrailCategory | null) => void;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

// =====================================================
// 카테고리 목록 (순서 고정)
// =====================================================

const CATEGORIES: TrailCategory[] = ["동해안", "남해안", "서해안", "DMZ", "지리산"];

// 카테고리별 색상 강조 클래스 (활성 상태일 때 적용)
const categoryActiveColorMap: Record<TrailCategory, string> = {
  동해안: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
  남해안: "bg-teal-500 hover:bg-teal-600 text-white border-teal-500",
  서해안: "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
  DMZ: "bg-slate-600 hover:bg-slate-700 text-white border-slate-600",
  지리산: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500",
};

/**
 * CategoryFilter
 *
 * 카테고리 선택 필터 컴포넌트입니다.
 * "전체" + 5개 카테고리 버튼으로 구성됩니다.
 * 클라이언트 컴포넌트이며 상위에서 상태를 관리합니다.
 */
export function CategoryFilter({ selected, onChange, className }: CategoryFilterProps) {
  return (
    <nav
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="카테고리 필터"
      role="group"
    >
      {/* 전체 버튼 */}
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={selected === null}
        className={cn(
          // 기본 스타일
          "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // 선택 상태 스타일
          selected === null
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground bg-transparent"
        )}
      >
        전체
      </button>

      {/* 카테고리별 버튼 */}
      {CATEGORIES.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={cn(
              // 기본 스타일
              "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              // 활성 vs 비활성 스타일
              isActive
                ? categoryActiveColorMap[category]
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground bg-transparent"
            )}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
