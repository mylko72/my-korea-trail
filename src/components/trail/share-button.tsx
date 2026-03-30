'use client';

/**
 * ShareButton 컴포넌트
 *
 * 코스 상세 페이지에서 현재 URL을 복사하고 SNS로 공유할 수 있는 버튼입니다.
 * 기존 copyToClipboard 유틸리티와 Sonner 토스트를 활용합니다.
 *
 * 사용법:
 * <ShareButton url={window.location.href} title={post.title} />
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Twitter } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface ShareButtonProps {
  /** 공유할 페이지 URL */
  url: string;
  /** 공유할 페이지 제목 (SNS 공유 시 사용) */
  title: string;
}

/**
 * ShareButton 컴포넌트
 *
 * URL 복사 버튼 + SNS 공유 버튼(트위터)을 제공합니다.
 * 모바일에서는 공유 아이콘 한 개로 표시되고, 데스크톱에서는 버튼 그룹으로 표시됩니다.
 */
export function ShareButton({ url, title }: ShareButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  // URL 복사 함수
  const handleCopyUrl = async () => {
    setIsCopying(true);
    try {
      const success = await copyToClipboard(url);
      if (success) {
        toast.success('URL이 복사되었습니다');
      } else {
        toast.error('복사 실패');
      }
    } catch {
      toast.error('복사 중 오류가 발생했습니다');
    } finally {
      setIsCopying(false);
    }
  };

  // 트위터 공유 URL 생성
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} - 코리아 둘레길 기록 블로그`)}`;

  return (
    <div className="flex items-center gap-2">
      {/* URL 복사 버튼 */}
      <Button
        onClick={handleCopyUrl}
        disabled={isCopying}
        variant="outline"
        size="sm"
        className="gap-2"
        aria-label="URL 복사"
        title="URL을 클립보드에 복사합니다"
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">공유</span>
      </Button>

      {/* 트위터 공유 버튼 */}
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="트위터에서 공유"
        title="트위터에서 공유합니다"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Twitter className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">X</span>
        </Button>
      </a>
    </div>
  );
}
