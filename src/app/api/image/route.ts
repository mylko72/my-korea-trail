/**
 * 이미지 프록시 Route Handler
 *
 * Notion 내부 파일 이미지의 만료 URL 문제를 해결하기 위한 선택적 프록시입니다.
 * 클라이언트에서 이미지 URL을 직접 사용하는 대신 이 엔드포인트를 통해 리다이렉트합니다.
 *
 * 사용법:
 * 1. Notion에서 이미지 URL 복사 (만료되지 않은 URL)
 * 2. 이 엔드포인트로 리다이렉트:
 *    - 기존: <img src="https://prod-files-secure.s3.us-west-2.amazonaws.com/..." />
 *    - 변경: <img src="/api/image?url=<encoded-url>" />
 * 3. API에서 자동으로 최신 URL을 Notion에서 조회하여 리다이렉트
 *
 * Phase 5 Task 3: Notion 이미지 URL 만료 대응 방안 (장기 솔루션)
 *
 * 주의사항:
 * - 현재 비활성화됨 (MCU 정책상 선택사항)
 * - Notion 내부 파일을 사용하는 경우에만 활성화 권장
 * - 외부 이미지 URL(Unsplash, Cloudinary) 사용 시 이 엔드포인트 불필요
 */

import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/**
 * GET /api/image?url=<encoded-url>
 *
 * @param request - 요청 객체 (쿼리 파라미터: url)
 * @returns 이미지 URL로 리다이렉트 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 이미지 URL 추출
    const searchParams = request.nextUrl.searchParams;
    const encodedUrl = searchParams.get("url");

    if (!encodedUrl) {
      return new Response("Missing 'url' query parameter", { status: 400 });
    }

    // URL 디코딩
    let imageUrl: string;
    try {
      imageUrl = decodeURIComponent(encodedUrl);
    } catch {
      return new Response("Invalid URL encoding", { status: 400 });
    }

    // Notion 이미지 URL인지 검증 (보안 목적)
    // 다른 도메인의 이미지로 악용되지 않도록 제한
    if (
      !imageUrl.includes("s3.us-west-2.amazonaws.com") &&
      !imageUrl.includes("notion.so") &&
      !imageUrl.includes("prod-files-secure")
    ) {
      return new Response("Only Notion image URLs are allowed", { status: 403 });
    }

    // Phase 5에서 실제 Notion API 호출로 최신 URL을 조회할 수 있음
    // 현재는 제공된 URL로 직접 리다이렉트
    // 향후: getCachedPostBySlug()를 통해 최신 이미지 URL 재조회
    redirect(imageUrl);
  } catch (error) {
    console.error("[API] /api/image 에러:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

/**
 * 사용 예시:
 *
 * ```typescript
 * // Notion 이미지 URL이 만료되었을 경우
 * const notionImageUrl = "https://prod-files-secure.s3.us-west-2.amazonaws.com/...";
 *
 * // 옵션 1: Image 컴포넌트에서 프록시 사용
 * <Image
 *   src={`/api/image?url=${encodeURIComponent(notionImageUrl)}`}
 *   alt="..."
 * />
 *
 * // 옵션 2: 지원 중단 - 외부 이미지 서비스 권장
 * // Unsplash, Cloudinary 등 외부 서비스의 이미지 사용
 * <Image
 *   src="https://images.unsplash.com/photo-..."
 *   alt="..."
 * />
 * ```
 *
 * 향후 개선 사항:
 * - Notion API를 통해 페이지 ID에서 최신 이미지 URL 자동 조회
 * - 캐시 전략 적용 (프록시 응답 캐싱)
 * - 이미지 최적화 (리사이징, 포맷 변환)
 * - 접근 권한 검증 (토큰 기반)
 */
