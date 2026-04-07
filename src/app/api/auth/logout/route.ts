/**
 * 관리자 로그아웃 처리 API Route
 *
 * POST /api/auth/logout
 * (본문 없음)
 *
 * 응답 (성공 - 200):
 * {
 *   "success": true,
 *   "redirectUrl": "/"
 * }
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(): Promise<NextResponse> {
  try {
    // 1. 쿠키 삭제
    (await cookies()).delete('admin-auth');

    // 2. 성공 응답
    return NextResponse.json(
      { success: true, redirectUrl: '/' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Auth Logout] 에러:', error);
    return NextResponse.json(
      { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
