/**
 * 카테고리 페이지 로딩 스켈레톤 (app/[category]/loading.tsx)
 *
 * Next.js App Router의 Suspense 기반 로딩 UI입니다.
 * 카테고리 페이지([category]/page.tsx) 데이터 페칭 중 자동으로 표시됩니다.
 *
 * 구성:
 * 1. 페이지 헤더 스켈레톤 — 카테고리명 제목, 게시글 수
 * 2. 게시글 목록 그리드 스켈레톤 — 카드 6개 (이미지 + 제목 + 설명 + 메타정보)
 *
 * 각 카드는 page.tsx의 TrailCard 레이아웃(이미지, CardHeader, CardContent)을 모방합니다.
 * Phase 2에서 LoadingSkeleton.tsx 컴포넌트 개발 후 리팩토링 예정입니다.
 */

export default function CategoryLoading() {
  return (
    <div
      className="container mx-auto px-4 py-12"
      aria-busy="true"
      aria-label="카테고리 페이지 로딩 중"
    >

      {/* =========================================================
          페이지 헤더 스켈레톤
          page.tsx의 "MapPin 배지 + h1 제목 + 게시글 수" 레이아웃 모방
          ========================================================= */}
      <div className="mb-10">
        {/* 상단 배지 라인 (아이콘 + 라벨) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-4 w-28 rounded bg-muted animate-pulse" />
        </div>

        {/* 카테고리 제목 스켈레톤 */}
        <div className="h-10 w-48 md:w-64 rounded-lg bg-muted animate-pulse mb-3" />

        {/* 게시글 수 텍스트 스켈레톤 */}
        <div className="h-5 w-24 rounded bg-muted animate-pulse" />
      </div>

      {/* =========================================================
          게시글 카드 그리드 스켈레톤
          모바일 1열 → 태블릿 2열 → 데스크톱 3열
          각 카드는 page.tsx의 Card 컴포넌트 구조를 따릅니다.
          ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border overflow-hidden"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* 대표 이미지 영역 스켈레톤 (aspect-video) */}
            <div className="aspect-video bg-muted animate-pulse" />

            {/* CardHeader 영역 스켈레톤 */}
            <div className="p-6 pb-4">
              {/* 날짜 + 배지 행 */}
              <div className="flex items-center justify-between mb-3">
                <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
                <div className="h-5 w-10 rounded-full bg-muted animate-pulse" />
              </div>

              {/* 게시글 제목 스켈레톤 */}
              <div className="h-6 w-3/4 rounded bg-muted animate-pulse mb-2" />

              {/* 설명 텍스트 스켈레톤 — 2줄 */}
              <div className="space-y-1.5">
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              </div>
            </div>

            {/* CardContent 영역 스켈레톤 (거리 + 소요시간) */}
            <div className="px-6 pb-6 pt-0">
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
