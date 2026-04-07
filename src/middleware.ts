/**
 * Middleware: 관리자 페이지 접근 제어
 *
 * /admin, /admin/* 경로 접근 시 admin-auth 쿠키를 검증합니다.
 * 쿠키가 없으면 /auth/login 으로 리다이렉트합니다.
 *
 * 다른 경로는 영향을 받지 않습니다.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: /admin 접근 제어
 * @param request - 요청 객체
 * @returns 통과 또는 리다이렉트 응답
 */
export function middleware(request: NextRequest) {
  // 1. 요청 경로 확인
  const pathname = request.nextUrl.pathname;

  // 2. /admin 또는 /admin/* 경로인 경우만 처리
  if (pathname.startsWith('/admin')) {
    // 3. admin-auth 쿠키 확인
    const adminAuthCookie = request.cookies.get('admin-auth');

    if (!adminAuthCookie) {
      // 4. 쿠키 없으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. 다른 경로는 그대로 진행
  return NextResponse.next();
}

/**
 * Middleware 동작 범위
 * /admin, /auth 경로에만 적용
 */
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};
