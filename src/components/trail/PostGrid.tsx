/**
 * PostGrid 컴포넌트 (F002)
 *
 * 게시글 카드를 반응형 그리드로 배치하는 래퍼 컴포넌트입니다.
 * 빈 결과 상태와 로딩 상태를 내부에서 처리합니다.
 *
 * 사용 예시:
 * <PostGrid posts={filteredPosts} isLoading={isLoading} />
 */

import { PackageSearch } from "lucide-react";

import { TrailPost } from "@/lib/types";
import { TrailCard } from "@/components/trail/TrailCard";
import { LoadingSkeleton } from "@/components/trail/LoadingSkeleton";
import { cn } from "@/lib/utils";

// =====================================================
// Props 타입 정의
// =====================================================

interface PostGridProps {
  /** 표시할 코스 게시글 목록 */
  posts: TrailPost[];
  /** 로딩 중 여부 (true이면 스켈레톤 UI 표시) */
  isLoading?: boolean;
  /**
   * 빈 결과 시 표시할 커스텀 메시지
   * 기본값: "코스 기록이 없습니다."
   */
  emptyMessage?: string;
  /**
   * 빈 결과 시 표시할 부가 설명
   * 기본값: "다른 검색어나 필터를 사용해 보세요."
   */
  emptyDescription?: string;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

/**
 * PostGrid
 *
 * 코스 카드 목록을 반응형 그리드로 렌더링하는 래퍼입니다.
 * - 로딩 중: 스켈레톤 카드 6개 표시
 * - 빈 결과: EmptyState UI 표시
 * - 정상: TrailCard 그리드 표시
 *
 * 그리드 레이아웃:
 * - 모바일(기본): 1열
 * - 태블릿(md:): 2열
 * - 데스크톱(lg:): 3열
 */
export function PostGrid({
  posts,
  isLoading = false,
  emptyMessage = "코스 기록이 없습니다.",
  emptyDescription = "다른 검색어나 필터를 사용해 보세요.",
  className,
}: PostGridProps) {
  // 로딩 중: 스켈레톤 카드 표시
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
        aria-busy="true"
        aria-label="코스 목록 로딩 중"
      >
        {/* 스켈레톤 카드 6개 렌더링 */}
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="card" />
        ))}
      </div>
    );
  }

  // 빈 결과: EmptyState UI 표시
  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-20 px-4 text-center",
          className
        )}
        role="status"
        aria-label="검색 결과 없음"
      >
        <PackageSearch
          className="h-12 w-12 text-muted-foreground/40 mb-4"
          aria-hidden="true"
        />
        <p className="text-lg font-medium text-foreground mb-1">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  // 정상: 게시글 카드 그리드 렌더링
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
      aria-label={`코스 목록 ${posts.length}개`}
    >
      {posts.map((post, index) => (
        <TrailCard
          key={post.id}
          post={post}
          // 첫 3개 카드(뷰포트 최상단)는 priority 이미지 로딩 적용
          priority={index < 3}
        />
      ))}
    </div>
  );
}
