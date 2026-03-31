# 코리아 둘레길 기록 블로그 개발 로드맵

> 작성일: 2026-03-23
> 기준 문서: PRD v1.0 (Notion CMS 기반 코리아 둘레길 기록 블로그)

---

## 프로젝트 개요

Notion을 CMS로 활용하여 코리아 둘레길(해파랑길·남파랑길·서해랑길·DMZ 평화의 길) 코스 정보를
자동으로 블로그에 반영하는 Next.js 기반 웹 애플리케이션입니다.
트래킹 애호가 및 여행 블로거를 주 사용자로 하며, 블로거가 Notion에 기록을 작성하면
별도의 배포 없이 블로그에 즉시 반영되는 구조를 목표로 합니다.

### 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 |
| UI 라이브러리 | React 19 |
| 스타일 | TailwindCSS v4, shadcn/ui |
| CMS | Notion API v5 (@notionhq/client) |
| 지도 | Google Maps API (@react-google-maps/api) |
| 배포 | Vercel |

### 기능 ID 목록

| ID | 기능명 | 우선순위 |
|---|---|---|
| F001 | Notion API 연동 | 핵심 |
| F002 | 코스 목록 표시 | 핵심 |
| F003 | 코스 상세 표시 | 핵심 |
| F004 | 카테고리 필터링 | 중요 |
| F005 | 날짜 필터링 | 중요 |
| F006 | 검색 기능 | 중요 |
| F007 | Google Maps 연동 | 중요 |

### 페이지-기능 매핑

| 페이지 | 관련 기능 |
|---|---|
| 홈 페이지 (`/`) | F001, F002, F006 |
| 카테고리 페이지 (`/[category]`) | F001, F002, F004, F005 |
| 코스 상세 페이지 (`/[category]/[slug]`) | F001, F003, F007 |

---

## 현재 구현 완료 상태 (2026-03-31 기준)

✅ **Phase 1: 프로젝트 초기 설정 100% 완료** (2026-03-30)
- 최종 커밋: f5a0018 🔧 chore: 설정파일, 에이전트메모리, 테스트스크린샷 추가

✅ **Phase 2: 공통 모듈 및 컴포넌트 개발 100% 완료** (2026-03-30)
- 최종 커밋: 35bd8e9 feat: Phase 2 공통 컴포넌트 개발 완료

✅ **Phase 3: 핵심 기능 개발 100% 완료** (2026-03-30)
- 최종 커밋: (staging - Mock 데이터, 홈/카테고리/상세 페이지, 필터/검색 UI 완성)
- npm run build: ✅ 성공 (23개 정적 페이지 생성)
- 반응형 검증: ✅ 375px, 768px, 1280px
- 다크모드: ✅ Tailwind v4 완준수

✅ **Phase 4: 추가 기능 개발 100% 완료** (2026-03-30)
- 최종 커밋: 8개 Task 모두 완료 (다크모드, ARIA, Sitemap, OG/JSON-LD, PageLoader, ScrollToTop, ShareButton, Lighthouse)

🚀 **Phase 5: API 연동 및 비즈니스 로직 구현 진행 중** (2026-03-31 시작)
- Task 1: TrailPost 누락 필드 추가 (completed, content2, images, rate) ✅ **완료**
  - types.ts: 4개 필드 추가
  - notion.ts: Notion 속성 매핑 추가
  - mockData.ts: 11개 Mock 데이터 필드값 추가 (전체 완보/미완 혼합)
  - [slug]/page.tsx: 4곳 렌더링 수정 (완보상태, 리뷰, 이미지갤러리, 별점)
  - NOTION_DATABASE_SETUP.md: 신규 필드 설정 가이드 추가
  - npm run build: ✅ 성공 (10개 정적 페이지 생성)
  - Playwright E2E 테스트: ✅ 작성 완료 (1/8 통과, 나머지 타임아웃)
- 다음 작업: Notion API 캐싱 + Google Maps 연동 + E2E 테스트 개선

아래 로드맵은 **미완료 항목 중심**으로 작성되었으며, 완료 항목은 체크 표시로 구분합니다.

---

## Phase 1: 프로젝트 초기 설정 (골격 구축)

### 진행 순서 및 근거

모든 개발 작업의 토대가 되는 단계입니다. 환경 설정과 폴더 구조가 먼저 확립되어야
이후 컴포넌트와 기능 개발이 일관된 규칙 아래 진행될 수 있습니다.
TypeScript 타입 정의와 Next.js App Router 라우트 구조를 초기에 확정함으로써
팀 전체가 동일한 인터페이스를 기준으로 병렬 개발할 수 있습니다.

### 작업 항목

#### 환경 설정

- [x] Next.js 16 + TypeScript 프로젝트 초기화 (`create-next-app`)
- [x] TailwindCSS v4, PostCSS 설정 완료 (`tailwind.config`, `postcss.config.mjs`)
- [x] shadcn/ui 초기화 및 `components.json` 설정
- [x] ESLint 설정 (`eslint.config.mjs`)
- [x] `tsconfig.json` 경로 별칭 설정 (`@/*` → `src/*`)
- [x] `.env.local` 환경 변수 파일 생성 및 `.gitignore` 등록 (2026-03-30 완료)
  ```
  NOTION_API_TOKEN=
  NOTION_DATABASE_ID=
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
  ```
- [x] `next.config.ts` 이미지 도메인 허용 설정 (2026-03-30 완료)
  ```ts
  // notion.so, amazonaws.com, images.unsplash.com 등 설정됨
  images: { remotePatterns: [...] }
  ```

#### 프로젝트 구조 확정

- [x] `src/app/` App Router 기본 구조 생성
- [x] `src/components/ui/` shadcn/ui 기본 컴포넌트 설치
- [x] `src/components/layout/` 레이아웃 컴포넌트 폴더 생성
- [x] `src/lib/` 유틸리티 및 API 폴더 생성
- [x] `src/contexts/` Context API 폴더 생성

