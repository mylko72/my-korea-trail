/**
 * 관리자 API: 코스 상태 업데이트
 *
 * PATCH /api/admin/courses/[pageId]
 * Content-Type: application/json
 * {
 *   "field": "completed" | "published",
 *   "value": boolean
 * }
 *
 * Middleware에서 admin-auth 쿠키를 검증하므로,
 * 이 Route Handler에서는 쿠키 추가 검증이 불필요합니다.
 *
 * 응답 (200):
 * {
 *   "success": true,
 *   "pageId": "...",
 *   "field": "completed",
 *   "value": true
 * }
 *
 * 응답 (400):
 * {
 *   "error": "필드가 유효하지 않습니다 (completed | published)"
 * }
 *
 * 응답 (500):
 * {
 *   "error": "상태 업데이트 실패"
 * }
 */

import { updateCourseStatus } from '@/lib/notion';
import type { NextRequest, NextResponse } from 'next/server';
import { NextResponse as NR } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
): Promise<NextResponse> {
  try {
    // 1. 경로에서 pageId 추출 (Next.js 16: params는 Promise)
    const { pageId } = await params;

    // 2. 요청 본문 파싱
    const body = await request.json();
    const { field, value } = body as {
      field?: string;
      value?: unknown;
    };

    // 3. 필드 검증
    if (!field || !['completed', 'published'].includes(field)) {
      return NR.json(
        { error: '필드가 유효하지 않습니다 (completed | published)' },
        { status: 400 }
      );
    }

    if (typeof value !== 'boolean') {
      return NR.json(
        { error: '값이 boolean이어야 합니다' },
        { status: 400 }
      );
    }

    // 4. updateCourseStatus 호출
    const result = await updateCourseStatus(
      pageId,
      field as 'completed' | 'published',
      value
    );

    // 5. 성공 응답
    return NR.json(result, { status: 200 });
  } catch (error) {
    console.error('[API] PATCH /api/admin/courses/[pageId] 에러:', error);
    return NR.json(
      { error: '상태 업데이트 실패' },
      { status: 500 }
    );
  }
}
