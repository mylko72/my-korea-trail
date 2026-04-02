/**
 * 검색 API Route Handler
 *
 * GET /api/search?q=검색어&category=카테고리
 *
 * F001 + F006: 서버 사이드 검색 구현
 * Phase 5 Task 4에서 구현됨
 *
 * 쿼리 파라미터:
 * - q (필수): 검색어 (제목, 카테고리, 설명에서 검색)
 * - category (선택): 특정 카테고리로 필터링 (예: 해파랑길)
 *
 * 응답:
 * - posts: TrailPost[] - 검색 결과 게시글 배열
 * - total: number - 검색 결과 총 개수
 * - query: string - 검색에 사용한 검색어
 * - category?: string - 필터링된 카테고리
 *
 * 캐싱: Notion API의 getCachedAllPosts()가 60초 주기로 캐싱됨
 *
 * 사용 예시:
 * - GET /api/search?q=강릉
 * - GET /api/search?q=해수욕장&category=해파랑길
 */

import { getCachedAllPosts } from "@/lib/notion";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { SearchResponse, TrailCategory, TrailPost } from "@/lib/types";

/**
 * 게시글 검색 함수
 * 제목, 카테고리, 설명에서 검색어를 찾습니다.
 *
 * @param posts - 검색할 게시글 배열
 * @param query - 검색어
 * @returns 검색 결과 게시글 배열
 */
function searchPosts(posts: TrailPost[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) return posts;

  const lowerQuery = trimmed.toLowerCase();

  return posts.filter((post) => {
    const title = post.title.toLowerCase();
    const category = post.category.toLowerCase();
    const description = (post.description ?? "").toLowerCase();

    return (
      title.includes(lowerQuery) ||
      category.includes(lowerQuery) ||
      description.includes(lowerQuery)
    );
  });
}

/**
 * GET /api/search
 *
 * 쿼리 파라미터에서 검색어와 카테고리를 받아
 * 해당하는 게시글을 반환합니다.
 */
export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const startTime = performance.now();

  try {
    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") ?? "";
    const categoryFilter = searchParams.get("category") ?? undefined;

    // 검색어가 없는 경우 처리
    if (!query.trim()) {
      return NextResponse.json(
        {
          posts: [],
          total: 0,
          query: "",
          category: categoryFilter as TrailCategory | undefined,
        },
        { status: 400 }
      );
    }

    // Notion API에서 전체 게시글 조회 (캐싱 적용: 60초)
    const result = await getCachedAllPosts({ pageSize: 100 });
    let posts = result.items;

    // 카테고리 필터링 (선택적)
    if (categoryFilter) {
      posts = posts.filter((post) => post.category === categoryFilter);
    }

    // 검색 수행
    const searchResults = searchPosts(posts, query);

    // 성능 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      const duration = performance.now() - startTime;
      console.log(
        `[API] /api/search (q="${query}"${categoryFilter ? `, category="${categoryFilter}"` : ""}) ` +
        `결과: ${searchResults.length}개 / 전체 ${posts.length}개, 소요시간: ${duration.toFixed(2)}ms`
      );
    }

    // 성공 응답
    return NextResponse.json(
      {
        posts: searchResults,
        total: searchResults.length,
        query,
        category: categoryFilter as TrailCategory | undefined,
      },
      {
        status: 200,
        headers: {
          // 캐시 제어: 검색 결과는 재검증 필요 없음 (동적 쿼리)
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[API] /api/search 에러:", error instanceof Error ? error.message : String(error));

    // 에러 응답
    return NextResponse.json(
      {
        posts: [],
        total: 0,
        query: "",
      },
      { status: 500 }
    );
  }
}

/**
 * 다른 HTTP 메서드 허용 안 함
 */
export async function POST() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}
