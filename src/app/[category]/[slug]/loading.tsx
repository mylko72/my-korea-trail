/**
 * 코스 상세 페이지 로딩 스켈레톤 (app/[category]/[slug]/loading.tsx)
 *
 * Next.js App Router의 Suspense 기반 로딩 UI입니다.
 * 코스 상세 페이지([category]/[slug]/page.tsx) 데이터 페칭 중 자동으로 표시됩니다.
 *
 * 구성:
 * 1. 커버 이미지 스켈레톤 — aspect-video 풀 와이드 영역
 * 2. 뒤로 가기 버튼 스켈레톤
 * 3. 헤더 영역 스켈레톤 — 배지, 제목, 설명
 * 4. 메타 정보 카드 스켈레톤 — 날짜/거리/시간/경로 4개 항목
 * 5. 지도 영역 스켈레톤
 * 6. 본문 콘텐츠 스켈레톤 — 코스 소개 + 코스 리뷰 섹션
 * 7. 갤러리 스켈레톤 — 2열 이미지 그리드
 *
 * Phase 2에서 LoadingSkeleton.tsx 컴포넌트 개발 후 리팩토링 예정입니다.
 */

export default function CourseDetailLoading() {
  return (
    <article
      className="pb-20"
      aria-busy="true"
      aria-label="코스 상세 페이지 로딩 중"
    >

      {/* =========================================================
          커버 이미지 영역 스켈레톤
          page.tsx의 aspect-video max-h-[520px] 영역을 모방합니다.
          ========================================================= */}
      <div className="relative w-full aspect-video max-h-[520px] overflow-hidden bg-muted animate-pulse" />

      {/* =========================================================
          메인 콘텐츠 컨테이너
          page.tsx와 동일한 max-w-4xl 제약을 적용합니다.
          ========================================================= */}
      <div className="container mx-auto px-4 max-w-4xl">

        {/* -------------------------------------------------------
            뒤로 가기 버튼 스켈레톤
            ------------------------------------------------------- */}
        <div className="py-6">
          <div className="h-8 w-36 rounded-md bg-muted animate-pulse" />
        </div>

        {/* -------------------------------------------------------
            제목 및 메타 정보 헤더 스켈레톤
            page.tsx의 <header> 영역을 모방합니다.
            ------------------------------------------------------- */}
        <header className="mb-8">
          {/* 카테고리 배지 + 난이도 배지 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-10 rounded-full bg-muted animate-pulse" />
          </div>

          {/* 코스 제목 스켈레톤 */}
          <div className="h-9 w-3/4 rounded-lg bg-muted animate-pulse mb-4" />

          {/* 코스 요약 설명 스켈레톤 — 2줄 */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
            <div className="h-5 w-5/6 rounded bg-muted animate-pulse" />
          </div>
        </header>

        {/* -------------------------------------------------------
            메타 정보 카드 스켈레톤
            page.tsx의 Card → CardContent → dl grid-cols-2/4 구조를 모방합니다.
            ------------------------------------------------------- */}
        <div className="rounded-lg border border-border p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* 완주 날짜 */}
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-14 rounded bg-muted animate-pulse" />
              <div className="h-6 w-24 rounded bg-muted animate-pulse" />
            </div>
            {/* 총 거리 */}
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-12 rounded bg-muted animate-pulse" />
              <div className="h-6 w-20 rounded bg-muted animate-pulse" />
            </div>
            {/* 소요 시간 */}
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-16 rounded bg-muted animate-pulse" />
              <div className="h-6 w-24 rounded bg-muted animate-pulse" />
            </div>
            {/* 구간 경로 */}
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-14 rounded bg-muted animate-pulse" />
              <div className="h-6 w-28 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------
            지도 영역 스켈레톤
            page.tsx의 aspect-video 지도 플레이스홀더를 모방합니다.
            ------------------------------------------------------- */}
        <section className="mb-10">
          {/* 지도 섹션 제목 스켈레톤 */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded bg-muted animate-pulse" />
            <div className="h-7 w-24 rounded-lg bg-muted animate-pulse" />
          </div>

          {/* 지도 본체 스켈레톤 */}
          <div className="w-full aspect-video rounded-xl bg-muted animate-pulse" />

          {/* 출발지/도착지 정보 스켈레톤 */}
          <div className="flex items-center justify-between mt-3">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
          </div>
        </section>

        {/* 구분선 스켈레톤 */}
        <div className="h-px w-full bg-muted animate-pulse mb-10" />

        {/* -------------------------------------------------------
            본문 콘텐츠 영역 스켈레톤 — 코스 소개
            page.tsx의 content1 섹션을 모방합니다.
            ------------------------------------------------------- */}
        <section className="mb-10">
          {/* 섹션 제목 */}
          <div className="h-7 w-24 rounded-lg bg-muted animate-pulse mb-5" />

          {/* 단락 텍스트 5줄 */}
          <div className="space-y-2.5">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
          </div>

          {/* 두 번째 단락 */}
          <div className="space-y-2.5 mt-4">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          </div>
        </section>

        {/* 구분선 스켈레톤 */}
        <div className="h-px w-full bg-muted animate-pulse mb-10" />

        {/* -------------------------------------------------------
            본문 콘텐츠 영역 스켈레톤 — 코스 리뷰
            page.tsx의 content2 섹션을 모방합니다.
            ------------------------------------------------------- */}
        <section className="mb-10">
          {/* 섹션 제목 */}
          <div className="h-7 w-24 rounded-lg bg-muted animate-pulse mb-5" />

          {/* 단락 텍스트 4줄 */}
          <div className="space-y-2.5">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
          </div>

          {/* 두 번째 단락 */}
          <div className="space-y-2.5 mt-4">
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        </section>

        {/* -------------------------------------------------------
            이미지 갤러리 스켈레톤
            page.tsx의 grid-cols-1 md:grid-cols-2 갤러리를 모방합니다.
            ------------------------------------------------------- */}
        <section className="mb-10">
          {/* 섹션 제목 */}
          <div className="h-7 w-20 rounded-lg bg-muted animate-pulse mb-5" />

          {/* 이미지 2열 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video rounded-lg bg-muted animate-pulse"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </section>

        {/* 구분선 스켈레톤 */}
        <div className="h-px w-full bg-muted animate-pulse mb-10" />

        {/* -------------------------------------------------------
            하단 네비게이션 스켈레톤
            page.tsx의 <footer> 버튼 + 완보 상태 영역을 모방합니다.
            ------------------------------------------------------- */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="h-9 w-36 rounded-md bg-muted animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          </div>
        </footer>

      </div>
    </article>
  );
}
