/**
 * 코스 상세 페이지 ([category]/[slug]/page.tsx)
 *
 * 특정 둘레길 코스의 상세 정보를 표시하는 동적 라우트 페이지입니다.
 * 커버 이미지, 메타 정보(날짜/거리/시간/난이도), 본문 콘텐츠, 지도를 포함합니다.
 *
 * URL 구조: /{category}/{slug} (예: /east-coast/gangneung-samcheok)
 *
 * Next.js 15+ 동적 라우트 특징:
 * - generateStaticParams: 빌드 시 모든 (category, slug) 조합을 미리 생성합니다.
 * - generateMetadata: 코스 제목 기반 SEO 메타데이터를 동적으로 설정합니다.
 * - params: Promise 타입으로 반드시 await 해야 합니다 (Next.js 15+ 규칙).
 *
 * 현재 상태: Phase 3 (Mock 데이터 기반 UI 구현)
 * Phase 5에서 실제 Notion API 연동으로 대체됩니다.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import { MOCK_POSTS, filterPostsByCategory } from "@/lib/mockData";
import {
  slugToCategory,
  categoryToSlug,
  formatDate,
  formatDistance,
  formatDuration,
} from "@/lib/utils";
import {
  generateTrailMetadata,
  generateBreadcrumbListSchema,
  generateArticleSchema,
} from "@/lib/metadata";
import type { TrailCategory, TrailPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrevNextNavigation } from "@/components/trail/PrevNextNavigation";
import { ShareButton } from "@/components/trail/share-button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Route,
  MapPin,
  Mountain,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";

// =====================================================
// Mock 본문 콘텐츠 (Phase 3: UI 개발용)
// Phase 5에서 실제 Notion 블록 콘텐츠로 대체됩니다.
// =====================================================

/**
 * 블러 플레이스홀더 데이터 URL
 * 이미지 로드 중 표시할 간단한 그라디언트 SVG입니다.
 */
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNCIgbnVtT2N0YXZlcz0iNSIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCBmaWxsPSIjZTFkZWU2IiBmaWx0ZXI9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=";

/** Mock 본문 콘텐츠 (Phase 5에서 Notion 블록으로 대체) */
const MOCK_CONTENT1 = `
강원도의 청정한 동해 바다를 끼고 걷는 이 구간은 코리아 둘레길 동해안길의 핵심 코스 중 하나입니다.
강릉 경포해변에서 시작하여 주문진, 옥계를 거쳐 삼척까지 이어지는 약 33km의 여정은
하루 종일 파도 소리와 함께 걷는 특별한 경험을 선사합니다.

이 구간의 가장 큰 매력은 끊임없이 펼쳐지는 동해의 절경입니다. 맑은 날에는 수평선 너머로
독도와 일본 열도의 윤곽이 보이기도 하며, 해안 절벽과 기암괴석이 만들어내는
독특한 풍경은 걷는 내내 지루함을 느낄 틈을 주지 않습니다.

해안선을 따라 이어진 데크 길과 자갈밭, 모래사장을 번갈아 걸으며
강릉 특유의 해양 문화를 체험할 수 있습니다.
`;

const MOCK_CONTENT2 = `
이 구간을 걸으면서 가장 기억에 남는 것은 역시 푸른 동해바다였습니다. 서울에서 생활하며
잊고 있었던 자연의 위대함을 온몸으로 느낄 수 있었던 하루였습니다.

특히 오전 일찍 출발해서 해가 중천에 뜨기 전에 해안 절벽 구간을 통과한 것이 탁월한 선택이었습니다.
오후에는 강한 햇살이 반사되어 걷기가 다소 힘들었지만, 중간중간 있는 작은 어촌 마을에서
신선한 해산물로 기운을 충전할 수 있었습니다.

발바닥 물집이 생겼지만 그것조차 소중한 완주의 훈장이 되었습니다.
다음에는 오전에만 걷고 중간에 숙박하는 방식으로 더 여유롭게 즐기고 싶습니다.
`;

// =====================================================
// 정적 경로 사전 생성
// 빌드 시 모든 (category, slug) 조합의 경로를 미리 생성합니다.
// =====================================================

export async function generateStaticParams() {
  try {
    const result = await getAllPosts({ pageSize: 100 });
    // 모든 게시글의 category + slug 조합으로 정적 경로를 생성합니다
    return result.items.map((post) => ({
      category: categoryToSlug(post.category),
      slug: post.slug,
    }));
  } catch {
    // Notion API 미설정 시 mockData.ts의 전체 Mock 경로를 반환합니다
    return MOCK_POSTS.map((post) => ({
      category: categoryToSlug(post.category),
      slug: post.slug,
    }));
  }
}