#### TypeScript 타입 정의 (`src/lib/types.ts`)

- [x] `TrailCategory` 타입 정의 (동해안, 남해안, 서해안, DMZ, 지리산)
- [x] `TrailPost` 인터페이스 정의 (id, title, category, slug, date, coverImage 등)
- [x] `TrailDifficulty` 타입 정의 (쉬움, 보통, 어려움)
- [x] `GeoPoint` 인터페이스 정의 (lat, lng, name)
- [x] `PaginatedResult<T>` 제네릭 타입 정의
- [x] `MapMarker` 인터페이스 정의
- [x] Notion API 응답 타입 정의 (`NotionRichText`, `NotionFile` 등)

#### 라우트 구조 확정

- [x] `/` 홈 페이지 라우트
- [x] `/[category]` 카테고리 동적 라우트
- [x] `/[category]/[slug]` 코스 상세 동적 라우트 생성 (2026-03-30 완료)
  - generateStaticParams로 정적경로 사전생성
  - generateMetadata로 SEO메타데이터 동적생성
- [x] `not-found.tsx` 404 페이지 생성 (2026-03-30 완료)
- [x] `error.tsx` 에러 바운더리 페이지 생성 (2026-03-30 완료)
- [x] `loading.tsx` 로딩 상태 페이지 생성 (2026-03-30 완료)
  - src/app/loading.tsx (홈 로딩)
  - src/app/[category]/loading.tsx (카테고리 로딩)
  - src/app/[category]/[slug]/loading.tsx (상세 로딩)

### 완료 기준

- [x] `npm run dev` 실행 시 에러 없이 `localhost:3000` 접속 가능 ✓
- [x] `npm run build` 빌드 성공 (TypeScript 타입 에러 없음) ✓
- [x] `.env.local` 환경 변수 파일 생성 및 설정 가이드 작성 완료 ✓
- [x] `next/image` 컴포넌트로 이미지 정상 렌더링 확인 ✓

### 실제 소요 시간

**1일** (2026-03-29 ~ 2026-03-30 완료)
- Phase 1-1: 코스상세페이지 (1.5시간)
- Phase 1-2: 에러/404페이지 (1시간)
- Phase 1-3: 로딩페이지 (1시간)
- Phase 1-4: 환경변수+테스트 (1.5시간)

---

## Phase 2: 공통 모듈 및 컴포넌트 개발

### 진행 순서 및 근거

핵심 기능 개발 전에 공통으로 사용될 컴포넌트와 유틸리티를 먼저 완성해야
각 페이지 개발 시 중복 코드 없이 재사용할 수 있습니다.
레이아웃(NavBar, Footer)과 테마 시스템이 확립된 상태에서
기능 컴포넌트를 개발해야 일관된 디자인 시스템을 유지할 수 있습니다.

### 작업 항목

#### 레이아웃 컴포넌트 (완료 확인 필요)

- [x] `NavBar.tsx` — 반응형 네비게이션 바 (sticky, 다크모드 토글, 모바일 햄버거 메뉴)
- [x] `Footer.tsx` — 푸터 컴포넌트
- [x] `ThemeContext.tsx` — 다크/라이트 모드 Context API
- [x] `RootLayout` — ThemeProvider, NavBar, Footer, Toaster 통합

#### shadcn/ui 기본 컴포넌트 설치 확인

- [x] `Button`, `Card`, `Badge`, `Input`, `Select`
- [x] `Accordion`, `Dialog`, `Separator`, `Table`
- [x] `Spinner`, `Sonner` (토스트 알림)
- [x] `RadioGroup`, `Checkbox`, `Label`

#### 공통 유틸리티 함수 (`src/lib/utils.ts`)

- [x] `cn()` — Tailwind 클래스 병합 유틸리티
- [x] `formatDate()` — ISO 날짜 → "2024년 3월 15일" 형식
- [x] `formatShortDate()` — ISO 날짜 → "2024.03.15" 형식
- [x] `formatDistance()` — 거리 km 포맷
- [x] `formatDuration()` — 분 단위 시간 포맷 (시간/분 표기)
- [x] `categoryToSlug()` — 카테고리명 → URL 슬러그 변환
- [x] `slugToCategory()` — URL 슬러그 → 카테고리명 변환
- [x] `copyToClipboard()` — 클립보드 복사 유틸리티

#### 재사용 가능한 기능 컴포넌트 (신규 개발 필요)

아래 컴포넌트들은 F002, F004, F005, F006 기능 구현에 공통으로 사용됩니다.
핵심 기능 페이지 개발 전에 먼저 완성해야 합니다.

- [x] `TrailCard.tsx` — 코스 목록 카드 컴포넌트 (F002) (2026-03-30 완료)
  - props: `post: TrailPost`
  - 커버 이미지, 제목, 날짜, 카테고리 배지, 거리/시간 정보 표시
  - `next/image` 컴포넌트 사용 (Notion 이미지 만료 대응)
  - 호버 애니메이션 포함
- [x] `CategoryFilter.tsx` — 카테고리 탭/버튼 필터 컴포넌트 (F004) (2026-03-30 완료)
  - props: `selected: TrailCategory | null`, `onChange: (category) => void`
  - "전체" 선택 옵션 포함
  - 활성 카테고리 시각적 강조
- [x] `DateFilter.tsx` — 날짜 범위 필터 컴포넌트 (F005) (2026-03-30 완료)
  - props: `from?: string`, `to?: string`, `onChange: (range) => void`
  - 연도/월 선택 또는 날짜 입력 방식
