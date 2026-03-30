'use client';

/**
 * ScrollToTop 컴포넌트
 *
 * 페이지를 스크롤할 때 "맨 위로" 버튼을 표시하고,
 * 클릭 시 부드러운 스크롤로 페이지 최상단으로 이동합니다.
 *
 * 사용법:
 * - layout.tsx에 <ScrollToTop /> 추가
 * - 자동으로 스크롤 감지 후 300px 이상일 때 버튼 표시
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤했을 때만 버튼 표시
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 맨 위로 스크롤 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 버튼이 보이지 않으면 렌더링하지 않음
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 md:right-8 z-40">
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="맨 위로 이동"
        title="맨 위로 이동"
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
