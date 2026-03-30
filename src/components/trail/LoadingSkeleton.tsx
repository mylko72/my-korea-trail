/**
 * LoadingSkeleton 컴포넌트
 *
 * 데이터 로딩 중에 표시하는 스켈레톤 UI 컴포넌트입니다.
 * 카드(card), 목록 행(list), 상세 페이지(detail) 세 가지 변형을 지원합니다.
 *
 * 사용 예시:
 * <LoadingSkeleton variant="card" />
 * <LoadingSkeleton variant="list" />
 * <LoadingSkeleton variant="detail" />
 */

import { cn } from "@/lib/utils";

// =====================================================
// Props 타입 정의
// =====================================================

interface LoadingSkeletonProps {
  /**
   * 스켈레톤 변형
   * - "card": 코스 목록 카드 스켈레톤
   * - "list": 테이블 목록 행 스켈레톤
   * - "detail": 상세 페이지 스켈레톤
   */
  variant?: "card" | "list" | "detail";
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

// =====================================================
// 공통 스켈레톤 박스 컴포넌트
// =====================================================

/** 단일 스켈레톤 블록 (애니메이션 포함) */
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted animate-pulse",
        className
      )}
      aria-hidden="true"
    />
  );
}

// =====================================================
// 카드 스켈레톤 변형
// =====================================================

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* 커버 이미지 영역 */}
      <SkeletonBlock className="h-48 w-full rounded-none" />

      {/* 카드 내용 영역 */}
      <div className="p-4 space-y-3">
        {/* 날짜 */}
        <SkeletonBlock className="h-3.5 w-28" />
        {/* 제목 */}
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className="h-5 w-3/5" />
        {/* 설명 */}
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
        {/* 메타 정보 (거리, 시간) */}
        <div className="flex gap-3 pt-2 border-t border-border/50">
          <SkeletonBlock className="h-3.5 w-16" />
          <SkeletonBlock className="h-3.5 w-16" />
          <SkeletonBlock className="h-3.5 w-12" />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// 목록(테이블 행) 스켈레톤 변형
// =====================================================

function ListSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-3 px-4 border-b border-border",
        className
      )}
      aria-hidden="true"
    >
      {/* 제목 */}
      <SkeletonBlock className="h-4 flex-1" />
      {/* 날짜 */}
      <SkeletonBlock className="h-4 w-24 shrink-0" />
      {/* 거리 */}
      <SkeletonBlock className="h-4 w-16 shrink-0" />
      {/* 배지 */}
      <SkeletonBlock className="h-5 w-14 rounded-full shrink-0" />
    </div>
  );
}

// =====================================================
// 상세 페이지 스켈레톤 변형
// =====================================================

function DetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)} aria-hidden="true">
      {/* 커버 이미지 */}
      <SkeletonBlock className="h-72 md:h-96 w-full rounded-xl" />

      {/* 헤더 영역 */}
      <div className="space-y-3 px-4 md:px-0">
        {/* 카테고리 배지 + 날짜 */}
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-5 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        {/* 제목 */}
        <SkeletonBlock className="h-8 w-3/4" />
        <SkeletonBlock className="h-8 w-1/2" />
      </div>

      {/* 메타 정보 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      {/* 본문 콘텐츠 */}
      <div className="space-y-3 px-4 md:px-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={cn("h-4", i % 3 === 2 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * LoadingSkeleton
 *
 * 로딩 상태를 표시하는 스켈레톤 UI 컴포넌트입니다.
 * variant prop으로 카드/목록/상세 세 가지 형태를 선택할 수 있습니다.
 */
export function LoadingSkeleton({
  variant = "card",
  className,
}: LoadingSkeletonProps) {
  switch (variant) {
    case "list":
      return <ListSkeleton className={className} />;
    case "detail":
      return <DetailSkeleton className={className} />;
    case "card":
    default:
      return <CardSkeleton className={className} />;
  }
}
