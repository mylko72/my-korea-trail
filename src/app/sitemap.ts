/**
 * Sitemap 메타데이터 라우트
 *
 * Next.js 15의 동적 메타데이터 라우트를 활용하여 sitemap.xml을 자동으로 생성합니다.
 * /sitemap.xml에 접속하면 다음 URL들이 포함된 XML이 반환됩니다:
 *
 * - 홈 페이지 (우선순위: 1.0)
 * - 카테고리 페이지 4개 (우선순위: 0.8)
 * - 코스 상세 페이지들 (우선순위: 0.6)
 *
 * Phase 5에서 실제 Notion API로 상세 페이지 목록을 동적으로 생성하도록 변경될 예정입니다.
 */

import { MetadataRoute } from "next";
import { MOCK_POSTS } from "@/lib/mockData";
import { categoryToSlug } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  // 사이트 기본 URL (프로덕션 배포 시 실제 도메인으로 변경됨)
  const baseUrl = "https://korea-dulegil-blog.vercel.app";

  // 1. 홈 페이지
  const homeEntry: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  };

  // 2. 카테고리 페이지 (4개 구간)
  const categories = ["해파랑길", "남파랑길", "서해랑길", "DMZ 평화의 길"];
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. 상세 페이지 (Mock 데이터 기반, Phase 5에서 실제 Notion API로 변경)
  const detailEntries: MetadataRoute.Sitemap = MOCK_POSTS.map((post) => ({
    url: `${baseUrl}/${encodeURIComponent(post.category)}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 모든 URL 병합 (우선순위 높은 순으로 정렬)
  return [homeEntry, ...categoryEntries, ...detailEntries];
}
