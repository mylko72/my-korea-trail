/**
 * Robots.txt 메타데이터 라우트
 *
 * Next.js 15의 동적 메타데이터 라우트를 활용하여 robots.txt를 자동으로 생성합니다.
 * /robots.txt에 접속하면 검색 엔진 크롤러를 위한 규칙이 반환됩니다:
 *
 * - User-Agent: * (모든 크롤러)
 * - Allow: / (전체 사이트 허용)
 * - Disallow: /admin, /api/* (관리 페이지, API 엔드포인트 차단)
 * - Sitemap: sitemap.xml 참조
 *
 * Phase 5 이후 실제 API 엔드포인트가 추가되면 해당 경로도 Disallow에 추가할 수 있습니다.
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // 모든 크롤러에 적용되는 규칙
    rules: {
      // 모든 사용자 에이전트 ('*'는 모든 봇을 의미함)
      userAgent: "*",
      // 크롤링 허용 경로 (기본적으로 전체 사이트 허용)
      allow: "/",
      // 크롤링 차단 경로
      // - /admin: 관리 페이지 (구현 예정)
      // - /api/*: API 엔드포인트 (향후 추가될 수 있음)
      disallow: ["/admin", "/api/"],
    },
    // 사이트맵 URL
    // 검색 엔진(Google, Bing 등)이 모든 페이지를 효율적으로 크롤링할 수 있도록 가이드
    sitemap: "https://korea-dulegil-blog.vercel.app/sitemap.xml",
  };
}
