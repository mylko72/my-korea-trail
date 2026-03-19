/**
 * 푸터 컴포넌트 (Footer)
 *
 * 모든 페이지 하단에 표시되는 글로벌 푸터입니다.
 * 외부 링크(GitHub, 기술 공식 사이트)와 저작권 정보를 제공합니다.
 *
 * 주요 구성:
 * - GitHub 저장소 링크 (Lucide의 Github 아이콘 사용)
 * - 5개 기술 스택 아이콘 링크 (SVG 인라인 직접 정의)
 * - 아이콘 호버 시 나타나는 툴팁(기술 이름 표시)
 * - 저작권 정보 (연도는 JavaScript로 동적 계산)
 *
 * SVG 아이콘을 인라인으로 직접 정의한 이유:
 * Lucide React에 일부 프레임워크 아이콘이 없기 때문에 각 프레임워크의
 * 공식 SVG 로고를 직접 컴포넌트로 구현했습니다.
 * aria-hidden="true"를 추가해 스크린리더가 장식용 아이콘을 무시하도록 합니다.
 */

import Link from "next/link";
import { Github } from "lucide-react";

/**
 * React.js 공식 로고 SVG 컴포넌트
 * 원자(atom) 형태의 React 로고를 인라인 SVG로 구현합니다.
 */
const ReactIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.15-1.315.283-2.015.386.24-.375.48-.762.705-1.158.225-.39.435-.782.634-1.176zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
  </svg>
);

/**
 * Next.js 공식 로고 SVG 컴포넌트
 * N 형태의 Next.js 로고를 인라인 SVG로 구현합니다.
 */
const NextjsIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.5722 0C5.1835 0 0 5.1835 0 11.5722c0 6.3887 5.1835 11.572 11.5722 11.572 6.3887 0 11.572-5.1833 11.572-11.572C23.1442 5.1835 17.9609 0 11.5722 0zm5.6673 20.6459L4.9587 6.4975H3.7262v8.3597H5.098v-6.267L15.0044 21.44c.7483-.254 1.4572-.5882 2.1351-.7941zm1.5708-5.6888V6.4975h-1.3722v8.3597h1.3722z" />
  </svg>
);

/**
 * Tailwind CSS 공식 로고 SVG 컴포넌트
 * 파도(wave) 형태의 Tailwind 로고를 인라인 SVG로 구현합니다.
 */
const TailwindIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
  </svg>
);

/**
 * shadcn/ui 공식 로고 SVG 컴포넌트
 * 두 개의 대각선으로 이루어진 shadcn/ui 로고입니다.
 */
const ShadcnIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
    <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
  </svg>
);

/**
 * Lucide React 로고 SVG 컴포넌트
 * 원형 호(arc)로 표현한 Lucide React 로고입니다.
 */
const LucideIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 3a9 9 0 0 1 9 9" stroke="#F56565" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 프레임워크 아이콘 링크 목록
 * 각 기술의 공식 웹사이트로 이동하는 외부 링크입니다.
 * 새 기술을 추가할 때 이 배열에 항목을 추가하세요.
 */
const frameworkLinks = [
  { label: "React.js", href: "https://react.dev", icon: <ReactIcon /> },
  { label: "Next.js", href: "https://nextjs.org", icon: <NextjsIcon /> },
  { label: "Tailwind CSS", href: "https://tailwindcss.com", icon: <TailwindIcon /> },
  { label: "shadcn/ui", href: "https://ui.shadcn.com", icon: <ShadcnIcon /> },
  { label: "Lucide React", href: "https://lucide.dev", icon: <LucideIcon /> },
];

// 프로젝트 GitHub 저장소 URL (상수로 분리해 관리합니다)
const GIT_REPO_URL = "https://github.com/mylko72/my-nextjs-starterkit";

/**
 * Footer 컴포넌트
 *
 * 서버 컴포넌트로 동작합니다 ("use client" 없음).
 * 인터랙션 없이 정적 링크만 제공하므로 서버에서 렌더링됩니다.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">

        {/* 상단 영역: GitHub 링크(좌)와 기술 스택 아이콘(우) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

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
            <Github className="h-5 w-5" />
            <span className="text-sm font-medium">GitHub 저장소</span>
          </Link>

          {/* 기술 스택 아이콘 링크 목록 */}
          <nav className="flex flex-wrap gap-4 md:gap-6" aria-label="관련 기술 링크">
            {frameworkLinks.map((link) => (
              // group 클래스로 부모 hover 시 자식 툴팁을 보이게 합니다.
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`${link.label} 공식 사이트로 이동`}
                >
                  {link.icon}
                </Link>

                {/*
                  아이콘 호버 시 나타나는 툴팁
                  opacity-0에서 group-hover:opacity-100으로 전환되어 페이드인 효과를 줍니다.
                  pointer-events-none으로 툴팁 자체가 마우스 이벤트를 방해하지 않도록 합니다.
                */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-foreground text-background rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {link.label}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* 저작권 정보: new Date().getFullYear()로 연도를 자동 갱신합니다 */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Frontend Starter Kit. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
