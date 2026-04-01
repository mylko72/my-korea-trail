/**
 * 공통 유틸리티 함수
 *
 * 프로젝트 전반에서 사용되는 범용 헬퍼 함수 모음입니다.
 * shadcn/ui 클래스 병합 유틸리티(cn)와 둘레길 특화 포맷 함수를 포함합니다.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// =====================================================
// shadcn/ui 클래스 병합 유틸리티
// =====================================================

/**
 * Tailwind CSS 클래스를 안전하게 병합합니다.
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌하는 클래스를 해결합니다.
 *
 * 사용 예시:
 * cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =====================================================
// 날짜 포맷 유틸리티
// =====================================================

/**
 * ISO 8601 날짜 문자열을 한국어 형식으로 변환합니다.
 * @param dateStr - ISO 8601 형식 날짜 문자열 (예: "2024-03-15")
 * @returns 한국어 날짜 문자열 (예: "2024년 3월 15일")
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 날짜를 간략한 형식으로 변환합니다.
 * @param dateStr - ISO 8601 형식 날짜 문자열
 * @returns 간략한 날짜 문자열 (예: "2024.03.15")
 */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

// =====================================================
// 둘레길 특화 포맷 유틸리티
// =====================================================

/**
 * 거리(km)를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param km - 거리 (킬로미터)
 * @returns 포맷된 거리 문자열 (예: "12.5km")
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)}km`;
}

/**
 * 소요 시간(분)을 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param minutes - 소요 시간 (분)
 * @returns 포맷된 시간 문자열 (예: "2시간 30분" 또는 "45분")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}시간`;
  return `${hours}시간 ${remainingMinutes}분`;
}

/**
 * 카테고리 이름을 URL 슬러그로 변환합니다.
 * 한국어 카테고리명을 URL에서 사용 가능한 영문 슬러그로 매핑합니다.
 *
 * @param category - 카테고리 이름 (예: "해파랑길")
 * @returns URL 슬러그 (예: "hae-parang-gil")
 */
export function categoryToSlug(category: string): string {
  const slugMap: Record<string, string> = {
    해파랑길: "hae-parang-gil",
    남파랑길: "nam-parang-gil",
    서해랑길: "seo-hae-rang-gil",
    "DMZ 평화의 길": "dmz-peace-trail",
  };
  return slugMap[category] ?? encodeURIComponent(category);
}

/**
 * URL 슬러그를 카테고리 이름으로 변환합니다.
 * categoryToSlug의 역변환 함수입니다.
 *
 * @param slug - URL 슬러그 (예: "hae-parang-gil")
 * @returns 카테고리 이름 (예: "해파랑길")
 */
export function slugToCategory(slug: string): string {
  const categoryMap: Record<string, string> = {
    "hae-parang-gil": "해파랑길",
    "nam-parang-gil": "남파랑길",
    "seo-hae-rang-gil": "서해랑길",
    "dmz-peace-trail": "DMZ 평화의 길",
  };
  return categoryMap[slug] ?? decodeURIComponent(slug);
}

// =====================================================
// 클립보드 유틸리티
// =====================================================

/**
 * 텍스트를 클립보드에 복사합니다.
 * @param text - 복사할 텍스트
 * @returns 성공 여부
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