// =====================================================
// 동적 메타데이터 생성
// =====================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  // Next.js 15+: params는 Promise 타입이므로 반드시 await 합니다
  const { category: categorySlug, slug } = await params;
  const categoryName = slugToCategory(categorySlug);

  try {
    const post = await getPostBySlug(slug);
    if (post) {
      return generateTrailMetadata(post);
    }
  } catch {
    // Notion API 에러 시 Mock 메타데이터로 대체합니다
  }

  // Mock 데이터 메타데이터 폴백 (MOCK_POSTS에서 슬러그로 검색)
  const mockFallback = MOCK_POSTS.find((p) => p.slug === slug);
  if (mockFallback) {
    return generateTrailMetadata(mockFallback);
  }

  return {
    title: `코스 상세 | ${categoryName}`,
    description: `${categoryName} 구간 코리아 둘레길 코스 상세 기록`,
  };
}

// =====================================================
// 난이도 배지 색상 매핑 헬퍼
// =====================================================

/**
 * 난이도에 따른 shadcn Badge variant를 반환합니다.
 * @param difficulty - 난이도 문자열
 */
function getDifficultyVariant(
  difficulty: string | undefined
): "outline" | "secondary" | "destructive" {
  if (difficulty === "어려움") return "destructive";
  if (difficulty === "보통") return "secondary";
  return "outline";
}

// =====================================================
// 코스 상세 페이지 컴포넌트
// =====================================================

