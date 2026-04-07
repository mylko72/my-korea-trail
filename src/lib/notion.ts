/**
 * Notion API 클라이언트 및 데이터 패칭 함수
 *
 * @notionhq/client v5를 사용해 Notion 데이터베이스에서 둘레길 기록을 가져옵니다.
 * 모든 함수는 서버 사이드에서만 실행됩니다 (환경 변수 NOTION_API_TOKEN 사용).
 *
 * v5 주요 변경사항:
 * - databases.query() 제거 → notion.search() 사용으로 대체
 * - 페이지 속성 접근 방식 동일 (page.properties)
 *
 * 주의: 이 파일을 클라이언트 컴포넌트에서 직접 import하지 마세요.
 *       Server Component 또는 Route Handler에서만 사용하세요.
 */

import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import type {
  TrailPost,
  TrailCategory,
  TrailDifficulty,
  GeoPoint,
  NotionRichText,
  NotionFile,
  PaginatedResult,
} from "./types";

// =====================================================
// Notion 클라이언트 초기화 및 환경 변수 검증
// =====================================================

/**
 * 환경 변수 검증 함수
 * 필수 환경 변수가 미설정인 경우 명확한 에러 메시지를 출력합니다.
 */
function validateEnvironmentVariables() {
  const token = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  const missingVars: string[] = [];
  if (!token) missingVars.push("NOTION_API_TOKEN");
  if (!databaseId) missingVars.push("NOTION_DATABASE_ID");

  if (missingVars.length > 0) {
    console.error(
      `\n❌ [Notion API] 필수 환경 변수 미설정:\n` +
      `   ${missingVars.join(", ")}\n` +
      `\n📝 해결 방법:\n` +
      `   1. 프로젝트 루트에 .env.local 파일 생성\n` +
      `   2. 다음 내용 추가:\n` +
      `      NOTION_API_TOKEN=ntn_xxxxxxxxxxxx\n` +
      `      NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx\n` +
      `   3. Notion 개발자 페이지에서 토큰 발급: https://www.notion.so/my-integrations\n`
    );
  }
}

// 모듈 로드 시 환경 변수 검증
if (process.env.NODE_ENV !== "test") {
  validateEnvironmentVariables();
}

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

/** 환경 변수에서 데이터베이스 ID를 가져옵니다 */
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// =====================================================
// 내부 헬퍼 함수
// =====================================================

/**
 * Notion 리치 텍스트 배열에서 순수 텍스트를 추출합니다.
 * @param richText - Notion 리치 텍스트 배열
 * @returns 연결된 순수 텍스트 문자열
 */
function extractPlainText(richText: NotionRichText[]): string {
  return richText.map((t) => t.plain_text).join("");
}

/**
 * Notion 파일/이미지 속성에서 URL을 추출합니다.
 * @param file - Notion 파일 속성
 * @returns 이미지 URL 또는 undefined
 */
function extractFileUrl(file: NotionFile | undefined): string | undefined {
  if (!file) return undefined;
  if (file.type === "external") return file.external?.url;
  if (file.type === "file") return file.file?.url;
  return undefined;
}

