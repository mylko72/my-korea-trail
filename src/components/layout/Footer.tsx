/**
 * 푸터 컴포넌트 (Footer)
 *
 * 모든 페이지 하단에 표시되는 글로벌 푸터입니다.
 * 카테고리 빠른 이동 링크와 저작권 정보를 제공합니다.
 */

import Link from "next/link";
import { Github, Footprints } from "lucide-react";

/**
 * 카테고리 빠른 이동 링크 목록
 * 새 카테고리를 추가할 때 이 배열에 항목을 추가하세요.
 */
const categoryLinks = [
  { label: "동해안", href: "/east-coast" },
  { label: "남해안", href: "/south-coast" },
  { label: "서해안", href: "/west-coast" },
  { label: "DMZ", href: "/dmz" },
  { label: "지리산", href: "/jirisan" },
];

// 프로젝트 GitHub 저장소 URL (상수로 분리해 관리합니다)
const GIT_REPO_URL = "https://github.com";

/**
 * Footer 컴포넌트
 *
 * 서버 컴포넌트로 동작합니다 ("use client" 없음).
 * 카테고리 링크와 저작권 정보를 제공합니다.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">

        {/* 상단 영역: 로고(좌)와 카테고리 링크(우) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* 브랜드 영역 */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Footprints className="h-5 w-5" />
            <span className="text-sm font-semibold text-foreground">코리아 둘레길</span>
          </div>

          {/* 카테고리 빠른 이동 링크 */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="카테고리 링크">
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/*
            GitHub 저장소 링크
            target="_blank": 새 탭에서 열립니다.
            rel="noopener noreferrer": 보안 취약점(탭 나인킹 공격) 방지를 위해 반드시 추가합니다.
          */}
          <Link
            href={GIT_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub 저장소로 이동"
          >
            <Github className="h-4 w-4" />
            <span className="text-sm">GitHub</span>
          </Link>
        </div>

        {/* 저작권 정보: new Date().getFullYear()로 연도를 자동 갱신합니다 */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} 코리아 둘레길. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
