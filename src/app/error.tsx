'use client';

/**
 * 전역 에러 바운더리 (Global Error Boundary)
 *
 * Next.js App Router에서 자식 라우트에서 발생한 런타임 에러를 캐치하여
 * 사용자에게 친화적인 에러 화면을 표시합니다.
 *
 * 동작 방식:
 * - 서버 컴포넌트 또는 클라이언트 컴포넌트에서 throw된 에러를 캐치
 * - reset() 함수로 에러 상태를 초기화하고 리렌더링 시도
 * - 개발 환경에서만 상세 에러 메시지를 노출 (프로덕션에서는 숨김)
 *
 * 주의: 이 파일은 'use client' 지시문이 필수입니다.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** error.tsx의 props 인터페이스 (Next.js 15 규격) */
interface ErrorPageProps {
  /** 캐치된 에러 객체 */
  error: Error & { digest?: string };
  /** 에러 상태를 초기화하고 컴포넌트 트리를 재렌더링하는 함수 */
  reset: () => void;
}

/**
 * ErrorPage 컴포넌트
 *
 * 예기치 않은 런타임 에러 발생 시 표시되는 에러 UI입니다.
 * "다시 시도" 버튼으로 복구를 시도하거나, "홈으로" 링크로 안전하게 이탈할 수 있습니다.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // 에러를 콘솔에 기록 (모니터링 서비스 연동 시 이 위치에서 처리)
  useEffect(() => {
    console.error('[ErrorBoundary]', error);
  }, [error]);

  // 개발 환경 여부 판단 (프로덕션에서는 상세 에러 숨김)
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md text-center space-y-6">

        {/* 에러 아이콘 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle
              className="w-10 h-10 text-destructive"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* 제목 및 설명 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            문제가 발생했습니다
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            페이지를 불러오는 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도하거나 홈으로 돌아가 주세요.
          </p>
        </div>

        {/* 개발 환경에서만 표시하는 상세 에러 정보 */}
        {isDevelopment && (
          <details className="text-left rounded-lg border border-border bg-muted/50 p-4 cursor-pointer">
            <summary className="text-sm font-medium text-muted-foreground select-none">
              개발 환경 에러 상세 정보
            </summary>
            <div className="mt-3 space-y-2">
              {/* 에러 메시지 */}
              <p className="text-sm font-mono text-destructive break-all">
                {error.message}
              </p>
              {/* Vercel/Next.js 에러 다이제스트 (있을 경우) */}
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* 다시 시도: reset()을 호출하여 에러 상태 초기화 */}
          <Button
            onClick={reset}
            variant="default"
            className="gap-2"
            aria-label="페이지를 다시 시도합니다"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            다시 시도
          </Button>

          {/* 홈으로 이동 */}
          <Button
            asChild
            variant="outline"
            className="gap-2"
            aria-label="홈 페이지로 이동합니다"
          >
            <Link href="/">
              <Home className="w-4 h-4" aria-hidden="true" />
              홈으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
