/**
 * 관리자 로그인 처리 API Route
 *
 * POST /api/auth/login
 * Content-Type: application/json
 * {
 *   "password": "사용자입력패스워드"
 * }
 *
 * 응답 (성공 - 200):
 * {
 *   "success": true,
 *   "redirectUrl": "/admin"
 * }
 *
 * 응답 (실패 - 401):
 * {
 *   "success": false,
 *   "error": "패스워드가 일치하지 않습니다."
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. 요청 본문 파싱
    const body = await request.json();
    const { password } = body as { password?: string };

    // 2. 환경변수 검증
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('[Auth] ADMIN_PASSWORD 환경변수 미설정');
      return NextResponse.json(
        { success: false, error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    // 3. 패스워드 검증
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: '패스워드가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 4. 쿠키 설정 + 성공 응답
    const response = NextResponse.json(
      { success: true, redirectUrl: '/admin' },
      { status: 200 }
    );

    response.cookies.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7일
    });

    return response;
  } catch (error) {
    console.error('[Auth Login] 에러:', error);
    return NextResponse.json(
      { success: false, error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