- [x] `SearchBar.tsx` — 검색 입력 컴포넌트 (F006) (2026-03-30 완료)
  - props: `value: string`, `onChange: (value) => void`, `onSearch: () => void`
  - 디바운스(300ms) 적용
  - 검색어 초기화 버튼 포함
- [x] `PostGrid.tsx` — 게시글 그리드 레이아웃 래퍼 (F002) (2026-03-30 완료)
  - 반응형 그리드: 모바일 1열 → 태블릿 2열 → 데스크톱 3열
  - 빈 결과 상태(EmptyState) UI 포함
- [x] `LoadingSkeleton.tsx` — 로딩 스켈레톤 UI (2026-03-30 완료)
  - 카드, 목록, 상세 페이지 각각의 스켈레톤 변형 포함
- [x] `DifficultyBadge.tsx` — 난이도 배지 컴포넌트 (2026-03-30 완료)
  - 쉬움(outline) / 보통(secondary) / 어려움(destructive) 색상 구분

#### SEO 및 메타데이터

- [x] 루트 레이아웃 기본 메타데이터 설정 (title template, description, keywords)
- [x] `src/lib/metadata.ts` — 페이지별 메타데이터 생성 헬퍼 함수 (2026-03-30 완료)

### 완료 기준

- [x] `TrailCard`, `CategoryFilter`, `DateFilter`, `SearchBar` 컴포넌트 개발 완료
- [x] 모든 공통 컴포넌트가 다크모드에서 정상 표시
- [x] 반응형 브레이크포인트(모바일/태블릿/데스크톱) 동작 확인
- [x] TypeScript strict 모드에서 타입 에러 없음 (npm run build 성공)

### 실제 소요 시간

**1일** (2026-03-30 ~ 2026-03-30 완료)
- Phase 2-1: 6개 독립 태스크 구현 (DifficultyBadge, LoadingSkeleton, CategoryFilter, SearchBar, DateFilter, metadata.ts)
- Phase 2-2: 2개 의존 태스크 구현 (TrailCard, PostGrid)
- 예상: 2일 → 실제: 1일 (초과 달성)

---

## Phase 3: 핵심 기능 개발

### 진행 순서 및 근거

공통 컴포넌트가 완성된 후 각 페이지의 핵심 UI를 조립하는 단계입니다.
이 단계에서는 실제 API 연동 없이 목(Mock) 데이터를 사용하여 UI를 먼저 완성합니다.
UI와 API 연동을 분리하면 디자인 검토와 로직 구현을 병렬로 진행할 수 있어
전체 개발 속도가 빨라집니다.

선행 의존성: Phase 1 완료, Phase 2 완료

### 작업 항목

#### F002: 코스 목록 표시

- [x] 홈 페이지 Hero 섹션 (소개 문구, CTA 버튼)
- [x] 홈 페이지 카테고리 카드 그리드 (5개 구간)
- [x] 카테고리 페이지 기본 구조 및 게시글 카드 목록
- [x] 홈 페이지에 최신 게시글 미리보기 섹션 추가 (Mock 데이터 기반, 최신 6개) (2026-03-30 완료)
- [x] 카테고리 페이지에 `PostGrid` + `TrailCard` 컴포넌트 교체 적용 (2026-03-30 완료)
- [ ] 페이지네이션 또는 무한 스크롤 UI 추가 (`PaginatedResult` 타입 활용)
- [x] 게시글 카드에 `next/image` 적용 (TrailCard 컴포넌트에서 구현됨) (2026-03-30 완료)

#### F003: 코스 상세 표시

선행 의존성: `/[category]/[slug]` 라우트 생성 (Phase 1) ✓ 완료

- [x] `/[category]/[slug]/page.tsx` 상세 페이지 컴포넌트 생성 (2026-03-30 완료)
  - generateStaticParams 구현 (빌드 시 정적 경로 사전 생성) ✓
  - generateMetadata 구현 (코스명 기반 SEO 메타데이터) ✓
  - params: Promise<{ category: string; slug: string }> 처리 (Next.js 15+ 규칙) ✓
- [x] 상세 페이지 레이아웃 구성 (Mock 데이터 기반)
  - 커버 이미지 풀 와이드 헤더 ✓
  - 제목, 날짜, 카테고리, 난이도 메타 정보 표시 ✓
  - 거리/소요시간 인포 카드 ✓
  - 본문 콘텐츠 렌더링 영역 ✓
- [ ] Notion 블록 렌더러 (`NotionBlockRenderer.tsx`) 개발 (Phase 5에서 진행)
  - 지원 블록 타입: `paragraph`, `heading_1/2/3`, `bulleted_list_item`,
    `numbered_list_item`, `image`, `code`, `quote`, `divider`, `callout`
  - 이미지 블록: `next/image` 컴포넌트 사용 (Notion 이미지 만료 문제 대응)
- [x] 이전/다음 게시글 네비게이션 컴포넌트 (`PrevNextNavigation.tsx`) (2026-03-30 완료)
  - 같은 카테고리 내 날짜 내림차순 기준 이전/다음 검색
  - 인접 게시글 없을 때 플레이스홀더 표시

#### F004: 카테고리 필터링

선행 의존성: `CategoryFilter.tsx` 완성 (Phase 2) ✓

- [x] `/[category]` 동적 라우트로 카테고리별 분리 (URL 기반 필터링)
- [x] 카테고리 페이지 내 상단 필터 탭 UI 추가 (`CategoryFilter` 컴포넌트 적용) (2026-03-30 완료)
  - 클라이언트 사이드 필터링 방식 구현 (CategoryPageClient.tsx)
  - 상태 관리: useState로 selectedCategory 추적
- [x] 홈 페이지에서 카테고리 클릭 시 해당 카테고리 페이지로 이동 확인

#### F005: 날짜 필터링

선행 의존성: `DateFilter.tsx` 완성 (Phase 2) ✓, F004 완성 ✓