/**
 * Notion 페이지 속성을 TrailPost 타입으로 변환합니다.
 * Notion 응답의 properties 구조를 프로젝트 타입으로 매핑합니다.
 *
 * @param page - Notion API 응답의 페이지 객체
 * @returns TrailPost 객체
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPageToTrailPost(page: any): TrailPost {
  const props = page.properties;

  // 위치 정보 파싱 (JSON 형식으로 저장된 경우를 처리)
  let startLocation: GeoPoint | undefined;
  let endLocation: GeoPoint | undefined;

  try {
    const startText = props.StartLocation?.rich_text
      ? extractPlainText(props.StartLocation.rich_text)
      : "";
    const endText = props.EndLocation?.rich_text
      ? extractPlainText(props.EndLocation.rich_text)
      : "";

    if (startText) startLocation = JSON.parse(startText) as GeoPoint;
    if (endText) endLocation = JSON.parse(endText) as GeoPoint;
  } catch {
    // 위치 정보 파싱 실패 시 undefined 유지 (선택 속성이므로 에러 무시)
  }

  return {
    id: page.id,
    title: extractPlainText(props.Title?.title ?? []),
    category: (props.Category?.select?.name ?? "해파랑길") as TrailCategory,
    slug: extractPlainText(props.Slug?.rich_text ?? []) || page.id,
    date: props.Date?.date?.start ?? new Date().toISOString(),
    coverImage: extractFileUrl(props.CoverImage?.files?.[0]),
    description: extractPlainText(props.Description?.rich_text ?? []),
    distance: props.Distance?.number ?? undefined,
    duration: props.Duration?.number ?? undefined,
    difficulty: (props.Difficulty?.select?.name ?? undefined) as
      | TrailDifficulty
      | undefined,
    startLocation,
    endLocation,
    published: props.Published?.checkbox ?? false,
    notionUrl: page.url,
    completed: props.Completed?.select?.name === "완보",
    content2: extractPlainText(props.Content2?.rich_text ?? []) || undefined,
    images: (props.Images?.files ?? [])
      .map((f: NotionFile) => extractFileUrl(f))
      .filter((url: string | undefined): url is string => Boolean(url)),
    rate: props.Rate?.number ?? undefined,
  };
}

/**
 * Notion search() 결과에서 특정 데이터베이스의 페이지만 필터링합니다.
 * v5에서 databases.query()가 제거되어 search()로 대체합니다.
 *
 * Notion API는 parent.type이 "database_id" 또는 "data_source_id"일 수 있으므로 둘 다 체크합니다.
 *
 * @param results - search() 결과 배열
 * @returns 해당 데이터베이스 소속 페이지만 포함된 배열
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterByDatabase(results: any[]): any[] {
  return results.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (page: any) => {
      if (page.object !== "page") return false;

      const normalizedDbId = DATABASE_ID.replace(/-/g, "");
      const pageDbId = page.parent?.database_id?.replace(/-/g, "");

      // parent.type이 "database_id" 또는 "data_source_id"일 수 있음
      const isValidParentType =
        page.parent?.type === "database_id" ||
        page.parent?.type === "data_source_id";

      return isValidParentType && pageDbId === normalizedDbId;
    }
  );
}

// =====================================================
// 공개 API 함수
// =====================================================

/**
 * 전체 게시글 목록을 가져옵니다.
 * Published=true인 항목만 반환하며, 날짜 내림차순으로 정렬됩니다.
 *
 * 캐싱: getCachedAllPosts()로 래핑되어 60초 주기로 재검증됩니다.
 *
 * @param options - 페이지네이션 및 필터 옵션
 * @returns 게시글 목록과 페이지네이션 정보
 */
