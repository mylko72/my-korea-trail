/**
 * 카테고리 페이지 ([category]/page.tsx)
 *
 * 특정 둘레길 카테고리(동해안, 남해안, 서해안, DMZ, 지리산)에 속한
 * 기록 게시글 목록을 표시하는 동적 라우트 페이지입니다.
 *
 * URL 구조: /{category} (예: /east-coast, /south-coast)
 *
 * Next.js App Router의 동적 라우트 특징:
 * - generateStaticParams: 빌드 시 모든 카테고리 경로를 미리 생성합니다.
 * - generateMetadata: 카테고리별 SEO 메타데이터를 동적으로 설정합니다.
 * - params: Promise 타입으로 반드시 await 해야 합니다 (Next.js 15+ 규칙).
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCategories, getPostsByCategory } from "@/lib/notion";
import { slugToCategory, categoryToSlug, formatDistance, formatDuration, formatShortDate } from "@/lib/utils";
import type { TrailCategory, TrailPost } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Route } from "lucide-react";
import Link from "next/link";

// =====================================================
// 정적 경로 사전 생성
// 빌드 시 모든 카테고리의 경로를 미리 생성합니다.
// =====================================================

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    category: categoryToSlug(category),
  }));
}

// =====================================================
// 동적 메타데이터 생성
// =====================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  // Next.js 15+: params는 Promise 타입이므로 반드시 await 합니다
  const { category: categorySlug } = await params;
  const categoryName = slugToCategory(categorySlug);

  return {
    title: `${categoryName} 둘레길 기록 | 코리아 둘레길`,
    description: `${categoryName} 구간 코리아 둘레길 도보 여행 기록 모음입니다.`,
  };
}

// =====================================================
// 카테고리 페이지 컴포넌트
// =====================================================

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // Next.js 15+: params는 Promise 타입이므로 반드시 await 합니다
  const { category: categorySlug } = await params;
  const categoryName = slugToCategory(categorySlug) as TrailCategory;

  // 유효하지 않은 카테고리 슬러그 처리
  const validCategories: TrailCategory[] = [
    "동해안",
    "남해안",
    "서해안",
    "DMZ",
    "지리산",
  ];
  if (!validCategories.includes(categoryName)) {
    notFound();
  }

  // 해당 카테고리의 게시글 목록을 Notion에서 가져옵니다
  // Notion API 미설정 또는 에러 시 빈 배열로 폴백합니다
  let posts: TrailPost[] = [];
  try {
    posts = await getPostsByCategory(categoryName);
  } catch {
    // Notion API 에러 시 빈 목록으로 안전하게 렌더링합니다
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            코리아 둘레길
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{categoryName} 구간</h1>
        <p className="text-muted-foreground text-lg">
          {posts.length}개의 여행 기록
        </p>
      </div>

      {/* 게시글이 없을 때 */}
      {posts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">아직 기록된 여행이 없습니다.</p>
          <p className="text-sm mt-2">곧 새로운 기록이 추가될 예정입니다.</p>
        </div>
      )}

      {/* 게시글 목록 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/${categorySlug}/${post.slug}`}>
            <Card className="group h-full hover:shadow-md transition-shadow duration-200 cursor-pointer">
              {/* 대표 이미지 */}
              {post.coverImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  {/* next/image 최적화 이미지 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    {formatShortDate(post.date)}
                  </span>
                  {post.difficulty && (
                    <Badge
                      variant={
                        post.difficulty === "어려움"
                          ? "destructive"
                          : post.difficulty === "보통"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {post.difficulty}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                {post.description && (
                  <CardDescription className="line-clamp-2">
                    {post.description}
                  </CardDescription>
                )}
              </CardHeader>

              {/* 거리 및 소요 시간 정보 */}
              {(post.distance ?? post.duration) && (
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.distance && (
                      <span className="flex items-center gap-1">
                        <Route className="h-3.5 w-3.5" />
                        {formatDistance(post.distance)}
                      </span>
                    )}
                    {post.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(post.duration)}
                      </span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