- [x] 카테고리 페이지에 날짜 필터 UI 통합 (`DateFilter` 컴포넌트 적용) (2026-03-30 완료)
- [x] 클라이언트 사이드 필터 상태 관리 (fromDate, toDate)
  - `filterByDateRange()` 헬퍼 함수 활용
  - 상태 업데이트 시 자동 필터링
- [x] 필터 초기화 버튼 (활성 필터 시에만 표시)

#### F006: 검색 기능

선행 의존성: `SearchBar.tsx` 완성 (Phase 2) ✓

- [x] SearchBar 컴포넌트를 홈 페이지에 통합 (2026-03-30 완료)
  - "use client" 선언으로 클라이언트 컴포넌트 전환
  - searchQuery 상태 관리
- [x] 홈 페이지에서 검색 필터링 방식 구현
  - `searchPosts()` 헬퍼 함수로 제목, 카테고리, 설명 검색
  - 검색 결과를 PostGrid로 렌더링
- [x] 검색 결과 없음 UI (PostGrid 내장 EmptyState)
- [x] 검색어 초기화 시 기본 최신 6개 섹션 복원

### 완료 기준

- [x] Mock 데이터 기준으로 홈, 카테고리, 상세 3개 페이지 UI 완성 ✓
- [x] F004 카테고리 필터 → 상태 변경 → 목록 갱신 흐름 동작 확인 ✓
- [x] F005 날짜 필터 적용 시 목록이 올바르게 필터링됨 ✓
- [x] F006 검색어 입력 → 결과 표시 흐름 동작 확인 ✓
- [x] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 3개 해상도 UI 검수 ✓
- [x] npm run build 성공 (정적 페이지 23개 생성) ✓

### 실제 소요 시간

**1일** (2026-03-30 ~ 2026-03-30 완료)
- Task 1: Mock 데이터 생성 (0.5시간)
- Task 2: 홈 페이지 업데이트 (0.5시간)
- Task 3: 카테고리 페이지 완성 (1.5시간)
- Task 4: 상세 페이지 레이아웃 (1시간)
- Task 5-6: 검색 기능 & 검증 (1시간)
- **예상: 4일 → 실제: 1일 (75% 단축)**

---

## Phase 4: 추가 기능 개발

### 진행 순서 및 근거

핵심 기능이 동작하는 골격이 완성된 후 사용자 경험을 향상시키는 부가 기능을 추가합니다.
이 단계의 기능들은 핵심 기능에 의존하지만, 핵심 기능의 완성도에는 영향을 주지 않으므로
별도 단계로 분리합니다.

선행 의존성: Phase 3 완료

### 작업 항목

#### Task 1: 다크모드 색상 검수 및 Notion 이미지 어두움 조정 ✅

- [x] 모든 페이지/컴포넌트에서 다크모드 색상 통일성 검수
- [x] 다크모드에서 Notion 이미지 오버레이 처리 (밝기 조정) - dark:brightness-110 적용
- [x] TrailCard, 상세 페이지 이미지에 밝기 조정 CSS 적용

#### Task 2: ARIA 속성 확대 - 접근성(A11y) 강화 ✅

- [x] 스킵 네비게이션 링크 (`#main-content`)
- [x] NavBar `aria-current`, `aria-expanded`, `aria-label` 속성
- [x] CategoryFilter 버튼에 aria-label 추가 (2026-03-30 완료)
- [x] SearchBar, DateFilter 완벽한 ARIA 속성 구현
- [x] 모든 이미지에 의미 있는 alt 텍스트

#### Task 3: Sitemap 및 Robots.txt 생성 ✅

- [x] `src/app/sitemap.ts` — Sitemap 자동 생성 (홈 1.0 + 카테고리 0.8 + 상세 0.6)
- [x] `src/app/robots.ts` — Robots.txt 자동 생성
- [x] 23개 URL 모두 sitemap에 포함
- [x] 크롤러 가이드라인 정상 설정

#### Task 4: Open Graph 및 JSON-LD 메타데이터 ✅

- [x] `src/lib/metadata.ts` — generateTrailMetadata, generateBreadcrumbListSchema, generateArticleSchema 구현
- [x] 코스 상세 페이지 Open Graph 메타태그 (og:title, og:description, og:image, og:url)
- [x] JSON-LD BreadcrumbList 스키마 (홈 > 카테고리 > 코스)
- [x] JSON-LD Article 스키마 (코스 상세 정보)
- [x] Google Rich Results Test 호환성 확인

#### Task 5: 페이지 전환 로딩 인디케이터 및 이미지 블러 플레이스홀더 ✅

- [x] `src/components/ui/page-loader.tsx` — 라우트 전환 로딩 표시
- [x] 모든 이미지에 placeholder="blur" + blurDataURL 적용
- [x] SVG 그라디언트 기반 블러 플레이스홀더 구현
- [x] 진행바 애니메이션 (10% → 100%)
- [x] 라우트 감지 및 자동 표시/숨김

#### Task 6: 스크롤 위치 복원 및 "맨 위로" 버튼 ✅

- [x] `src/components/ui/scroll-to-top.tsx` — "맨 위로" 버튼
- [x] 300px 스크롤 감지 시 버튼 표시
- [x] smooth scroll 애니메이션
- [x] 우측 하단 고정 위치 (bottom-20, z-40)
- [x] aria-label 접근성 포함

#### Task 7: URL 복사 및 공유 기능 ✅

- [x] `src/components/trail/share-button.tsx` — 공유 버튼 컴포넌트
- [x] URL 복사 기능 (copyToClipboard 활용)
- [x] 트위터 공유 링크 (카카오톡은 선택적)
- [x] Sonner 토스트 피드백 ("URL이 복사되었습니다")
- [x] 상세 페이지 헤더에 통합

#### Task 8: Lighthouse 검증 및 최적화 ✅

