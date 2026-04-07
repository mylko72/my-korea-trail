/**
 * 관리자 API: 전체 코스 목록 조회
 *
 * GET /api/admin/courses
 *
 * Middleware에서 admin-auth 쿠키를 검증하므로,
 * 이 Route Handler에서는 쿠키 추가 검증이 불필요합니다.
 *
 * 응답 (200):
 * [
 *   {
 *     id: "...",
 *     title: "...",
 *     category: "해파랑길",
 *     date: "2026-03-15",
 *     distance: 33.5,
 *     completed: true,
 *     published: true
 *   },
 *   ...
 * ]
 *
 * 응답 (500):
 * {
 *   error: "코스 목록 조회 실패"
 * }
 */

import { getAllPostsForAdmin } from '@/lib/notion';
import type { NextResponse } from 'next/server';
import { NextResponse as NR } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    const courses = await getAllPostsForAdmin();
    return NR.json(courses, { status: 200 });
  } catch (error) {
    console.error('[API] GET /api/admin/courses 에러:', error);
    return NR.json(
      { error: '코스 목록 조회 실패' },
      { status: 500 }
    );
  }
}
