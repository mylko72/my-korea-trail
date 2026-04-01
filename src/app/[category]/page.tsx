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
 *
 * 데이터 흐름:
 * - 서버: Mock 데이터(또는 Notion API)에서 게시글 목록 조회
 * - 클라이언트: CategoryPageClient에서 필터링 상태 관리 (F004, F005)
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getAllCategories, getCachedPostsByCategory } from "@/lib/notion";
import { MOCK_POSTS, filterPostsByCategory } from "@/lib/mockData";
import { slugToCategory, categoryToSlug } from "@/lib/utils";
import type { TrailCategory, TrailPost } from "@/lib/types";
import { CategoryPageClient } from "./CategoryPageClient";

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
// 카테고리 페이지 컴포넌트 (서버 컴포넌트)
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
    "해파랑길",
    "남파랑길",
    "서해랑길",
    "DMZ 평화의 길",
  ];
  if (!validCategories.includes(categoryName)) {
    notFound();
  }

  // 해당 카테고리의 게시글 목록을 Notion에서 가져옵니다.
  // Notion API 미설정 또는 에러 시 Mock 데이터로 폴백합니다.
  let posts: TrailPost[] = [];
  try {
    posts = await getCachedPostsByCategory(categoryName);
    // Notion API에서 데이터가 없으면 Mock 데이터로 폴백
    if (posts.length === 0) {
      posts = filterPostsByCategory(MOCK_POSTS, categoryName);
    }
  } catch {
    // Notion API 에러 시 Mock 데이터 사용
    posts = filterPostsByCategory(MOCK_POSTS, categoryName);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
            코리아 둘레길
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {categoryName} 구간
        </h1>
        <p className="text-muted-foreground text-lg">
          {posts.length}개의 여행 기록
        </p>
      </div>

      {/* 클라이언트 컴포넌트: 필터 UI + 게시글 목록 (F002, F004, F005) */}
      <CategoryPageClient
        initialPosts={posts}
        currentCategory={categoryName}
        categorySlug={categorySlug}
      />
    </div>
  );
}
