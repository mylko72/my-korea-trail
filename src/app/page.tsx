/**
 * 홈 페이지 (Home Page)
 *
 * 스타터킷의 메인 랜딩 페이지입니다.
 * 방문자에게 프로젝트의 목적과 기능을 소개하고, 주요 섹션으로 안내합니다.
 *
 * 페이지 구성:
 * 1. Hero 섹션 — 프로젝트 소개 및 CTA 버튼
 * 2. 기술 스택 섹션 — 사용된 기술 목록을 배지 형태로 표시
 * 3. 주요 기능 섹션 — 6가지 핵심 기능을 카드 그리드로 나열
 * 4. 빠른 시작 섹션 — 3단계 설치 및 실행 가이드
 * 5. CTA 섹션 — 컴포넌트/API 문서로 유도하는 하단 버튼
 */

import Link from "next/link";
import { ArrowRight, Code2, Palette, Zap, Shield, Smartphone, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 주요 기능 카드 목록
 * 각 항목은 아이콘, 제목, 설명, 배지로 구성됩니다.
 * 새로운 기능을 추가할 때 이 배열에 항목을 추가하세요.
 */
const features = [
  {
    icon: Code2,
    title: "최신 기술 스택",
    description: "Next.js 16 + React 19 + TypeScript 기반. 최신 웹 개발 표준을 따릅니다.",
    badge: "Next.js 16",
  },
  {
    icon: Palette,
    title: "다크/라이트 모드",
    description: "CSS 변수 기반의 테마 시스템. localStorage에 사용자 선호도를 저장합니다.",
    badge: "Tailwind v4",
  },
  {
    icon: Package,
    title: "shadcn/ui 컴포넌트",
    description: "30+ 재사용 가능한 UI 컴포넌트. Radix UI 기반으로 접근성이 보장됩니다.",
    badge: "shadcn/ui",
  },
  {
    icon: Smartphone,
    title: "완전 반응형",
    description: "모바일 퍼스트 설계. 모든 디바이스에서 최적의 UX를 제공합니다.",
    badge: "반응형",
  },
  {
    icon: Zap,
    title: "빠른 개발 시작",
    description: "Mock 데이터와 유틸리티 함수로 즉시 개발을 시작할 수 있습니다.",
    badge: "생산성",
  },
  {
    icon: Shield,
    title: "접근성 고려",
    description: "ARIA 속성과 키보드 네비게이션을 지원하는 a11y 친화적 컴포넌트.",
    badge: "a11y",
  },
];

/**
 * 기술 스택 배지 목록
 * color 속성은 Tailwind CSS 클래스로, 각 기술의 브랜드 색상을 반영합니다.
 * 다크 모드에서도 잘 보이도록 dark: 접두사 클래스를 함께 지정했습니다.
 */
const techStack = [
  { name: "Next.js", version: "16.1.6", color: "bg-black text-white dark:bg-white dark:text-black" },
  { name: "React", version: "19.2.3", color: "bg-cyan-500 text-white" },
  { name: "TypeScript", version: "^5.0", color: "bg-blue-600 text-white" },
  { name: "Tailwind CSS", version: "v4", color: "bg-teal-500 text-white" },
  { name: "shadcn/ui", version: "Latest", color: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black" },
  { name: "Lucide React", version: "^0.574", color: "bg-orange-500 text-white" },
];

/**
 * HomePage 컴포넌트
 *
 * 서버 컴포넌트(Server Component)로 동작합니다.
 * 인터랙션이 없으므로 "use client" 없이 서버에서 렌더링됩니다.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* =========================================================
          Hero 섹션
          프로젝트의 첫인상을 결정하는 영역입니다.
          그라디언트 배경과 대형 타이포그래피로 시선을 집중시킵니다.
          ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">

          {/* 업데이트 안내 배지 */}
          <div className="mb-6 inline-flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              ✨ 최신 버전으로 업데이트됨
            </Badge>
          </div>

          {/* 메인 제목: 그라디언트 텍스트로 시각적 임팩트를 줍니다 */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Frontend
            <br />
            Starter Kit
          </h1>

          {/* 프로젝트 한 줄 소개 */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Next.js + React + Tailwind CSS + shadcn/ui로 구성된
            <br className="hidden md:block" />
            모던 프론트엔드 개발 스타터킷입니다.
            <br />
            즉시 사용 가능한 컴포넌트와 Mock 데이터를 제공합니다.
          </p>

          {/* CTA 버튼 그룹: 주요 페이지로 빠르게 이동할 수 있습니다 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/components">
                컴포넌트 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/api-docs">API 문서 보기</Link>
            </Button>
          </div>
        </div>

        {/*
          배경 장식용 원형 블러 효과
          aria-hidden="true"로 스크린리더가 무시하도록 처리합니다.
          pointer-events-none으로 마우스 이벤트를 차단해 클릭에 방해되지 않게 합니다.
        */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
      </section>

      {/* =========================================================
          기술 스택 섹션
          사용된 라이브러리와 버전을 한눈에 보여줍니다.
          방문자가 프로젝트의 기술 구성을 빠르게 파악할 수 있습니다.
          ========================================================= */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">
            기술 스택
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* techStack 배열을 순회하며 각 기술 배지를 렌더링합니다 */}
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${tech.color}`}
              >
                <span>{tech.name}</span>
                {/* 버전 정보는 약간 투명하게 처리해 시각적 계층을 만듭니다 */}
                <span className="opacity-70">{tech.version}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          주요 기능 섹션
          스타터킷이 제공하는 6가지 핵심 기능을 카드 그리드로 나열합니다.
          aria-labelledby로 섹션 제목과 연결해 접근성을 높입니다.
          ========================================================= */}
      <section className="py-20 md:py-28" aria-labelledby="features-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">주요 기능</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              개발 생산성을 높이는 다양한 기능들을 제공합니다.
            </p>
          </div>

          {/* 반응형 그리드: 모바일 1열 → 태블릿 2열 → 데스크톱 3열 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              // 아이콘 컴포넌트를 변수로 받아 JSX에서 동적으로 렌더링합니다
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {/* 아이콘 배경: primary 색상에 10% 투명도를 적용해 부드럽게 표현합니다 */}
                      <div className="p-2 rounded-lg bg-primary/10 w-fit">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{feature.badge}</Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          빠른 시작 섹션
          개발 서버를 시작하기 위한 3단계를 카드로 안내합니다.
          순서 번호(01, 02, 03)로 진행 흐름을 직관적으로 표현합니다.
          ========================================================= */}
      <section className="py-20 bg-muted/30 border-t border-border" aria-labelledby="quick-start-title">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 id="quick-start-title" className="text-3xl font-bold mb-4 text-center">빠른 시작</h2>
            <p className="text-muted-foreground text-center mb-10">
              아래 명령어를 실행하여 개발 서버를 시작하세요.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1단계: 의존성 설치 */}
              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">01</div>
                  <CardTitle className="text-base">의존성 설치</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="block bg-muted rounded-md p-3 text-sm font-mono text-foreground">
                    npm install
                  </code>
                </CardContent>
              </Card>

              {/* 2단계: 개발 서버 실행 */}
              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">02</div>
                  <CardTitle className="text-base">개발 서버 실행</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="block bg-muted rounded-md p-3 text-sm font-mono text-foreground">
                    npm run dev
                  </code>
                </CardContent>
              </Card>

              {/* 3단계: 프로덕션 빌드 */}
              <Card>
                <CardHeader>
                  <div className="text-2xl font-bold text-primary mb-2">03</div>
                  <CardTitle className="text-base">프로덕션 빌드</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="block bg-muted rounded-md p-3 text-sm font-mono text-foreground">
                    npm run build
                  </code>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA (Call To Action) 섹션
          페이지 하단에서 다시 한번 주요 링크로 유도합니다.
          스크롤을 끝까지 내린 방문자가 다음 행동을 쉽게 취할 수 있도록 합니다.
          ========================================================= */}
      <section className="py-20 text-center" aria-labelledby="cta-title">
        <div className="container mx-auto px-4">
          <h2 id="cta-title" className="text-3xl font-bold mb-4">지금 시작해보세요</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            다양한 컴포넌트와 API 문서를 확인하고 나만의 프로젝트를 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/components">
                컴포넌트 탐색하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/api-docs">API 문서 보기</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
