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
// Notion 클라이언트 초기화
// 환경 변수가 없으면 런타임에서 에러가 발생합니다.
// =====================================================

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
 * @param results - search() 결과 배열
 * @returns 해당 데이터베이스 소속 페이지만 포함된 배열
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterByDatabase(results: any[]): any[] {
  return results.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (page: any) =>
      page.object === "page" &&
      page.parent?.type === "database_id" &&
      page.parent.database_id?.replace(/-/g, "") ===
        DATABASE_ID.replace(/-/g, "")
  );
}

// =====================================================
// 공개 API 함수
// =====================================================

/**
 * 전체 게시글 목록을 가져옵니다.
 * Published=true인 항목만 반환하며, 날짜 내림차순으로 정렬됩니다.
 *
 * @param options - 페이지네이션 및 필터 옵션
 * @returns 게시글 목록과 페이지네이션 정보
 */
export async function getAllPosts(options?: {
  category?: TrailCategory;
  cursor?: string;
  pageSize?: number;
}): Promise<PaginatedResult<TrailPost>> {
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

  return {
    items: pages.map(mapPageToTrailPost),
    nextCursor: response.next_cursor ?? undefined,
    hasMore: response.has_more,
  };
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
 * @param slug - 게시글 슬러그
 * @returns TrailPost 또는 null (없을 경우)
 */
export async function getPostBySlug(
  slug: string
): Promise<TrailPost | null> {
  // 슬러그로 검색합니다
  const response = await notion.search({
    query: slug,
    filter: { value: "page", property: "object" },
    page_size: 10,
  });

  const pages = filterByDatabase(response.results);

  // 정확한 슬러그 일치 항목을 찾습니다
  const matched = pages.find((page) => {
    const pageSlug =
      extractPlainText(page.properties?.Slug?.rich_text ?? []) || page.id;
    return (
      pageSlug === slug && page.properties?.Published?.checkbox === true
    );
  });

  if (!matched) return null;
  return mapPageToTrailPost(matched);
}

/**
 * 특정 Notion 페이지의 블록 콘텐츠를 가져옵니다.
 * 게시글 본문 렌더링에 사용합니다.
 *
 * @param pageId - Notion 페이지 ID
 * @returns 블록 배열
 */
export async function getPageBlocks(pageId: string) {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  return response.results;
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
