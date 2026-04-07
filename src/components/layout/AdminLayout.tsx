/**
 * AdminLayout 컴포넌트
 *
 * 관리자 전용 레이아웃 래퍼 컴포넌트입니다.
 * 공개 사용자 레이아웃(NavBar/Footer)과 완전히 분리된 독립 레이아웃입니다.
 *
 * - 상단 헤더: 블로그명 + "관리자" 배지 + 공개 블로그 링크 + 로그아웃 버튼
 * - 다크모드 지원
 * - 반응형
 *
 * 사용 예시:
 * <AdminLayout>
 *   <div>관리자 콘텐츠</div>
 * </AdminLayout>
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

// =====================================================
// Props 타입 정의
// =====================================================

interface AdminLayoutProps {
  /** 본문 콘텐츠 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * AdminLayout
 *
 * 관리자 페이지 전체를 감싸는 레이아웃 컴포넌트입니다.
 * 헤더에는 로그아웃 버튼과 공개 블로그 링크가 포함됩니다.
 */
export function AdminLayout({ children, className }: AdminLayoutProps) {
  const router = useRouter();

  /** 로그아웃 처리 함수 */
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        // 로그아웃 성공 시 홈으로 리다이렉트
        router.push(data.redirectUrl ?? '/');
      }
    } catch {
      // 오류 발생 시에도 홈으로 이동
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 관리자 헤더 (sticky 고정) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* 좌측: 블로그명 + 관리자 배지 */}
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                코리아 둘레길
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-600 select-none">
                |
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/60 dark:text-red-300">
                관리자
              </span>
            </div>

            {/* 우측: 공개 블로그 링크 + 로그아웃 버튼 */}
            <div className="flex items-center gap-2">
              {/* 공개 블로그로 이동하는 링크 */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="공개 블로그 새 탭에서 열기"
                >
                  공개 블로그
                </Link>
              </Button>

              {/* 로그아웃 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="관리자 로그아웃"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <main
        className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className ?? ''}`}
      >
        {children}
      </main>
    </div>
  );
}
