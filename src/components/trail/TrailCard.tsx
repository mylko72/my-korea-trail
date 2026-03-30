/**
 * TrailCard 컴포넌트 (F002)
 *
 * 코스 목록 페이지에서 개별 게시글을 카드 형태로 표시합니다.
 * 호버 애니메이션, 다크모드, 반응형을 모두 지원합니다.
 *
 * 사용 예시:
 * <TrailCard post={trailPost} priority />
 */

import Link from "next/link";
import Image from "next/image";
import { Calendar, Route, Clock, Mountain } from "lucide-react";

import { TrailPost } from "@/lib/types";
import { formatDate, formatDistance, formatDuration, categoryToSlug } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/trail/DifficultyBadge";

// =====================================================
// Props 타입 정의
// =====================================================

interface TrailCardProps {
  /** 표시할 코스 게시글 데이터 */
  post: TrailPost;
  /**
   * LCP(최대 콘텐츠 풀 페인트) 이미지 여부.
   * 뷰포트 최상단 카드에 true를 전달하면 이미지가 preload됩니다.
   */
  priority?: boolean;
}

// =====================================================
// 카테고리별 배지 색상 매핑
// =====================================================

const categoryColorMap: Record<string, string> = {
  동해안: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  남해안: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  서해안: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  DMZ: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  지리산: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

// =====================================================
// 대체 이미지 URL (Notion 이미지 없을 때 표시)
// =====================================================

const FALLBACK_IMAGE = "/images/trail-placeholder.jpg";

/**
 * 블러 플레이스홀더 데이터 URL
 * 이미지 로드 중 표시할 간단한 그라디언트 SVG입니다.
 */
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNCIgbnVtT2N0YXZlcz0iNSIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCBmaWxsPSIjZTFkZWU2IiBmaWx0ZXI9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=";

/**
 * TrailCard
 *
 * 코스 정보를 카드 형태로 표시하는 재사용 컴포넌트입니다.
 * next/image를 사용하여 이미지를 최적화하고,
 * 클릭 시 해당 코스의 상세 페이지로 이동합니다.
 */
export function TrailCard({ post, priority = false }: TrailCardProps) {
  // 카테고리 슬러그를 URL 경로에 사용
  const categorySlug = categoryToSlug(post.category);
  // 상세 페이지 URL 생성
  const href = `/${categorySlug}/${post.slug}`;
  // 카테고리 배지 색상 (매핑되지 않는 경우 기본값 사용)
  const categoryColor = categoryColorMap[post.category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <article className="group h-full">
      <Link
        href={href}
        className="flex flex-col h-full rounded-xl border border-border bg-card shadow-sm
          hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`${post.title} 코스 상세 보기`}
      >
        {/* ====================================================
            커버 이미지 영역
            이미지가 없을 경우 회색 플레이스홀더를 표시합니다.
            ==================================================== */}
        <div className="relative w-full h-48 overflow-hidden bg-muted shrink-0">
          <Image
            src={post.coverImage ?? FALLBACK_IMAGE}
            alt={`${post.title} 코스 대표 이미지`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300 dark:brightness-110"
            priority={priority}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            // 이미지 로딩 실패 시 플레이스홀더로 대체
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />

          {/* 이미지 위 카테고리 배지 오버레이 */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor}`}
            >
              {post.category}
            </span>
          </div>
        </div>

        {/* ====================================================
            카드 본문 영역
            제목, 날짜, 메타 정보를 표시합니다.
            ==================================================== */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* 날짜 */}
          <time
            dateTime={post.date}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatDate(post.date)}
          </time>

          {/* 제목 */}
          <h3 className="text-base font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* 요약 설명 (있는 경우만 표시) */}
          {post.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* ====================================================
              하단 메타 정보 영역
              거리, 소요 시간, 난이도를 아이콘과 함께 표시합니다.
              ==================================================== */}
          <div className="mt-auto pt-2 flex flex-wrap items-center gap-3 border-t border-border/50">
            {/* 거리 */}
            {post.distance !== undefined && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Route className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {formatDistance(post.distance)}
              </span>
            )}

            {/* 소요 시간 */}
            {post.duration !== undefined && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {formatDuration(post.duration)}
              </span>
            )}

            {/* 난이도 배지 (있는 경우만) */}
            {post.difficulty && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mountain className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <DifficultyBadge difficulty={post.difficulty} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