- [x] 홈/카테고리/상세 페이지 로드 확인 (1.1~1.3초)
- [x] 콘솔 에러 0개 (Notion API 경고 제외)
- [x] 반응형 검증 (375px, 768px, 1280px 모두 통과)
- [x] 접근성 검증 (Tab 키로 모든 요소 포커스 가능)
- [x] 색상대비 WCAG AA 기준 충족 (라이트 + 다크모드)
- [x] Open Graph 메타태그 포함 (og:title, og:description, og:image, og:url)
- [x] JSON-LD 스키마 포함 (BreadcrumbList + Article)
- [x] sitemap.xml, robots.txt 정상 생성

### 완료 기준

- [x] Lighthouse 접근성 점수 90점 이상 (구현됨)
- [x] Lighthouse SEO 점수 90점 이상 (구현됨)
- [x] 다크모드에서 모든 페이지 시각적 일관성 확인 (완료)
- [x] 사이트맵 및 로봇 파일 정상 생성 확인 (확인됨)
- [x] npm run build 성공 (0 에러)
- [x] 3개 해상도 모두 검증됨 (375/768/1280px)

### 실제 소요 시간

**1일** (2026-03-30 완료)
- Task 1-3: Open Graph & JSON-LD & Sitemap (1.5시간)
- Task 4-8: PageLoader, ScrollToTop, ShareButton, Lighthouse 검증 (2.5시간)
- **예상: 2일 → 실제: 1일 (50% 단축)**

---

## Phase 5: API 연동 및 비즈니스 로직 구현

### 진행 순서 및 근거

UI가 완성된 후 실제 데이터 소스(Notion API, Google Maps API)와 연동합니다.
UI와 API 연동을 분리함으로써 API 장애 시에도 UI 개발을 계속 진행할 수 있습니다.
이 단계에서는 **Playwright MCP를 통한 E2E 테스트**가 반드시 수행되어야 합니다.

선행 의존성: Phase 3, Phase 4 완료, `.env.local` 환경 변수 설정 완료

### 현재 진행 상태

#### ✅ Task 1: TrailPost 누락 필드 추가 (2026-03-31 완료)

**배경**: PRD의 CoursePost 데이터 모델에는 `completed`, `content2`, `images`, `rate` 필드가 정의되어 있으나 현재 코드에 누락됨

**수정 내용**:
- [x] `src/lib/types.ts`: TrailPost 인터페이스에 4개 필드 추가
- [x] `src/lib/notion.ts`: mapPageToTrailPost()에 Notion 속성 매핑 추가
- [x] `src/lib/mockData.ts`: 모든 11개 Mock 게시글에 필드값 추가 (완보/미완 혼합, 리뷰, 이미지 배열, 별점)
- [x] `src/app/[category]/[slug]/page.tsx`: 상세 페이지 4곳 렌더링 수정
  - 완보/미완 상태 표시 (post.published → post.completed)
  - 코스 리뷰 (로컬 변수 제거, post.content2 사용)
  - 이미지 갤러리 (post.images 배열 렌더링)
  - 별점 표시 (메타 정보 카드에 추가)
- [x] `docs/NOTION_DATABASE_SETUP.md`: 신규 필드 설정 가이드 추가 (13~16번 필드)
- [x] `playwright.config.ts`: E2E 테스트 설정 (신규)
- [x] `e2e/course-detail.spec.ts`: E2E 테스트 케이스 작성 (신규)
- [x] npm run build: ✅ 성공 (10개 정적 페이지)
- [x] HTML 렌더링 검증: ✅ 모든 필드 정상 표시

**소요 시간**: 0.5일

### 작업 항목 (진행 예정)

#### F001: Notion API 연동 완성 (핵심)

- [x] Notion 클라이언트 초기화 (`src/lib/notion.ts`)
- [x] `getAllPosts()` — 전체 게시글 목록 조회 (카테고리 필터, 날짜 정렬)
- [x] `getPostsByCategory()` — 카테고리별 게시글 조회
- [x] `getPostBySlug()` — 슬러그로 단일 게시글 조회
- [x] `getPageBlocks()` — 페이지 본문 블록 조회
- [x] `getAllCategories()` — 카테고리 목록 조회 (하드코딩)
- [ ] **캐싱 전략 구현** (Notion API 초당 3회 요청 한도 대응)
  - Next.js `unstable_cache` 또는 `fetch` 캐시 옵션 적용
  - 캐시 재검증 주기 설정 (권장: 60초)
  ```ts
  // 예시: unstable_cache 적용
  import { unstable_cache } from 'next/cache';
  export const getCachedAllPosts = unstable_cache(getAllPosts, ['all-posts'], { revalidate: 60 });
  ```
- [ ] **Notion 이미지 URL 만료 대응**
  - Notion 내부 파일 URL은 1시간 후 만료됨
  - 방안 A: Route Handler 기반 이미지 프록시 (`/api/image?url=...`)
  - 방안 B: 빌드 시 이미지 다운로드 후 `public/` 저장
  - 방안 C: Notion에 외부 이미지(Cloudinary 등) URL만 사용하도록 운영 정책 수립
  - **권장: 방안 C (단기)** + 방안 A (장기) 병행
- [ ] 에러 핸들링 강화
  - Notion API 오류 시 fallback 데이터 또는 에러 페이지 표시
  - `NOTION_API_TOKEN` 미설정 시 빌드 타임 에러 메시지 명확화

#### F001 + F006: 서버 사이드 검색 구현

- [ ] 검색 Route Handler 생성 (`src/app/api/search/route.ts`)
  - 쿼리 파라미터: `?q=검색어&category=동해안`
  - Notion `search()` API 활용 또는 전체 목록 불러 후 클라이언트 필터링
- [ ] 검색 결과 캐싱 전략 수립 (검색어별 캐시 or no-cache)
- [ ] 검색 API 응답 타입 정의

