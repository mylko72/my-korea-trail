/**
 * 홈 페이지 로딩 스켈레톤 (app/loading.tsx)
 *
 * Next.js App Router의 Suspense 기반 로딩 UI입니다.
 * 홈 페이지(page.tsx) 데이터 페칭 중 자동으로 표시됩니다.
 *
 * 구성:
 * 1. Hero 섹션 스켈레톤 — 제목, 설명, CTA 버튼 형태 모방
 * 2. 카테고리 섹션 스켈레톤 — 5개 카드 그리드
 * 3. 소개 섹션 스켈레톤 — 제목 + 텍스트 3줄
 *
 * Phase 2에서 LoadingSkeleton.tsx 컴포넌트 개발 후 리팩토링 예정입니다.
 */

export default function HomeLoading() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="홈 페이지 로딩 중">

      {/* =========================================================
          Hero 섹션 스켈레톤
          page.tsx의 Hero 섹션 레이아웃을 그대로 모방합니다.
          ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">

          {/* 브랜드 배지 스켈레톤 */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-36 rounded bg-muted animate-pulse" />
          </div>

          {/* 메인 제목 스켈레톤 — 2줄 */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="h-10 w-64 md:w-96 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 w-48 md:w-72 rounded-lg bg-muted animate-pulse" />
          </div>

          {/* 소개 문구 스켈레톤 — 2줄 */}
          <div className="flex flex-col items-center gap-2 mb-10 max-w-2xl mx-auto">
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
            <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
          </div>

          {/* CTA 버튼 스켈레톤 */}
          <div className="h-11 w-36 rounded-md bg-muted animate-pulse mx-auto" />
        </div>
      </section>

      {/* =========================================================
          카테고리 섹션 스켈레톤
          5개 카드 그리드를 반응형으로 배치합니다.
          모바일 1열 → 태블릿 2열 → 데스크톱 3열
          ========================================================= */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">

          {/* 섹션 헤더 스켈레톤 */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-4 w-4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-9 w-48 rounded-lg bg-muted animate-pulse mx-auto mb-4" />
            <div className="h-5 w-72 rounded bg-muted animate-pulse mx-auto" />
          </div>

          {/* 카테고리 카드 5개 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-lg bg-muted animate-pulse"
                style={{ animationDelay: `${index * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          소개 섹션 스켈레톤
          page.tsx의 "코리아 둘레길이란?" 섹션을 모방합니다.
          ========================================================= */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">

            {/* 섹션 제목 스켈레톤 */}
            <div className="h-9 w-52 rounded-lg bg-muted animate-pulse mx-auto mb-6" />

            {/* 텍스트 3줄 스켈레톤 */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
            </div>

            {/* 두 번째 단락 텍스트 스켈레톤 */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