export async function getAllPosts(options?: {
  category?: TrailCategory;
  cursor?: string;
  pageSize?: number;
}): Promise<PaginatedResult<TrailPost>> {
  const startTime = performance.now();
  try {
    const { category, cursor, pageSize = 10 } = options ?? {};

    // v5: notion.search()로 해당 데이터베이스의 페이지를 조회합니다.
    // filter.value: "page" — 페이지 타입만 반환
    const response = await notion.search({
      filter: { value: "page", property: "object" },
      start_cursor: cursor,
      page_size: pageSize,
    });

    // 해당 데이터베이스 소속 페이지만 추출합니다
    let pages = filterByDatabase(response.results);

    // Published 속성 필터링 (클라이언트 사이드)
    pages = pages.filter((page) => page.properties?.Published?.checkbox === true);

    // 카테고리 필터링 (선택적)
    if (category) {
      pages = pages.filter(
        (page) => page.properties?.Category?.select?.name === category
      );
    }

    // 날짜 내림차순 정렬
    pages.sort((a, b) => {
      const dateA = a.properties?.Date?.date?.start ?? "";
      const dateB = b.properties?.Date?.date?.start ?? "";
      return dateB.localeCompare(dateA);
    });

    const result = {
      items: pages.map(mapPageToTrailPost),
      nextCursor: response.next_cursor ?? undefined,
      hasMore: response.has_more,
    };

    // 성능 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      const duration = performance.now() - startTime;
      console.log(
        `[Notion API] getAllPosts(category=${category ?? "all"}) ` +
        `결과: ${result.items.length}개 항목, 소요시간: ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `[Notion API] getAllPosts 에러 (${duration.toFixed(2)}ms):`,
      error instanceof Error ? error.message : String(error)
    );
    // 에러 발생 시 빈 배열 반환 (폴백)
    return {
      items: [],
      nextCursor: undefined,
      hasMore: false,
    };
  }
}

/**
 * 특정 카테고리의 게시글 목록을 가져옵니다.
 *
 * @param category - 조회할 카테고리
 * @returns 해당 카테고리의 게시글 배열
 */
export async function getPostsByCategory(
  category: TrailCategory
): Promise<TrailPost[]> {
  const result = await getAllPosts({ category, pageSize: 100 });
  return result.items;
}

/**
 * 슬러그(slug)로 특정 게시글을 가져옵니다.
 *
 * 캐싱: getCachedPostBySlug()로 래핑되어 300초(5분) 주기로 재검증됩니다.
 *
 * @param slug - 게시글 슬러그 (또는 page.id)
 * @returns TrailPost 또는 null (없을 경우)
 *
 * 주의: notion.search()는 텍스트 기반 부분 일치 검색이므로
 * UUID slug의 경우 부정확한 결과를 반환할 수 있습니다.
 * 따라서 전체 게시글을 가져온 후 정확한 일치로 검색합니다.
 */
export async function getPostBySlug(
  slug: string
): Promise<TrailPost | null> {
  const startTime = performance.now();
  try {
    // 전체 게시글 가져오기 (notion.search 대신 getAllPosts 사용)
    // UUID 기반 검색의 부정확성 문제를 해결합니다.
    const result = await getAllPosts({ pageSize: 100 });

    // 정확한 슬러그 일치 항목을 찾습니다
    const matched = result.items.find((post) => {
      return post.slug === slug;
    });

    // 성능 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      const duration = performance.now() - startTime;
      const status = matched ? "✓" : "✗";
      console.log(
        `[Notion API] getPostBySlug("${slug}") ${status} (${duration.toFixed(2)}ms)`
      );
    }

    if (!matched) return null;
    return matched;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `[Notion API] getPostBySlug("${slug}") 에러 (${duration.toFixed(2)}ms):`,
      error instanceof Error ? error.message : String(error)
    );
    // 에러 발생 시 null 반환 (404 페이지로 유도)
    return null;
  }
}

/**
 * 특정 Notion 페이지의 블록 콘텐츠를 가져옵니다.
 * 게시글 본문 렌더링에 사용합니다.
 *
 * 캐싱: getCachedPageBlocks()로 래핑되어 3600초(1시간) 주기로 재검증됩니다.
 *
 * @param pageId - Notion 페이지 ID
 * @returns 블록 배열
 */
export async function getPageBlocks(pageId: string) {
  const startTime = performance.now();
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    // 성능 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      const duration = performance.now() - startTime;
      console.log(
        `[Notion API] getPageBlocks("${pageId.slice(0, 8)}...") ` +
        `결과: ${response.results.length}개 블록, 소요시간: ${duration.toFixed(2)}ms`
      );
    }

    return response.results;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(
      `[Notion API] getPageBlocks("${pageId.slice(0, 8)}...") 에러 (${duration.toFixed(2)}ms):`,
      error instanceof Error ? error.message : String(error)
    );
    // 에러 발생 시 빈 배열 반환 (본문 없음)
    return [];
  }
}

/**
 * 모든 카테고리 목록을 가져옵니다.
 * Next.js의 generateStaticParams에서 정적 경로 생성 시 사용합니다.
 *
 * 데이터베이스 스키마 조회가 v5에서 변경되었으므로,
 * 하드코딩된 카테고리 목록을 반환합니다.
 * 실제 사용 시 Notion 데이터베이스 속성과 동기화하여 관리하세요.
 *
 * @returns 카테고리 배열
 */
export async function getAllCategories(): Promise<TrailCategory[]> {
  // 카테고리 목록은 PRD에서 고정된 값이므로 하드코딩합니다.
  // Notion 데이터베이스의 Category select 옵션과 반드시 일치해야 합니다.
  return ["해파랑길", "남파랑길", "서해랑길", "DMZ 평화의 길"];
}

// =====================================================
// 캐싱 래핑 함수 (Next.js unstable_cache)
//
// Notion API 특성과 대응 전략:
// 1. 초당 3회 요청 한도 → unstable_cache로 중복 요청 방지
// 2. 다양한 변경 빈도 → 함수별 다른 revalidate 주기 설정
// 3. 온디맨드 무효화 → tags를 사용한 선택적 캐시 무효화 가능
//
// 캐시 재검증 전략:
// - getAllPosts/getPostsByCategory: 60초 (변경 빈도 높음)
// - getPostBySlug: 300초 (상세 페이지, 변경 빈도 낮음)
// - getPageBlocks: 3600초 (본문 콘텐츠, 거의 변경 없음)
// - getAllCategories: 3600초 (고정 값, 변경 불가)
//
// 성능 로깅:
// - 개발 환경(NODE_ENV=development)에서는 각 API 호출 로그 출력
// - 프로덕션 환경에서는 로깅 비활성화 (성능 최적화)
//
// 기존 원본 함수(getAllPosts, getPostsByCategory 등)는
// 레거시 호환성을 위해 그대로 유지됩니다.
// =====================================================

/**
 * getAllPosts()의 캐싱 버전
 * 60초 간격으로 재검증하여 최신 게시글을 반영합니다.
 *
 * 캐시 키에 category, cursor, pageSize를 포함하여
 * 서로 다른 옵션 조합이 독립적으로 캐싱됩니다.
 */
export async function getCachedAllPosts(
  options?: { category?: TrailCategory; cursor?: string; pageSize?: number }
): Promise<PaginatedResult<TrailPost>> {
  const { category, cursor, pageSize } = options ?? {};
  // unstable_cache의 keyParts에 파라미터를 포함하여 옵션별 캐시 분리
  const keyParts = [
    "all-posts",
    category ?? "all",
    cursor ?? "start",
    String(pageSize ?? 10),
  ];
  const cached = unstable_cache(
    async () => getAllPosts(options),
    keyParts,
    { revalidate: 60, tags: ["all-posts", `posts-${category ?? "all"}`] }
  );
  return cached();
}

/**
 * getPostsByCategory()의 캐싱 버전
 * 60초 간격으로 재검증합니다.
 * 카테고리별로 독립적인 캐시 키를 사용합니다.
 */
export async function getCachedPostsByCategory(
  category: TrailCategory
): Promise<TrailPost[]> {
  const cached = unstable_cache(
    async () => getPostsByCategory(category),
    ["category-posts", category],
    { revalidate: 60, tags: ["category-posts", `posts-${category}`] }
  );
  return cached();
}

/**
 * getPostBySlug()의 캐싱 버전
 * 상세 페이지는 변경 빈도가 낮으므로 300초(5분) 간격으로 재검증합니다.
 * 슬러그별로 독립적인 캐시 키를 사용합니다.
 */
export async function getCachedPostBySlug(
  slug: string
): Promise<TrailPost | null> {
  const cached = unstable_cache(
    async () => getPostBySlug(slug),
    ["post-slug", slug],
    { revalidate: 300, tags: ["post-slug", `post-${slug}`] }
  );
  return cached();
}

/**
 * getPageBlocks()의 캐싱 버전
 * 페이지 본문 블록은 변경 빈도가 매우 낮으므로 3600초(1시간) 간격으로 재검증합니다.
 * 페이지 ID별로 독립적인 캐시 키를 사용합니다.
 */
export async function getCachedPageBlocks(pageId: string) {
  const cached = unstable_cache(
    async () => getPageBlocks(pageId),
    ["page-blocks", pageId],
    { revalidate: 3600, tags: ["page-blocks", `blocks-${pageId}`] }
  );
  return cached();
}

/**
 * getAllCategories()의 캐싱 버전
 * 카테고리 목록은 거의 변경되지 않으므로 3600초(1시간) 간격으로 재검증합니다.
 */
export const getCachedAllCategories = unstable_cache(
  async () => getAllCategories(),
  ["all-categories"],
  { revalidate: 3600, tags: ["all-categories"] }
);

// =====================================================
// 관리자용 함수 (Phase 7)
// Published 필터 없이 전체 코스를 조회하고, 상태를 업데이트합니다.
// =====================================================

/**
 * 관리자용: Published 필터 없이 전체 코스 조회
 *
 * 캐싱을 적용하지 않습니다 (관리자는 항상 최신 데이터 필요).
 * 날짜 내림차순으로 정렬됩니다.
 *
 * @returns AdminCourseRow[] - 관리자 테이블용 간소화된 데이터
 */
export async function getAllPostsForAdmin(): Promise<
  Array<{
    id: string;
    title: string;
    category: TrailCategory;
    date: string;
    distance: number;
    completed: boolean;
    published: boolean;
  }>
> {
  try {
    const results = await notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
    });

    const filtered = filterByDatabase(results.results);
    const posts = filtered.map((page) => mapPageToTrailPost(page));

    // AdminCourseRow 형태로 변환
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      category: post.category,
      date: post.date,
      distance: post.distance ?? 0,
      completed: post.completed ?? false,
      published: post.published,
    }));
  } catch (error) {
    console.error('[Notion] getAllPostsForAdmin 에러:', error);
    throw new Error('코스 목록 조회 실패');
  }
}

/**
 * Notion 페이지 상태 업데이트
 *
 * Completed (라디오: "완보" | "미완") 또는
 * Published (체크박스: true | false) 필드를 업데이트합니다.
 *
 * @param pageId - Notion 페이지 ID
 * @param field - 업데이트할 필드 ('completed' | 'published')
 * @param value - 업데이트할 값 (boolean)
 * @returns 업데이트 결과
 */
export async function updateCourseStatus(
  pageId: string,
  field: 'completed' | 'published',
  value: boolean
): Promise<{ success: true; pageId: string; field: string; value: boolean }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {};

    if (field === 'completed') {
      // Completed 필드: Select 타입 (\"완보\" | \"미완\")
      properties.Completed = {
        select: { name: value ? '완보' : '미완' },
      };
    } else if (field === 'published') {
      // Published 필드: Checkbox 타입
      properties.Published = {
        checkbox: value,
      };
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    });

    return { success: true, pageId, field, value };
  } catch (error) {
    console.error(
      `[Notion] updateCourseStatus 에러 (${field}):`,
      error
    );
    throw new Error(`상태 업데이트 실패: ${field}`);
  }
}
