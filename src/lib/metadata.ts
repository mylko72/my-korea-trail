/**
 * SEO 메타데이터 헬퍼 함수
 *
 * 페이지별 Next.js Metadata 객체를 생성하는 유틸리티입니다.
 * generateStaticParams와 함께 사용하여 동적 라우트의 SEO를 최적화합니다.
 *
 * 사용 예시:
 * ```ts
 * // 코스 상세 페이지
 * export async function generateMetadata({ params }) {
 *   const post = await getPostBySlug(slug);
 *   return generateTrailMetadata(post);
 * }
 * ```
 */

import type { Metadata } from "next";
import type { TrailPost, TrailCategory } from "./types";
import { slugToCategory } from "./utils";

// =====================================================
// 코스 상세 페이지 메타데이터
// =====================================================

/**
 * 코스 상세 페이지의 SEO 메타데이터를 생성합니다.
 * Open Graph 태그를 포함하여 소셜 공유 시 미리보기가 표시됩니다.
 *
 * @param post - 메타데이터를 생성할 TrailPost 객체
 * @returns Next.js Metadata 객체
 */
export function generateTrailMetadata(post: TrailPost): Metadata {
  const baseUrl = "https://korea-dulegil-blog.vercel.app";
  const title = `${post.title} | 코리아 둘레길`;
  const description =
    post.description ?? `${post.category} 구간 도보 여행 기록`;
  const postUrl = `${baseUrl}/${encodeURIComponent(post.category)}/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: postUrl,
      // 커버 이미지가 있을 때만 og:image 태그를 포함합니다
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

// =====================================================
// 카테고리 페이지 메타데이터
// =====================================================

/**
 * 카테고리 페이지의 SEO 메타데이터를 생성합니다.
 *
 * @param category - 카테고리 이름 (예: "동해안", "남해안")
 * @returns Next.js Metadata 객체
 */
export function generateCategoryMetadata(category: TrailCategory): Metadata {
  const title = `${category} 둘레길 기록 | 코리아 둘레길`;
  const description = `${category} 구간 코리아 둘레길 도보 여행 기록 모음입니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

// =====================================================
// JSON-LD 구조화 데이터
// =====================================================

/**
 * BreadcrumbList JSON-LD 스키마를 생성합니다.
 * schema.org/BreadcrumbList - 검색 결과의 breadcrumb 네비게이션 표시
 *
 * @param post - 메타데이터를 생성할 TrailPost 객체
 * @returns BreadcrumbList JSON-LD 객체
 */
export function generateBreadcrumbListSchema(post: TrailPost) {
  const baseUrl = "https://korea-dulegil-blog.vercel.app";
  const categoryUrl = `${baseUrl}/${encodeURIComponent(post.category)}`;
  const postUrl = `${baseUrl}/${encodeURIComponent(post.category)}/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category,
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };
}

/**
 * Article JSON-LD 스키마를 생성합니다.
 * schema.org/Article - 기사/블로그 포스트 검색 결과 최적화
 *
 * @param post - 메타데이터를 생성할 TrailPost 객체
 * @returns Article JSON-LD 객체
 */
export function generateArticleSchema(post: TrailPost) {
  const baseUrl = "https://korea-dulegil-blog.vercel.app";
  const postUrl = `${baseUrl}/${encodeURIComponent(post.category)}/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? `${post.category} 구간 도보 여행 기록`,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "코리아 둘레길",
    },
    publisher: {
      "@type": "Organization",
      name: "코리아 둘레길",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
}