/**
 * CourseDetailPage 컴포넌트
 *
 * 서버 컴포넌트(Server Component)로 동작합니다.
 * Notion API에서 코스 데이터를 가져와 렌더링합니다.
 * API 연동 전에는 Mock 데이터로 UI를 표시합니다.
 */
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  // Next.js 15+: params는 Promise 타입이므로 반드시 await 합니다
  const { category: categorySlug, slug } = await params;
  const categoryName = slugToCategory(categorySlug) as TrailCategory;

  // 유효하지 않은 카테고리 슬러그 처리
  const validCategories: TrailCategory[] = [
    "해파랑길",
    "남파랑길",
    "서해랑길",
    "DMZ 평화의 길",
  ];
  if (!validCategories.includes(categoryName)) {
    notFound();
  }

  // 게시글 데이터 조회 (Notion API 또는 Mock 데이터 폴백)
  let post: TrailPost | null = null;
  let content1 = "";

  try {
    post = await getPostBySlug(slug);
    if (post) {
      // Phase 5에서 실제 Notion 블록 콘텐츠로 대체됩니다
      content1 = MOCK_CONTENT1;
    }
  } catch {
    // Notion API 미설정 시 Mock 데이터로 대체합니다
  }

  // Mock 데이터 폴백 (Notion API 연동 전 개발용)
  // MOCK_POSTS 배열에서 슬러그로 검색합니다
  if (!post) {
    const mockFallback = MOCK_POSTS.find((p) => p.slug === slug) ?? null;
    if (mockFallback) {
      post = mockFallback;
      content1 = MOCK_CONTENT1;
    }
  }

  // 유효하지 않은 슬러그 처리
  if (!post) {
    notFound();
  }

  // 카테고리 불일치 검증 (잘못된 URL 진입 방지)
  if (post.category !== categoryName) {
    notFound();
  }

  // 이전/다음 네비게이션을 위한 같은 카테고리 게시글 목록 조회
  // Notion API 실패 시 Mock 데이터로 폴백
  let categoryPosts: TrailPost[] = [];
  try {
    const allPostsResult = await getAllPosts({ pageSize: 100 });
    categoryPosts = allPostsResult.items.filter(
      (p) => p.category === categoryName
    );
    if (categoryPosts.length === 0) {
      categoryPosts = filterPostsByCategory(MOCK_POSTS, categoryName);
    }
  } catch {
    categoryPosts = filterPostsByCategory(MOCK_POSTS, categoryName);
  }

  // JSON-LD 스키마 생성
  const breadcrumbSchema = generateBreadcrumbListSchema(post);
  const articleSchema = generateArticleSchema(post);

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <article className="pb-20">

        {/* =========================================================
            커버 이미지 영역
            풀 와이드 hero 이미지로 코스의 첫인상을 전달합니다.
            ========================================================= */}
      <div className="relative w-full aspect-video max-h-[520px] overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={`${post.title} 대표 이미지`}
            fill
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover dark:brightness-110"
            sizes="100vw"
          />
        ) : (
          /* 커버 이미지가 없을 때 플레이스홀더 */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50">
            <Mountain className="h-16 w-16 text-muted-foreground/30" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">이미지 없음</span>
          </div>
        )}

        {/* 이미지 하단 그라데이션 오버레이 (텍스트 가독성 향상) */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* =========================================================
          메인 콘텐츠 컨테이너
          ========================================================= */}
      <div className="container mx-auto px-4 max-w-4xl">

        {/* -------------------------------------------------------
            뒤로 가기 네비게이션
            ------------------------------------------------------- */}
        <nav className="py-6" aria-label="상위 페이지로 이동">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${categorySlug}`}>
              <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {categoryName} 목록으로
            </Link>
          </Button>
        </nav>

        {/* -------------------------------------------------------
            제목 및 메타 정보 헤더
            ------------------------------------------------------- */}
        <header className="mb-8">
          {/* 카테고리 배지 및 난이도 배지 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default">{post.category}</Badge>
            {post.difficulty && (
              <Badge variant={getDifficultyVariant(post.difficulty)}>
                {post.difficulty}
              </Badge>
            )}
          </div>

          {/* 코스 제목 */}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {/* 코스 요약 설명 */}
          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {post.description}
            </p>
          )}

          {/* 공유 버튼 */}
          <div className="flex items-center gap-4">
            <ShareButton
              url={`https://korea-dulegil-blog.vercel.app/${categorySlug}/${post.slug}`}
              title={post.title}
            />
          </div>
        </header>

        {/* -------------------------------------------------------
            메타 정보 카드 (날짜, 거리, 소요시간, 완보여부)
            ------------------------------------------------------- */}
        <Card className="mb-10">
          <CardContent className="pt-6">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {/* 완주 날짜 */}
              <div className="flex flex-col gap-1.5">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  완주 날짜
                </dt>
                <dd className="text-base font-semibold">
                  {formatDate(post.date)}
                </dd>
              </div>

              {/* 거리 */}
              {post.distance !== undefined && (
                <div className="flex flex-col gap-1.5">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    <Route className="h-3.5 w-3.5" aria-hidden="true" />
                    총 거리
                  </dt>
                  <dd className="text-base font-semibold">
                    {formatDistance(post.distance)}
                  </dd>
                </div>
              )}

              {/* 소요 시간 */}
              {post.duration !== undefined && (
                <div className="flex flex-col gap-1.5">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    소요 시간
                  </dt>
                  <dd className="text-base font-semibold">
                    {formatDuration(post.duration)}
                  </dd>
                </div>
              )}

              {/* 시작 지점 */}
              {(post.startLocation ?? post.endLocation) && (
                <div className="flex flex-col gap-1.5">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    구간 경로
                  </dt>
                  <dd className="text-sm font-medium leading-snug">
                    {post.startLocation?.name ?? "출발지"}
                    {post.endLocation && (
                      <>
                        <span className="mx-1 text-muted-foreground">→</span>
                        {post.endLocation.name ?? "도착지"}
                      </>
                    )}
                  </dd>
                </div>
              )}

              {/* 별점 */}
              {post.rate !== undefined && (
                <div className="flex flex-col gap-1.5">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    평점
                  </dt>
                  <dd className="flex items-center gap-2">
                    <span className="text-lg font-bold">{post.rate.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </dd>
                </div>
              )}

            </dl>
          </CardContent>
        </Card>

        {/* -------------------------------------------------------
            지도 영역 (F007: Google Maps 연동)
            Phase 5에서 실제 Google Maps 컴포넌트로 대체됩니다.
            좌표 정보가 없는 경우 지도 영역을 숨깁니다.
            ------------------------------------------------------- */}
        {(post.startLocation ?? post.endLocation) && (
          <section
            className="mb-10"
            aria-labelledby="map-section-title"
          >
            <h2
              id="map-section-title"
              className="text-xl font-bold mb-4 flex items-center gap-2"
            >
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              코스 지도
            </h2>

            {/* Google Maps 플레이스홀더 (Phase 5에서 TrailMap 컴포넌트로 교체) */}
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted border border-border flex flex-col items-center justify-center gap-3"
              role="img"
              aria-label={`${post.title} 코스 지도 (준비 중)`}
            >
              <MapPin
                className="h-10 w-10 text-muted-foreground/40"
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  지도 준비 중
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Google Maps API 연동 후 표시됩니다
                </p>
              </div>

              {/* 좌표 정보 미리보기 (개발 참고용) */}
              {process.env.NODE_ENV === "development" && (
                <div className="absolute bottom-3 left-3 text-xs text-muted-foreground/50 font-mono">
                  {post.startLocation && (
                    <span>
                      시작: {post.startLocation.lat.toFixed(4)},{" "}
                      {post.startLocation.lng.toFixed(4)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 지도 하단 출발/도착 정보 */}
            <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
              {post.startLocation && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-bold">
                    S
                  </span>
                  {post.startLocation.name ?? "출발지"}
                </span>
              )}
              {post.endLocation && (
                <span className="flex items-center gap-1.5">
                  {post.endLocation.name ?? "도착지"}
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-bold">
                    E
                  </span>
                </span>
              )}
            </div>
          </section>
        )}

        <Separator className="mb-10" />

        {/* -------------------------------------------------------
            본문 콘텐츠 영역 (F003: 코스 소개 + 리뷰)
            Phase 5에서 Notion 블록 렌더러로 대체됩니다.
            ------------------------------------------------------- */}

        {/* 코스 소개 (Content1) */}
        {content1 && (
          <section
            className="mb-10"
            aria-labelledby="content1-title"
          >
            <h2
              id="content1-title"
              className="text-xl font-bold mb-5"
            >
              코스 소개
            </h2>
            {/* 마크다운 렌더러는 Phase 5에서 추가됩니다 */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {content1.split("\n\n").filter(Boolean).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/80 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </section>
        )}

        {content1 && post.content2 && <Separator className="mb-10" />}

        {/* 코스 리뷰 (Content2) */}
        {post.content2 ? (
          <section
            className="mb-10"
            aria-labelledby="content2-title"
          >
            <h2
              id="content2-title"
              className="text-xl font-bold mb-5"
            >
              코스 리뷰
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content2.split("\n\n").filter(Boolean).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/80 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-muted-foreground">코스 리뷰가 없습니다.</p>
        )}

        {/* -------------------------------------------------------
            이미지 갤러리 (F003: 코스 사진)
            post.images 배열로 여러 사진을 표시합니다.
            ------------------------------------------------------- */}
        <section
          className="mb-10"
          aria-labelledby="gallery-title"
        >
          <h2
            id="gallery-title"
            className="text-xl font-bold mb-5"
          >
            코스 사진
          </h2>

          {(() => {
            const galleryImages = post.images?.length
              ? post.images
              : post.coverImage
                ? [post.coverImage]
                : [];

            return galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((src, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={src}
                      alt={`${post.title} 사진 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300 dark:brightness-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* 이미지 없음 상태 */
              <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center gap-3">
                <Mountain
                  className="h-10 w-10 text-muted-foreground/30"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  등록된 사진이 없습니다.
                </p>
              </div>
            );
          })()}
        </section>

        <Separator className="mb-10" />

        {/* -------------------------------------------------------
            이전/다음 게시글 네비게이션 (같은 카테고리 내)
            날짜 내림차순 기준으로 이전/다음을 결정합니다.
            ------------------------------------------------------- */}
        <section className="mb-10" aria-labelledby="prevnext-title">
          <h2
            id="prevnext-title"
            className="text-sm font-medium text-muted-foreground mb-4"
          >
            같은 구간의 다른 기록
          </h2>
          <PrevNextNavigation
            currentPost={post}
            allPosts={categoryPosts}
          />
        </section>

        <Separator className="mb-10" />

        {/* -------------------------------------------------------
            하단 네비게이션 (뒤로 가기 + 완보 상태 표시)
            ------------------------------------------------------- */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button variant="outline" asChild>
            <Link href={`/${categorySlug}`}>
              <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {categoryName} 목록으로
            </Link>
          </Button>

          {/* 완보/미완 상태 표시 */}
          <div className="flex items-center gap-2 text-sm">
            {post.completed !== undefined ? (
              post.completed ? (
                <>
                  <CheckCircle2
                    className="h-4 w-4 text-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">완보</span>
                </>
              ) : (
                <>
                  <XCircle
                    className="h-4 w-4 text-orange-400"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">미완</span>
                </>
              )
            ) : (
              <span className="text-muted-foreground">기록 없음</span>
            )}
          </div>
        </footer>

      </div>
    </article>
    </>
  );
}
