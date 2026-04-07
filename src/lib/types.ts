/**
 * TypeScript 타입 정의
 *
 * 코리아 둘레길 기록 블로그에서 사용하는 모든 타입을 이 파일에서 정의합니다.
 * Notion API 응답 구조를 기반으로 설계되었습니다.
 */

// =====================================================
// 카테고리 타입
// Notion 데이터베이스의 카테고리 속성 값과 일치해야 합니다.
// =====================================================

export type TrailCategory =
  | "해파랑길"
  | "남파랑길"
  | "서해랑길"
  | "DMZ 평화의 길";

// =====================================================
// 둘레길 기록 게시글 타입
// Notion 페이지 한 개에 대응하는 데이터 구조입니다.
// =====================================================

export interface TrailPost {
  /** Notion 페이지 고유 ID */
  id: string;
  /** 게시글 제목 */
  title: string;
  /** 카테고리 (둘레길 구간) */
  category: TrailCategory;
  /** 게시글 슬러그 (URL에 사용) */
  slug: string;
  /** 작성일 (ISO 8601 형식) */
  date: string;
  /** 대표 이미지 URL */
  coverImage?: string;
  /** 게시글 요약 (excerpt) */
  description?: string;
  /** 걸은 거리 (km) */
  distance?: number;
  /** 소요 시간 (분) */
  duration?: number;
  /** 난이도 */
  difficulty?: TrailDifficulty;
  /** 시작 지점 좌표 */
  startLocation?: GeoPoint;
  /** 종료 지점 좌표 */
  endLocation?: GeoPoint;
  /** 게시 여부 */
  published: boolean;
  /** Notion 페이지 URL */
  notionUrl?: string;
  /** 완보 여부 (true=완보, false=미완) */
  completed?: boolean;
  /** 코스 리뷰 (마크다운 텍스트) */
  content2?: string;
  /** 코스 사진 URL 목록 */
  images?: string[];
  /** 별점 (1~5점) */
  rate?: number;
}

// =====================================================
// 난이도 타입
// =====================================================

export type TrailDifficulty = "쉬움" | "보통" | "어려움";

// =====================================================
// 지리적 좌표 타입
// Google Maps API와 함께 사용됩니다.
// =====================================================

export interface GeoPoint {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
  /** 장소명 (선택) */
  name?: string;
}

// =====================================================
// Notion API 관련 타입
// @notionhq/client 응답 타입의 간략화된 버전입니다.
// =====================================================

/** Notion 리치 텍스트 요소 */
export interface NotionRichText {
  plain_text: string;
  href?: string | null;
}

/** Notion 파일/이미지 속성 */
export interface NotionFile {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string };
}

/** Notion 숫자 속성 */
export interface NotionNumber {
  number: number | null;
}

/** Notion 선택 속성 */
export interface NotionSelect {
  select: { name: string } | null;
}

/** Notion 멀티 선택 속성 */
export interface NotionMultiSelect {
  multi_select: Array<{ name: string }>;
}

/** Notion 날짜 속성 */
export interface NotionDate {
  date: { start: string; end?: string | null } | null;
}

/** Notion 체크박스 속성 */
export interface NotionCheckbox {
  checkbox: boolean;
}

/** Notion URL 속성 */
export interface NotionUrl {
  url: string | null;
}

// =====================================================
// 페이지네이션 타입
// =====================================================

export interface PaginatedResult<T> {
  /** 결과 배열 */
  items: T[];
  /** 다음 페이지 커서 (없으면 마지막 페이지) */
  nextCursor?: string;
  /** 더 불러올 데이터 여부 */
  hasMore: boolean;
}

// =====================================================
// 지도 관련 타입
// =====================================================

export interface MapMarker {
  /** 마커 고유 ID */
  id: string;
  /** 마커 위치 */
  position: GeoPoint;
  /** 마커 제목 */
  title: string;
  /** 연결된 게시글 (선택) */
  post?: Pick<TrailPost, "id" | "title" | "slug" | "category">;
}

// =====================================================
// 검색 API 관련 타입
// =====================================================

/** 검색 API 응답 타입 */
export interface SearchResponse {
  /** 검색 결과 게시글 배열 */
  posts: TrailPost[];
  /** 검색 결과 총 개수 */
  total: number;
  /** 검색어 */
  query: string;
  /** 필터링된 카테고리 (없으면 전체) */
  category?: TrailCategory;
}

// =====================================================
// 관리자 기능 관련 타입 (Phase 7)
// =====================================================

/**
 * 관리자 테이블에서 표시할 코스 정보 (간소화 버전)
 * TrailPost의 필드 중 관리자에게 필요한 것만 포함
 */
export interface AdminCourseRow {
  /** Notion 페이지 고유 ID (PATCH 요청에 사용) */
  id: string;
  /** 코스명 */
  title: string;
  /** 카테고리 */
  category: TrailCategory;
  /** 완주일 (ISO 8601 형식) */
  date: string;
  /** 거리 (km) */
  distance: number;
  /** 완보 여부 (true=완보, false=미완) */
  completed: boolean;
  /** 게시 여부 (true=게시됨, false=미게시) */
  published: boolean;
}

/**
 * 관리자 API PATCH 요청 본문 타입
 * 코스 상태(완보/게시) 업데이트 시 사용
 */
export interface UpdateCourseStatusPayload {
  /** 업데이트할 Notion 페이지 ID */
  pageId: string;
  /** 업데이트할 필드명 ('completed' | 'published') */
  field: 'completed' | 'published';
  /** 업데이트할 값 (boolean) */
  value: boolean;
}
