/**
 * 404 페이지 (Not Found Page)
 *
 * Next.js App Router에서 다음 두 경우에 자동으로 렌더링됩니다:
 * 1. 정의되지 않은 URL 경로에 직접 접근할 때 (예: /존재하지-않는-경로)
 * 2. 서버 컴포넌트에서 `notFound()` 함수를 호출할 때
 *    (예: 유효하지 않은 category 슬러그 → [category]/page.tsx에서 notFound() 호출)
 *
 * 서버 컴포넌트이므로 'use client' 지시문을 사용하지 않습니다.
 */

import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * NotFoundPage 컴포넌트
 *
 * 404 상태일 때 표시되는 UI입니다.
 * 사용자가 홈으로 쉽게 복귀할 수 있도록 안내합니다.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md text-center space-y-6">

        {/* 404 아이콘 영역 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <MapPin
              className="w-10 h-10 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 404 숫자 표시 */}
        <div className="space-y-1">
          <p
            className="text-7xl font-bold text-muted-foreground/30 leading-none select-none"
            aria-hidden="true"
          >
            404
          </p>
        </div>

        {/* 제목 및 설명 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            요청하신 페이지가 존재하지 않거나
            <br />
            삭제 또는 이동되었을 수 있습니다.
          </p>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <div className="flex justify-center">
          <Button
            asChild
            variant="default"
            className="gap-2"
            aria-label="홈 페이지로 돌아갑니다"
          >
            <Link href="/">
              <Home className="w-4 h-4" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
