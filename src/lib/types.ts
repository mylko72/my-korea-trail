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
  | "동해안"
  | "남해안"
  | "서해안"
  | "DMZ"
  | "지리산";

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
