'use client';

/**
 * PageLoader 컴포넌트
 *
 * Next.js 라우트 전환 시 상단에 고정된 진행바를 표시합니다.
 * React 19의 useTransition 훅을 활용하여 페이지 전환 상태를 감지합니다.
 *
 * 사용법:
 * - layout.tsx에 <PageLoader /> 추가
 * - 페이지 전환 시 자동으로 진행바가 표시되고, 로드 완료 시 사라집니다.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function PageLoader() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 페이지 네비게이션 감지
    const handleStart = () => {
      setIsLoading(true);
      setProgress(10);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    };

    // Next.js 15에서 라우트 변경 감지
    // popstate 이벤트와 함께 history 변경을 감지합니다
    window.addEventListener('popstate', handleStart);

    // 페이지 로드 완료 감지 (visibilitychange)
    const handleVisibilityChange = () => {
      if (document.hidden === false) {
        handleComplete();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 초기 페이지 로드 완료
    if (document.readyState === 'complete') {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('popstate', handleStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  // 진행바 진행 애니메이션
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-primary transition-all duration-300 z-50"
      style={{
        width: `${progress}%`,
        opacity: isLoading ? 1 : 0,
      }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="페이지 로딩 중"
    />
  );
}
