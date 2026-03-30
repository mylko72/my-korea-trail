/**
 * CategoryPageClient 컴포넌트
 *
 * 카테고리 페이지의 클라이언트 사이드 로직을 담당합니다.
 * 카테고리 필터(F004), 날짜 필터(F005), 게시글 목록(F002)을 통합합니다.
 *
 * "use client"가 필요한 이유:
 * - CategoryFilter, DateFilter, SearchBar는 상태 기반 인터랙션을 사용
 * - useState로 필터 상태를 관리합니다
 *
 * 사용 예시:
 * <CategoryPageClient
 *   initialPosts={posts}
 *   currentCategory="동해안"
 *   categorySlug="east-coast"
 * />
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "@/components/trail/CategoryFilter";
import { DateFilter } from "@/components/trail/DateFilter";
import { PostGrid } from "@/components/trail/PostGrid";
import {
  filterPostsByCategory,
  filterByDateRange,
} from "@/lib/mockData";
import type { TrailPost, TrailCategory } from "@/lib/types";

// =====================================================
// Props 타입 정의
// =====================================================

interface CategoryPageClientProps {
  /** 서버에서 전달받은 초기 게시글 목록 */
  initialPosts: TrailPost[];
  /** 현재 페이지의 카테고리명 (한국어) */
  currentCategory: TrailCategory;
  /** 현재 페이지의 카테고리 슬러그 (URL) */
  categorySlug: string;
}

/**
 * CategoryPageClient
 *
 * 카테고리별 게시글 목록과 필터 UI를 통합한 클라이언트 컴포넌트입니다.
 * CategoryFilter(F004), DateFilter(F005), PostGrid(F002)를 조합합니다.
 *
 * 필터 적용 순서:
 * 1. 카테고리 필터: 선택된 카테고리로 범위 좁히기 (null이면 전체)
 * 2. 날짜 필터: from/to 날짜 범위로 추가 필터링
 */
export function CategoryPageClient({
  initialPosts,
  currentCategory,
  categorySlug,
}: CategoryPageClientProps) {
  // =====================================================
  // 필터 상태 관리
  // =====================================================

  /** 카테고리 필터: null이면 현재 카테고리 전체 표시 */
  const [selectedCategory, setSelectedCategory] = useState<TrailCategory | null>(
    currentCategory
  );

  /** 날짜 필터: 시작일 */
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);

  /** 날짜 필터: 종료일 */
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  // =====================================================
  // 필터링 로직 (useMemo로 불필요한 재계산 방지)
  // =====================================================

  /** 카테고리 + 날짜 필터가 적용된 최종 게시글 목록 */
  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    // 1단계: 카테고리 필터 적용
    if (selectedCategory) {
      result = filterPostsByCategory(result, selectedCategory);
    }

    // 2단계: 날짜 범위 필터 적용
    if (fromDate || toDate) {
      result = filterByDateRange(result, fromDate, toDate);
    }

    return result;
  }, [initialPosts, selectedCategory, fromDate, toDate]);

  // =====================================================
  // 이벤트 핸들러
  // =====================================================

  /** 날짜 범위 변경 핸들러 */
  const handleDateChange = useCallback(
    ({ from, to }: { from?: string; to?: string }) => {
      setFromDate(from);
      setToDate(to);
    },
    []
  );

  /** 모든 필터 초기화 핸들러 */
  const handleResetFilters = useCallback(() => {
    setSelectedCategory(currentCategory);
    setFromDate(undefined);
    setToDate(undefined);
  }, [currentCategory]);

  // 필터가 기본값에서 변경되었는지 확인
  const hasActiveFilter =
    selectedCategory !== currentCategory || Boolean(fromDate) || Boolean(toDate);

  return (
    <div>
      {/* =========================================================
          필터 영역
          CategoryFilter, DateFilter, 초기화 버튼으로 구성됩니다.
          ========================================================= */}
      <div className="mb-8 space-y-4 rounded-xl border border-border bg-card p-4 md:p-6">
        {/* 카테고리 필터 (F004) */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            카테고리
          </h2>
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* 구분선 */}
        <div className="border-t border-border" />

        {/* 날짜 필터 + 초기화 버튼 행 (F005) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <DateFilter
            from={fromDate}
            to={toDate}
            onChange={handleDateChange}
          />

          {/* 필터 초기화 버튼: 활성 필터가 있을 때만 표시 */}
          {hasActiveFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="shrink-0 text-muted-foreground hover:text-foreground self-start sm:self-auto"
              aria-label="모든 필터 초기화"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              필터 초기화
            </Button>
          )}
        </div>
      </div>

      {/* 필터 결과 요약 */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPosts.length > 0 ? (
            <>
              <span className="font-medium text-foreground">
                {filteredPosts.length}개
              </span>
              의 코스 기록
            </>
          ) : (
            "조건에 맞는 코스가 없습니다."
          )}
        </p>
      </div>

      {/* =========================================================
          게시글 그리드 (F002)
          필터링된 결과를 PostGrid로 렌더링합니다.
          ========================================================= */}
      <PostGrid
        posts={filteredPosts}
        emptyMessage="조건에 맞는 코스 기록이 없습니다."
        emptyDescription="카테고리나 날짜 범위를 변경해 보세요."
      />
    </div>
  );
}
