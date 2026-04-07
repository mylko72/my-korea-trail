/**
 * 관리자 페이지 에러 바운더리
 *
 * 관리자 페이지에서 발생한 에러를 처리합니다.
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('관리자 페이지 에러:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h2 className="text-lg font-bold text-red-900 dark:text-red-200">
            오류가 발생했습니다
          </h2>
        </div>

        <p className="text-sm text-red-700 dark:text-red-300">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>

        {error.digest && (
          <p className="text-xs text-red-600 dark:text-red-400">
            오류 ID: {error.digest}
          </p>
        )}

        <div className="space-y-2 pt-2">
          <Button onClick={() => reset()} className="w-full">
            다시 시도
          </Button>
          <a href="/admin" className="block">
            <Button variant="outline" className="w-full">
              관리자 홈으로
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