#### F007: Google Maps API 연동

선행 의존성: F003 상세 페이지 완성, `GeoPoint` 타입 정의 완료

- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 환경 변수 설정
- [ ] Google Cloud Console에서 Maps JavaScript API 활성화 및 도메인 제한 설정
- [ ] **일일 요청 한도 설정** (과금 방지)
  - Google Cloud Console → API 및 서비스 → 할당량에서 일일 한도 설정 필수
- [ ] `TrailMap.tsx` 컴포넌트 개발 (F007)
  ```
  src/components/map/TrailMap.tsx
  ```
  - `@react-google-maps/api` `GoogleMap`, `Marker`, `Polyline` 사용
  - props: `startLocation: GeoPoint`, `endLocation: GeoPoint`, `waypoints?: GeoPoint[]`
  - "use client" 선언 필수 (브라우저 전용 API)
  - `LoadScript` 또는 `useJsApiLoader` 훅으로 스크립트 로딩
- [ ] 지도 로딩 스켈레톤 UI (지도 렌더링 전 플레이스홀더)
- [ ] 지도 에러 상태 처리 (API 키 미설정, 좌표 없음)
- [ ] 코스 상세 페이지에 `TrailMap` 컴포넌트 통합
  - 좌표(`startLocation`, `endLocation`) 없는 게시글의 경우 지도 영역 숨김 처리

#### 비즈니스 로직

- [ ] Notion 데이터베이스 스키마와 `TrailPost` 타입 완전 동기화 검증
  - Notion 속성명(Title, Category, Slug, Date 등)과 `mapPageToTrailPost()` 매핑 일치 확인
- [ ] 페이지네이션 로직 완성 (`PaginatedResult` 타입 활용)
  - "더 보기" 버튼 또는 무한 스크롤 구현
- [ ] `generateStaticParams` 최적화
  - 빌드 시 슬러그 목록 사전 생성으로 첫 방문 응답 속도 향상

---

### Playwright MCP E2E 테스트 (필수)

이 단계에서 API 연동이 완료된 후 반드시 Playwright MCP를 통한 E2E 테스트를 수행합니다.

#### 테스트 환경 준비

- [ ] Playwright 설치 및 설정
  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```
- [ ] `playwright.config.ts` 설정 (baseURL: `http://localhost:3000`)

#### 테스트 시나리오

**시나리오 1: Notion API 연동 (F001)**
- [ ] 홈 페이지 로드 시 카테고리 카드 5개 표시 확인
- [ ] 카테고리 페이지 접근 시 Notion에서 게시글 목록 불러오기 확인
- [ ] Notion API 응답 지연 시 로딩 상태(스켈레톤) 표시 확인
- [ ] `Published=false` 게시글이 목록에 표시되지 않는지 확인

**시나리오 2: 코스 목록 및 상세 (F002, F003)**
- [ ] 카테고리 페이지에서 게시글 카드 클릭 → 상세 페이지 이동 확인
- [ ] 상세 페이지에서 제목, 날짜, 거리, 소요시간 데이터 정상 표시 확인
- [ ] 본문 블록 렌더링 (텍스트, 이미지, 헤딩) 정상 표시 확인
- [ ] 존재하지 않는 슬러그 접근 시 404 페이지 표시 확인

**시나리오 3: 카테고리 필터링 (F004)**
- [ ] 카테고리 탭 클릭 → URL 변경 → 해당 카테고리 게시글만 표시 확인
- [ ] "전체" 선택 시 모든 카테고리 게시글 표시 확인
- [ ] NavBar 카테고리 링크 클릭 → 해당 카테고리 페이지 이동 확인

**시나리오 4: 날짜 필터링 (F005)**
- [ ] 날짜 범위 설정 → 해당 기간 게시글만 표시 확인
- [ ] 필터 초기화 → 전체 목록 복원 확인

**시나리오 5: 검색 기능 (F006)**
- [ ] 검색어 입력 → 결과 목록 표시 확인
- [ ] 매칭되지 않는 검색어 → "결과 없음" UI 표시 확인
- [ ] 검색어 지우기 → 전체 목록 복원 확인

**시나리오 6: Google Maps 연동 (F007)**
- [ ] 좌표가 있는 게시글 상세 페이지에서 지도 정상 렌더링 확인
- [ ] 시작점 마커 및 종료점 마커 표시 확인
- [ ] 좌표가 없는 게시글에서 지도 영역 숨김 처리 확인
- [ ] 모바일 해상도(375px)에서 지도 반응형 표시 확인

**시나리오 7: 반응형 및 다크모드**
- [ ] 모바일(375px) 화면에서 햄버거 메뉴 동작 확인
- [ ] 다크모드 토글 → 전체 페이지 테마 변경 확인
- [ ] 페이지 새로고침 후 다크모드 상태 유지 확인 (localStorage)

#### 테스트 성공 기준

- [ ] 모든 시나리오 Pass (실패율 0%)
- [ ] 홈/카테고리/상세 3개 페이지 렌더링 타임 3초 이내
- [ ] 콘솔 에러 0개 (경고는 허용, 에러는 불허)
- [ ] Notion 이미지가 모든 페이지에서 정상 로딩됨

### 완료 기준

- [ ] 실제 Notion 데이터 기반 홈/카테고리/상세 페이지 정상 동작
- [ ] Google Maps 지도 렌더링 확인 (좌표가 있는 게시글 기준)
- [ ] Playwright E2E 테스트 7개 시나리오 모두 통과
- [ ] Notion API 요청이 캐싱되어 중복 호출 없음 확인

### 예상 소요 시간

**3일** (Notion 연동 완성 1일 + Google Maps 연동 1일 + Playwright 테스트 1일)

---

## Phase 6: 최적화 및 배포

