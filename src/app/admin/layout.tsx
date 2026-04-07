/**
 * 관리자 라우트 레이아웃 (App Router)
 *
 * `/admin` 경로의 App Router 레이아웃 파일입니다.
 * 실제 관리자 레이아웃 UI는 AdminLayout 컴포넌트에 구현되어 있으며,
 * 각 페이지에서 AdminLayout을 직접 사용합니다.
 *
 * 이 파일은 공개 사이트의 루트 layout.tsx(NavBar/Footer 포함)를
 * 관리자 페이지에서 제외하기 위해 독립된 레이아웃으로 선언됩니다.
 */

import type { ReactNode } from 'react';

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return children;
}
