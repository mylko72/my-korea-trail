/**
 * PrevNextNavigation 컴포넌트
 *
 * 코스 상세 페이지 하단에서 같은 카테고리의 이전/다음 게시글로 이동하는
 * 네비게이션 컴포넌트입니다. 날짜 내림차순 기준으로 이전/다음을 결정합니다.
 *
 * 이전/다음 정의:
 * - 날짜 내림차순 정렬 기준
 * - "이전" = 현재 게시글보다 더 오래된 게시글 (날짜가 더 이전)
 * - "다음" = 현재 게시글보다 더 최신 게시글 (날짜가 더 최신)
 *
 * 사용 예시:
 * <PrevNextNavigation currentPost={post} allPosts={categoryPosts} />
 */

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TrailPost } from "@/lib/types";
import { categoryToSlug, formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

// =====================================================
// Props 타입 정의
// =====================================================

interface PrevNextNavigationProps {
  /** 현재 표시 중인 게시글 */
  currentPost: TrailPost;
  /** 같은 카테고리의 게시글 전체 목록 (필터링용) */
  allPosts: TrailPost[];
}

// =====================================================
// 네비게이션 링크 아이템 타입
// =====================================================

interface NavItem {
  post: TrailPost;
  href: string;
}

/**
 * PrevNextNavigation
 *
 * 현재 게시글 기준으로 이전/다음 게시글 링크를 렌더링합니다.
 * 날짜 내림차순으로 정렬된 배열에서 인접한 항목을 찾습니다.
 * 인접 게시글이 없으면 해당 방향 링크를 비활성화합니다.
 */
export function PrevNextNavigation({ currentPost, allPosts }: PrevNextNavigationProps) {
  // =====================================================
  // 이전/다음 게시글 계산
  // 날짜 내림차순 정렬 후 현재 게시글 인덱스 기준으로 결정
  // =====================================================

  // 1. 날짜 내림차순 정렬 (최신 → 오래된 순)
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 2. 현재 게시글 인덱스 탐색
  const currentIndex = sortedPosts.findIndex((p) => p.id === currentPost.id);

  // 3. 이전/다음 게시글 결정
  // "다음"(newer) = 정렬 배열에서 인덱스 -1 (더 최신)
  // "이전"(older) = 정렬 배열에서 인덱스 +1 (더 오래된)
  const newerPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const olderPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // 4. href 생성 헬퍼
  const toNavItem = (post: TrailPost | null): NavItem | null => {
    if (!post) return null;
    return {
      post,
      href: `/${categoryToSlug(post.category)}/${post.slug}`,
    };
  };

  const prevItem = toNavItem(olderPost);  // 이전 = 더 오래된
  const nextItem = toNavItem(newerPost);  // 다음 = 더 최신

  // 이전/다음 모두 없는 경우 렌더링하지 않음
  if (!prevItem && !nextItem) return null;

  return (
    <nav
      className="flex items-stretch justify-between gap-4"
      aria-label="이전/다음 코스 네비게이션"
    >
      {/* =====================================================
          이전 게시글 링크 (더 오래된)
          ===================================================== */}
      <div className="flex-1">
        {prevItem ? (
          <Link
            href={prevItem.href}
            className={cn(
              "group flex h-full flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-4",
              "hover:border-primary/40 hover:bg-muted/40 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={`이전 코스: ${prevItem.post.title}`}
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
              이전 기록
            </span>
            <span className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {prevItem.post.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatShortDate(prevItem.post.date)}
            </span>
          </Link>
        ) : (
          /* 이전 게시글 없음: 빈 영역 유지 */
          <div className="h-full rounded-xl border border-dashed border-border/50 p-4 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/40">첫 번째 기록</span>
          </div>
        )}
      </div>

      {/* =====================================================
          다음 게시글 링크 (더 최신)
          ===================================================== */}
      <div className="flex-1">
        {nextItem ? (
          <Link
            href={nextItem.href}
            className={cn(
              "group flex h-full flex-col items-end gap-1.5 rounded-xl border border-border bg-card p-4",
              "hover:border-primary/40 hover:bg-muted/40 transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={`다음 코스: ${nextItem.post.title}`}
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              다음 기록
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold leading-snug line-clamp-2 text-right text-foreground group-hover:text-primary transition-colors">
              {nextItem.post.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatShortDate(nextItem.post.date)}
            </span>
          </Link>
        ) : (
          /* 다음 게시글 없음: 빈 영역 유지 */
          <div className="h-full rounded-xl border border-dashed border-border/50 p-4 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/40">마지막 기록</span>
          </div>
        )}
      </div>
    </nav>
  );
}