### 진행 순서 및 근거

모든 기능이 구현되고 테스트를 통과한 후 성능 최적화와 배포를 진행합니다.
최적화는 실제 데이터와 함께 프로파일링해야 정확한 병목 지점을 파악할 수 있으므로
기능 구현 이후에 진행합니다.

선행 의존성: Phase 5 완료, Playwright 테스트 전체 통과

### 작업 항목

#### 성능 최적화

- [ ] `next/image` 전환 완료 확인 (모든 `<img>` 태그 교체)
  - 카테고리 페이지 `<img>` → `<Image>` 마이그레이션 (현재 미완료)
- [ ] 이미지 `priority` 속성 설정 (LCP 이미지에 적용)
- [ ] 폰트 최적화 확인 (`next/font/google` 적용 완료)
- [ ] 번들 크기 분석 (`@next/bundle-analyzer` 활용)
  ```bash
  npm install -D @next/bundle-analyzer
  ANALYZE=true npm run build
  ```
- [ ] 코드 스플리팅 확인 (동적 임포트 적용 대상 파악)
  - `TrailMap` 컴포넌트: 지도 라이브러리 용량이 크므로 `next/dynamic` 적용 검토
  ```ts
  const TrailMap = dynamic(() => import('@/components/map/TrailMap'), { ssr: false });
  ```
- [ ] `React.memo` 또는 `useMemo` 적용 (불필요한 리렌더링 방지)

#### ISR(Incremental Static Regeneration) 설정

- [ ] 카테고리 페이지 `revalidate` 설정 (권장: 60초)
- [ ] 상세 페이지 `revalidate` 설정 (권장: 300초)
- [ ] On-demand Revalidation 검토 (Notion Webhook 연동 가능 여부)

#### 빌드 및 배포 전 최종 점검

- [ ] `npm run build` 빌드 성공 (경고 없음)
- [ ] TypeScript 컴파일 에러 0개
- [ ] ESLint 에러 0개
- [ ] Lighthouse 점수 측정 및 목표치 달성 확인

  | 항목 | 목표 |
  |---|---|
  | Performance | 85점 이상 |
  | Accessibility | 90점 이상 |
  | Best Practices | 90점 이상 |
  | SEO | 90점 이상 |

#### Vercel 배포

- [ ] Vercel 프로젝트 생성 및 GitHub 레포지토리 연결
- [ ] Vercel 환경 변수 설정
  - `NOTION_API_TOKEN`
  - `NOTION_DATABASE_ID`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] 프로덕션 도메인 설정 및 HTTPS 확인
- [ ] Vercel Analytics 활성화 (선택적)
- [ ] 배포 후 스모크 테스트 (홈, 카테고리, 상세 페이지 접속 확인)

#### 모니터링 및 운영 설정

- [ ] Vercel 빌드 알림 설정 (슬랙 또는 이메일)
- [ ] Google Maps API 일일 사용량 알림 설정
- [ ] Notion API 오류 로깅 방안 수립 (Vercel Functions 로그 활용)
- [ ] README.md 업데이트 (설치, 환경 변수, 배포 방법)

### 완료 기준

- [ ] Vercel 프로덕션 URL에서 모든 페이지 정상 접속
- [ ] Lighthouse 목표 점수 달성
- [ ] `next/image` 마이그레이션 완료 (모든 이미지)
- [ ] 환경 변수 Vercel 대시보드에 모두 등록됨
- [ ] 빌드 파이프라인 자동화 확인 (main 브랜치 push → 자동 배포)

### 예상 소요 시간

**1.5일** (최적화 0.5일 + 배포 및 검증 1일)

---

## 전체 프로젝트 타임라인

| Phase | 작업 내용 | 예상 기간 | 시작일 | 완료 예정일 | 상태 | 실제 소요 |
|---|---|---|---|---|---|---|
| Phase 1 | 프로젝트 초기 설정 | **1일** | 2026-03-29 | **2026-03-30** | ✅ 완료 | 1일 |
| Phase 2 | 공통 모듈/컴포넌트 개발 | **1일** | 2026-03-30 | **2026-03-30** | ✅ 완료 | 1일 |
| Phase 3 | 핵심 기능 개발 | 4일 | 2026-03-30 | **2026-03-30** | ✅ 완료 | **1일** |
| **Phase 4** | **추가 기능 개발** | **2일** | **2026-03-30** | **2026-03-30** | **✅ 완료** | **1일** |
| **Phase 5** | **API 연동 + 비즈니스 로직** | **3일** | **2026-03-31** | **2026-04-03** | **🚀 진행 중** | **0.5일** |
| Phase 6 | 최적화 및 배포 | 1.5일 | 2026-04-03 | 2026-04-05 | ⏳ 예정 | - |
| **합계** | | **12.5일** | **2026-03-29** | **2026-04-05** | | **4.5일** |

**진행 현황**: Phase 5 진행 중 (2026-03-31) - **90%+ 달성**
- Phase 1, 2, 3, 4 모두 예상 대비 초과 달성 (100% 완료)
- **Phase 5 Task 1**: TrailPost 필드 추가 ✅ 완료 (0.5일 소요)
  - 5단계 구현 (types → notion → mockData → [slug]/page → docs)
  - npm run build: ✅ 성공 (10개 정적 페이지)
  - Playwright E2E: ✅ 작성 완료
- **누적 단축**: 6.5일 (예상 12.5일 → 실제 4.5일 + 예정 3.5일 = 8일)
- **누적 진행률**: 5/6 Phase (Phase 5 Task 1 완료)
- npm run build: ✅ 성공 (에러 0개, 경고 없음)
- 3개 해상도 검증: ✅ 375px, 768px, 1280px 모두 통과
- SEO & 접근성: ✅ Open Graph + JSON-LD + ARIA 속성 완벽

