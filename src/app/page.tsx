/**
 * 홈 페이지 (Home Page) - 서버 컴포넌트
 *
 * 코리아 둘레길 기록 블로그의 메인 랜딩 페이지입니다.
 * 서버에서 Notion API 캐싱 데이터를 가져와 클라이언트 컴포넌트에 전달합니다.
 *
 * 데이터 흐름:
 * 1. 서버: getCachedAllPosts()로 전체 게시글 조회 (60초 캐시)
 * 2. 서버: 최신 6개 추출 + 전체 목록을 HomePageClient에 props로 전달
 * 3. 클라이언트: HomePageClient에서 검색 상태 관리 (F006)
 *
 * Notion API 미설정 또는 에러 시 Mock 데이터로 폴백합니다.
 */

import { getCachedAllPosts } from "@/lib/notion";
import { MOCK_POSTS } from "@/lib/mockData";
import type { TrailPost } from "@/lib/types";
import HomePageClient from "./HomePageClient";

// 홈 페이지 기본 표시 게시글 수 (최신 6개)
const HOME_POST_LIMIT = 6;

export default async function HomePage() {
  // Notion API에서 전체 게시글을 가져옵니다 (캐싱 적용)
  let allPosts: TrailPost[] = [];
  try {
    const result = await getCachedAllPosts({ pageSize: 100 });
    allPosts = result.items;

    // Notion API에서 데이터가 없으면 Mock 데이터로 폴백
    if (allPosts.length === 0) {
      allPosts = MOCK_POSTS;
    }
  } catch {
    // Notion API 에러 시 Mock 데이터 사용
    allPosts = MOCK_POSTS;
  }

  // 날짜 내림차순 정렬 후 최신 N개 추출
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestPosts = sortedPosts.slice(0, HOME_POST_LIMIT);

  return (
    <HomePageClient
      latestPosts={latestPosts}
      allPosts={sortedPosts}
    />
  );
}