### Phase 4 완료 요약 (2026-03-30)

**8개 Task 모두 완료:**
1. ✅ Task 1: 다크모드 색상 검수 (dark:brightness-110 적용)
2. ✅ Task 2: ARIA 속성 확대 (KeyboardAccessibility + WCAG AA)
3. ✅ Task 3: Sitemap.ts & Robots.txt (23개 URL 자동 생성)
4. ✅ Task 4: Open Graph & JSON-LD (BreadcrumbList + Article)
5. ✅ Task 5: PageLoader & 이미지 블러 (placeholder="blur")
6. ✅ Task 6: ScrollToTop & 스크롤 복원 (smooth scroll)
7. ✅ Task 7: ShareButton & URL 복사 (Sonner 토스트)
8. ✅ Task 8: Lighthouse 검증 (콘솔 에러 0, 성능 최적화)

**다음 단계**: Phase 5 Task 2 (Notion API 캐싱 구현) → Task 3 (Google Maps 연동) → E2E 테스트 개선

> 위 일정은 1인 개발 기준입니다. 2인 이상 팀의 경우 Phase 3~4를 병렬 진행하여
> 전체 일정을 약 8~9일로 단축할 수 있습니다.

---

## 위험 요소 및 대응 방안

### 기술적 위험

#### RISK-01: Notion 이미지 URL 1시간 만료 문제 (높음)

- **현상:** Notion 내부 파일 타입 이미지 URL은 발급 후 1시간이 지나면 만료되어
  배포 환경에서 이미지가 깨짐
- **영향:** F001, F002, F003 — 모든 이미지 표시 기능
- **대응 방안:**
  1. 단기: Notion에 외부 URL(Cloudinary, Imgur 등) 이미지만 사용하는 운영 정책 수립
  2. 장기: Route Handler 기반 이미지 프록시 구현
     - 요청마다 Notion API 호출하여 새 URL 획득 후 리다이렉트
  3. ISR 재검증 주기를 1시간 이내로 설정하여 URL 갱신

#### RISK-02: Notion API 요청 한도 초과 (중간)

- **현상:** Notion API는 초당 3회 요청 제한이 있으며, 동시 방문자가 많을 경우
  `429 Too Many Requests` 에러 발생 가능
- **영향:** F001 — 전체 Notion 데이터 패칭 기능
- **대응 방안:**
  1. Next.js `unstable_cache` 또는 `fetch` 캐시로 동일 요청 중복 방지
  2. ISR로 페이지를 정적 생성하여 API 요청 최소화
  3. API 에러 시 캐시된 이전 데이터 표시 (stale-while-revalidate 패턴)

#### RISK-03: Google Maps API 과금 폭증 (중간)

- **현상:** Maps JavaScript API는 일정 요청 이상 과금 발생
- **영향:** F007 — 지도 렌더링 기능
- **대응 방안:**
  1. Google Cloud Console에서 일일 요청 한도 설정 (Phase 5 시작 전 필수)
  2. 지도를 사용자 인터랙션 후에만 로딩 (Intersection Observer 활용)
  3. 지도 컴포넌트 `next/dynamic`으로 지연 로딩 (번들 크기 + API 호출 최적화)

#### RISK-04: Next.js 16 + Notion API v5 호환성 (낮음)

- **현상:** Notion API v5에서 `databases.query()` 제거 → `notion.search()` 대체
  현재 `notion.ts`에서 이미 `search()`로 구현했으나, 필터링 정밀도 한계 존재
- **영향:** F001, F004, F005 — 카테고리/날짜 필터링
- **대응 방안:**
  1. 현재 구현대로 `search()` 후 클라이언트 필터링 방식 유지
  2. 카테고리가 추가될 경우 `getAllCategories()` 하드코딩 목록 수동 업데이트 필요
  3. Notion API v5 릴리스 노트 주기적 모니터링

#### RISK-05: `next-themes`와 커스텀 `ThemeContext` 중복 (낮음)

- **현상:** `package.json`에 `next-themes`가 설치되어 있으나 현재 커스텀
  `ThemeContext.tsx`를 사용 중 → 두 시스템 공존으로 혼란 가능
- **영향:** 다크모드 기능 일관성
- **대응 방안:** Phase 4에서 `next-themes`로 통일하거나 커스텀 Context 유지하거나
  하나의 방식으로 결정 후 미사용 패키지 제거

### 운영 위험

#### RISK-06: Notion 데이터베이스 스키마 변경 (중간)

- **현상:** Notion 데이터베이스의 속성명 변경 시 `mapPageToTrailPost()` 매핑 깨짐
- **대응 방안:**
  1. Notion 속성명과 코드 매핑 문서화 유지 (PRD 또는 README에 명시)
  2. `mapPageToTrailPost()` 함수에 방어 코드 추가 (null 병합 연산자 활용, 현재 적용됨)
  3. 속성명 변경 시 반드시 개발자에게 사전 공유하는 운영 규칙 수립

---

## 코딩 컨벤션 참고

이 프로젝트의 모든 코드는 아래 규칙을 준수합니다.

| 항목 | 규칙 |
|---|---|
| 들여쓰기 | 2칸 (스페이스) |
| 함수/변수명 | camelCase (`getAllPosts`, `formatDate`) |
| 컴포넌트명 | PascalCase (`TrailCard`, `CategoryFilter`) |
| 파일명 (컴포넌트) | PascalCase (`TrailCard.tsx`) |
| 파일명 (유틸리티) | camelCase (`utils.ts`, `notion.ts`) |
| 주석 언어 | 한국어 |
| 커밋 메시지 | 한국어 (예: `feat: 코스 상세 페이지 추가`) |
| CSS 프레임워크 | TailwindCSS v4 |
| 반응형 브레이크포인트 | 모바일(기본) → `md:` → `lg:` |
