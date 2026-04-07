# 코리아 둘레길 기록 블로그 고도화 로드맵

> 작성일: 2026-04-06
> 기준 문서: PRD v1.0 + 고도화 요구사항 (관리자 기능)
> 이전 로드맵: docs/roadmaps/ROADMAP_v1.md (MVP Phase 1~6 완료)

---

## 프로젝트 개요

Notion을 CMS로 활용하는 코리아 둘레길 기록 블로그의 **MVP 개발이 완료**된 상태에서,
관리자 기능을 추가하여 운영 효율성을 높이는 고도화 단계입니다.

### 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript 5 |
| UI 라이브러리 | React 19 |
| 스타일 | TailwindCSS v4, shadcn/ui |
| CMS | Notion API v5 (@notionhq/client) |
| 지도 | Google Maps API (@react-google-maps/api) |
| 배포 | Vercel |

---

## MVP 완료 현황 (2026-04-06 기준)

아래 MVP Phase 1~6은 모두 완료되어 프로덕션 배포까지 이루어진 상태입니다.
이 문서는 이후 고도화 단계(Phase 7~9)를 다룹니다.

| Phase | 작업 내용 | 상태 |
|---|---|---|
| Phase 1 | 프로젝트 초기 설정 (골격 구축) | ✅ 완료 |
| Phase 2 | 공통 모듈/컴포넌트 개발 | ✅ 완료 |
| Phase 3 | 핵심 기능 개발 (홈/카테고리/상세 페이지) | ✅ 완료 |
| Phase 4 | 추가 기능 개발 (다크모드, SEO, 접근성 등) | ✅ 완료 |
| Phase 5 | API 연동 및 비즈니스 로직 구현 | ✅ 완료 |
| Phase 6 | 최적화 및 배포 (Vercel 프로덕션) | ✅ 완료 |

### 현재 구현된 기능 (MVP 완료)

- **공개 페이지**: 홈(`/`), 카테고리(`/[category]`), 코스 상세(`/[category]/[slug]`)
- **Notion 연동**: `getAllPosts()`, `getPostsByCategory()`, `getPostBySlug()`, `getPageBlocks()` + `unstable_cache` 캐싱
- **Google Maps**: `TrailMap.tsx` 컴포넌트 (시작/종료 마커, 반응형)
- **공통 컴포넌트**: `TrailCard`, `CategoryFilter`, `DateFilter`, `SearchBar`, `PostGrid`, `LoadingSkeleton`, `DifficultyBadge`
- **부가 기능**: 다크모드, ARIA 접근성, Sitemap, Open Graph, JSON-LD, PageLoader, ScrollToTop, ShareButton
- **배포**: Vercel (https://my-korea-trail.vercel.app/) + ISR 캐싱 설정

---

## 고도화 기능 개요

### 추가할 기능 목록

| ID | 기능명 | 설명 | 우선순위 |
|---|---|---|---|
| **A001** | 관리자 레이아웃 구축 | `/admin` 경로 전용 레이아웃 및 대시보드 | 핵심 |
| **A002** | 코스 전체 목록 테이블 | 관리자 대시보드에서 전체 코스를 테이블로 표시 | 핵심 |
| **A003** | 완보/미완 상태 관리 | 각 코스의 Completed 필드를 관리자가 직접 수정 | 핵심 |
| **A004** | 게시 상태 관리 | 각 코스의 Published 필드를 체크박스로 관리 | 핵심 |

### 고도화 개발 순서 및 근거

```
Phase 7: 관리자 초기 설정(골격 구축)
  → 라우트, 레이아웃, 타입 정의 선행
Phase 8: 관리자 핵심 기능 개발
  → 코스 목록 테이블, 상태 표시 UI
Phase 9: API 연동 및 비즈니스 로직 구현 (Playwright 테스트 포함)
  → Notion API PATCH 연동, 실제 상태 업데이트, E2E 검증
```

---

## Phase 7: 관리자 초기 설정 (골격 구축)

### 진행 순서 및 근거

관리자 기능은 공개 사용자 기능과 완전히 분리된 레이아웃과 라우트 체계를 가집니다.
라우트 구조와 레이아웃 컴포넌트, 타입 정의를 먼저 확정해야
이후 UI 컴포넌트 개발과 API 연동 작업이 일관된 구조 아래 진행될 수 있습니다.
또한 Notion API의 `pages.update()` 엔드포인트를 사용하므로,
해당 권한 범위와 환경 변수 설정을 사전에 확인해야 합니다.

선행 의존성: MVP Phase 1~6 완료 ✅

### 작업 항목

#### 관리자 라우트 구조 생성

- [ ] `src/app/admin/` 폴더 생성
- [ ] `src/app/admin/layout.tsx` — 관리자 전용 레이아웃 (공개 NavBar/Footer와 분리)
  - 관리자 전용 사이드바 또는 상단 바 포함
  - 공개 레이아웃(`src/app/layout.tsx`)을 상속하지 않는 독립 레이아웃
- [ ] `src/app/admin/page.tsx` — 관리자 대시보드 진입 페이지 (코스 목록 테이블)
- [ ] `src/app/admin/loading.tsx` — 관리자 페이지 로딩 상태
- [ ] `src/app/admin/error.tsx` — 관리자 페이지 에러 바운더리

#### 관리자 전용 타입 정의 (`src/lib/types.ts` 확장)

- [ ] `AdminCourseRow` 인터페이스 정의
  ```ts
  // 관리자 테이블 행에서 사용하는 간소화된 타입
  interface AdminCourseRow {
    id: string;           // Notion Page ID (PATCH 요청에 사용)
    title: string;        // 코스명
    category: TrailCategory;
    date: string;
    distance: number;
    completed: boolean;   // 완보 여부 (A003)
    published: boolean;   // 게시 여부 (A004)
  }
  ```
- [ ] `UpdateCourseStatusPayload` 타입 정의 (API Route에서 사용)
  ```ts
  interface UpdateCourseStatusPayload {
    pageId: string;
    field: 'completed' | 'published';
    value: boolean;
  }
  ```

#### Notion API 확장 함수 (`src/lib/notion.ts`)

- [ ] `getAllPostsForAdmin()` 함수 추가
  - Published 필터 없이 전체 코스 조회 (관리자는 미게시 포함 전체 조회)
  - 반환 타입: `AdminCourseRow[]`
  - `unstable_cache` 미적용 (관리자는 항상 최신 데이터 필요)
- [ ] `updateCourseStatus()` 함수 추가
  - Notion `pages.update()` API로 `completed` 또는 `published` 필드 업데이트
  - 파라미터: `pageId: string`, `field: 'completed' | 'published'`, `value: boolean`

#### 환경 변수 및 권한 확인

- [ ] `NOTION_API_TOKEN`이 데이터베이스 페이지 수정 권한을 가졌는지 확인
  - Notion Developer 페이지 → Integration 권한 설정
  - 필요 권한: **Read content** + **Update content** (현재 Read만 있을 경우 추가 필요)
- [ ] Notion Integration 권한 업데이트 후 `.env.local` 재확인
- [ ] `.env.local`에 관리자 인증용 환경변수 추가
  ```env
  # 관리자 로그인 패스워드 (강력한 문자열 권장)
  ADMIN_PASSWORD=your-secure-password-here
  ```

#### 로그인 페이지 및 인증 구현

관리자 기능 접근 전에 간단한 패스워드 인증을 적용합니다.

- [ ] `src/app/auth/` 폴더 생성
- [ ] `src/app/auth/login/page.tsx` — 로그인 페이지
  - shadcn/ui `Card`, `Input`, `Button` 컴포넌트 사용
  - 패스워드 입력 필드 (type="password")
  - "로그인" 버튼 클릭 시 `/api/auth/login` POST 요청
  - 로그인 실패 시 에러 메시지 표시
  - 성공 시 쿠키 저장 후 `/admin`으로 리다이렉트
  - 반응형 + 다크모드 지원

- [ ] `src/app/api/auth/login/route.ts` — 로그인 API Route
  - POST 요청 처리
  - 요청 본문: `{ password: string }`
  - `process.env.ADMIN_PASSWORD`와 비교 검증
  - 일치 시:
    - 쿠키 설정: `"admin-auth"` (값: 암호화된 토큰 또는 간단한 마크)
    - 응답: `{ success: true, redirectUrl: '/admin' }`
  - 불일치 시:
    - 응답: `{ success: false, error: "패스워드가 일치하지 않습니다." }` + HTTP 401
  - 타임아웃 처리: 3회 실패 시 5분 대기 (선택적)

- [ ] `src/middleware.ts` — 관리자 페이지 접근 제어
  - `/admin` 경로 요청 시 쿠키에서 `admin-auth` 확인
  - 쿠키 없거나 유효하지 않으면 `/auth/login`으로 리다이렉트
  - 로그인 후 원래 요청 경로로 리다이렉트 지원 (선택적)

- [ ] 로그아웃 기능
  - `src/app/api/auth/logout/route.ts` — 로그아웃 API Route
    - `admin-auth` 쿠키 삭제
    - 응답: `{ success: true, redirectUrl: '/' }`
  - 관리자 레이아웃(`AdminLayout.tsx`)에 "로그아웃" 버튼 추가
    - 버튼 클릭 시 `/api/auth/logout` POST 요청
    - 성공 시 홈(`/`)으로 리다이렉트

#### 관리자 API Route 생성

- [ ] `src/app/api/admin/courses/route.ts` — 전체 코스 목록 조회 (GET)
- [ ] `src/app/api/admin/courses/[pageId]/route.ts` — 코스 상태 업데이트 (PATCH)
  - 요청 본문: `{ field: 'completed' | 'published', value: boolean }`
  - Notion API 호출 후 성공/실패 응답 반환
  - 에러 핸들링: Notion API 실패 시 500 응답 + 에러 메시지

### 완료 기준

- [ ] `http://localhost:3000/auth/login` 접속 시 로그인 페이지 표시
- [ ] 로그인 페이지에서 패스워드 입력 후 "로그인" 버튼 클릭 가능
- [ ] 정확한 패스워드 입력 시 `/admin`으로 리다이렉트
- [ ] 잘못된 패스워드 입력 시 에러 메시지 "패스워드가 일치하지 않습니다." 표시
- [ ] 로그인 후 직접 `/admin` 접속 가능 (쿠키 유효성 확인)
- [ ] 쿠키 없이 `/admin` 접속 시 `/auth/login`으로 리다이렉트 (Middleware 동작)
- [ ] 관리자 레이아웃에 "로그아웃" 버튼 표시
- [ ] "로그아웃" 버튼 클릭 후 홈(`/`)으로 리다이렉트 + 쿠키 삭제
- [ ] `http://localhost:3000/admin` 접속 시 관리자 레이아웃이 공개 레이아웃과 분리되어 표시됨 (로그인 후)
- [ ] `AdminCourseRow`, `UpdateCourseStatusPayload` 타입 정의 완료 (TypeScript 에러 없음)
- [ ] `getAllPostsForAdmin()` 함수가 Published 상태 무관하게 전체 코스 반환
- [ ] `updateCourseStatus()` 함수가 Notion `pages.update()` 호출 성공 (Mock 없이 실제 호출)
- [ ] API Route `GET /api/admin/courses` 정상 응답 (200)
- [ ] API Route `PATCH /api/admin/courses/[pageId]` 정상 응답 (200)
- [ ] 로그인 페이지 반응형(375/768/1280px) 및 다크모드 정상 표시
- [ ] `npm run build` 성공 (에러 0개)

### 예상 소요 시간

**1.5일**
- 로그인 페이지 및 인증 구현 (3시간)
  - 로그인 페이지 UI (`LoginPage.tsx`) (1시간)
  - API Route 및 쿠키 처리 (`/api/auth/login`, `/api/auth/logout`) (1시간)
  - Middleware 구현 (`src/middleware.ts`) (1시간)
- 관리자 라우트 및 레이아웃 생성 (2시간)
- 타입 정의 확장 (0.5시간)
- Notion API 함수 추가 (1.5시간)
- API Route 생성 및 테스트 (2시간)

---

## Phase 8: 관리자 핵심 기능 개발

### 진행 순서 및 근거

Phase 7에서 골격(라우트, 타입, API Route)이 완성된 후,
실제 관리자가 사용할 UI 컴포넌트를 개발합니다.
이 단계에서는 실제 Notion API와 연동하지 않고 Mock 데이터를 사용하여 UI를 먼저 완성합니다.
UI와 API 연동을 분리하면 컴포넌트 설계에 집중할 수 있고,
Phase 9에서 API 연동 시 UI 수정 없이 데이터 소스만 교체할 수 있습니다.

선행 의존성: Phase 7 완료

### 작업 항목

#### A001: 관리자 레이아웃 컴포넌트

- [ ] `src/components/layout/AdminLayout.tsx` — 관리자 레이아웃 래퍼
  - 상단 헤더: 블로그 이름 + "관리자 모드" 표시 배지
  - 공개 블로그로 이동하는 링크 포함
  - 다크모드 지원 (ThemeContext 활용)
  - 반응형: 모바일/태블릿/데스크톱 모두 대응

#### A002: 코스 전체 목록 테이블

관리자 대시보드(`/admin`)에 모든 코스를 테이블 형식으로 표시합니다.

- [ ] `src/components/admin/CourseAdminTable.tsx` — 코스 관리 테이블 컴포넌트
  - props: `courses: AdminCourseRow[]`, `onStatusChange: (pageId, field, value) => void`
  - shadcn/ui `Table` 컴포넌트 기반
  - 컬럼 구성:
    | 컬럼 | 내용 | 비고 |
    |---|---|---|
    | 코스명 | `title` | 공개 상세 페이지 링크 포함 |
    | 카테고리 | `category` | 카테고리 배지 표시 |
    | 완주일 | `date` | `formatShortDate()` 활용 |
    | 거리 | `distance` | `formatDistance()` 활용 |
    | 완보 여부 | `completed` | 라디오/셀렉트 (완보/미완) — A003 |
    | 게시 상태 | `published` | 체크박스 — A004 |
  - 정렬: 완주일 내림차순 기본
  - 로딩 중 스켈레톤 UI 표시 (`LoadingSkeleton` 활용)
  - 빈 목록 시 안내 메시지 표시

- [ ] `src/app/admin/page.tsx` — 관리자 대시보드 페이지
  - 상단 요약 카드: 전체 코스 수, 게시된 코스 수, 완보 코스 수
  - `CourseAdminTable` 컴포넌트 통합
  - `"use client"` 선언 (상태 관리 필요)
  - 카테고리별 탭 필터 (선택적 — 전체/카테고리별 전환)

#### A003: 완보/미완 상태 관리 UI

- [ ] `src/components/admin/CompletedSelector.tsx` — 완보 상태 선택 컴포넌트
  - props: `value: boolean`, `onChange: (value: boolean) => void`, `loading?: boolean`
  - shadcn/ui `Select` 컴포넌트 사용
  - 옵션: "완보" (true) / "미완" (false)
  - 변경 즉시 콜백 실행 (onChange 호출)
  - `loading=true` 시 비활성화 + 스피너 표시
  - 완보: 초록색 배지, 미완: 회색 배지 (시각적 구분)

#### A004: 게시 상태 관리 UI

- [ ] `src/components/admin/PublishedCheckbox.tsx` — 게시 상태 체크박스 컴포넌트
  - props: `checked: boolean`, `onChange: (checked: boolean) => void`, `loading?: boolean`
  - shadcn/ui `Checkbox` + `Label` 컴포넌트 사용
  - 체크 시 "게시됨", 미체크 시 "미게시" 텍스트 표시
  - `loading=true` 시 비활성화 처리
  - 접근성: `aria-label="게시 상태 변경"` 포함

#### 관리자 공통 컴포넌트

- [ ] `src/components/admin/StatusBadge.tsx` — 상태 배지 컴포넌트
  - 완보/미완, 게시/미게시 상태를 시각적으로 표시
  - shadcn/ui `Badge` 컴포넌트 기반
- [ ] `src/components/admin/AdminSummaryCard.tsx` — 대시보드 요약 카드
  - 전체/게시/완보 수치를 카드 형태로 표시

### 완료 기준

- [ ] `/admin` 페이지에서 Mock 데이터 기반 코스 목록 테이블 정상 표시
- [ ] 테이블 컬럼 (코스명, 카테고리, 완주일, 거리, 완보 여부, 게시 상태) 모두 표시
- [ ] `CompletedSelector` 선택 변경 시 `onStatusChange` 콜백 호출 확인
- [ ] `PublishedCheckbox` 체크 변경 시 `onStatusChange` 콜백 호출 확인
- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 반응형 정상 동작
- [ ] 다크모드에서 관리자 UI 시각적 일관성 확인
- [ ] `npm run build` 성공 (에러 0개)

### 예상 소요 시간

**1.5일**
- 관리자 레이아웃 컴포넌트 (1시간)
- `CourseAdminTable` 컴포넌트 (3시간)
- `CompletedSelector`, `PublishedCheckbox`, 공통 컴포넌트 (2시간)
- 대시보드 페이지 조립 및 반응형 검증 (2시간)

---

## Phase 9: API 연동 및 비즈니스 로직 구현

### 진행 순서 및 근거

UI가 완성된 후 실제 Notion API와 연동하여 상태 변경이 Notion 데이터베이스에 반영되도록 합니다.
이 단계는 데이터 변경(쓰기) 작업이 포함되므로 특별히 신중하게 처리해야 합니다.
API 연동 완료 후에는 **Playwright MCP를 통한 E2E 테스트**가 반드시 수행되어야 합니다.

선행 의존성: Phase 7, Phase 8 완료

### 작업 항목

#### A001~A004: 관리자 API 연동 완성

- [ ] `src/app/admin/page.tsx` — Mock 데이터 → 실제 API 연동으로 교체
  - `GET /api/admin/courses` 호출로 전체 코스 목록 로드
  - `fetch()` + `useEffect` 또는 Server Component 방식 선택
  - 로딩 상태 관리 (`isLoading: boolean`)
  - 에러 상태 관리 (`error: string | null`)
  - 에러 발생 시 토스트 알림 (Sonner 활용)

- [ ] 상태 변경 핸들러 구현 (`handleStatusChange`)
  ```ts
  // 상태 변경 흐름
  // 1. UI 즉시 낙관적 업데이트 (Optimistic Update)
  // 2. PATCH /api/admin/courses/[pageId] 호출
  // 3. 성공 시 토스트 "저장되었습니다"
  // 4. 실패 시 롤백 + 토스트 "저장 실패. 다시 시도해 주세요."
  ```
  - `loading` 상태로 해당 행의 UI 비활성화 (중복 클릭 방지)
  - Notion API 응답 지연 대비 타임아웃 처리 (5초)

#### A003: Completed 필드 Notion API 연동

- [ ] `PATCH /api/admin/courses/[pageId]` Route Handler 완성
  - `field: 'completed'`, `value: boolean` 처리
  - Notion `pages.update()` 호출:
    ```ts
    // Notion Radio Button 필드 업데이트 예시
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Completed: {
          select: { name: value ? '완보' : '미완' }
        }
      }
    });
    ```
  - Notion 스키마의 실제 필드명/타입 확인 후 적용 (Select 또는 Checkbox)
  - 성공 응답: `{ success: true, pageId, field, value }`
  - 실패 응답: `{ success: false, error: string }` + HTTP 500

#### A004: Published 필드 Notion API 연동

- [ ] `PATCH /api/admin/courses/[pageId]` Route Handler — `field: 'published'` 처리
  - Notion `pages.update()` 호출:
    ```ts
    // Notion Checkbox 필드 업데이트 예시
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Published: {
          checkbox: value
        }
      }
    });
    ```
  - 성공 시 공개 페이지 캐시 무효화 검토 (ISR revalidate)
    - `revalidatePath('/[category]')`, `revalidatePath('/')` 호출 (선택적)

#### 공개 페이지 캐시 연동 (선택적)

- [ ] Published 상태 변경 시 관련 페이지 캐시 무효화
  - `revalidatePath()` 활용으로 공개 목록 페이지 즉시 갱신
  - 적용 범위: 홈 페이지(`/`), 해당 카테고리 페이지(`/[category]`)

---

### Playwright MCP E2E 테스트 (필수)

API 연동이 완료된 후 반드시 Playwright MCP를 통한 E2E 테스트를 수행합니다.
테스트는 **실제 Notion 데이터**를 대상으로 수행하며, Mock 데이터 사용 불가입니다.

#### 테스트 환경 준비

- [ ] `npm run dev` 실행 후 `http://localhost:3000/admin` 접속 확인
- [ ] `.env.local`에 `NOTION_API_TOKEN`, `NOTION_DATABASE_ID` 설정 확인
- [ ] Notion Integration에 **Update content** 권한 부여 확인

#### 테스트 시나리오

**시나리오 1: 관리자 대시보드 접근 (A001, A002)**
- [ ] `/admin` 접속 시 관리자 레이아웃 표시 확인
- [ ] 코스 목록 테이블에 실제 Notion 데이터 표시 확인 (Published 무관 전체 목록)
- [ ] 요약 카드(전체/게시/완보 수)가 실제 데이터와 일치 확인
- [ ] 테이블 로딩 중 스켈레톤 UI 표시 확인

**시나리오 2: 완보 상태 변경 (A003)**
- [ ] `CompletedSelector`에서 "미완" → "완보" 변경
  - UI가 즉시 낙관적으로 업데이트됨 확인
  - Notion 데이터베이스에서 해당 코스의 Completed 필드 변경 확인
  - 성공 토스트 메시지 "저장되었습니다" 표시 확인
- [ ] `CompletedSelector`에서 "완보" → "미완" 변경
  - 동일 흐름 검증

**시나리오 3: 게시 상태 변경 (A004)**
- [ ] `PublishedCheckbox`를 체크 해제 (게시 → 미게시)
  - UI 즉시 업데이트 확인
  - Notion 데이터베이스에서 Published 필드 `false` 변경 확인
  - 성공 토스트 메시지 표시 확인
  - (선택적) 공개 카테고리 페이지에서 해당 코스가 목록에서 사라짐 확인
- [ ] `PublishedCheckbox`를 체크 (미게시 → 게시)
  - 동일 흐름 검증

**시나리오 4: 오류 처리**
- [ ] Notion API 오류 시뮬레이션 (잘못된 pageId로 PATCH 요청)
  - 에러 토스트 "저장 실패. 다시 시도해 주세요." 표시 확인
  - UI가 롤백(변경 전 상태 복원) 확인
- [ ] 네트워크 지연 중 해당 행의 UI 비활성화 확인

**시나리오 5: 반응형 및 접근성**
- [ ] 모바일(375px)에서 관리자 테이블 가로 스크롤 동작 확인
- [ ] Tab 키로 테이블 내 모든 인터랙티브 요소(셀렉트, 체크박스) 포커스 가능 확인
- [ ] 다크모드에서 관리자 페이지 시각적 이상 없음 확인

#### 테스트 성공 기준

- [ ] 5개 시나리오 모두 Pass (실패율 0%)
- [ ] 완보/게시 상태 변경이 Notion 데이터베이스에 실제로 반영됨
- [ ] 상태 변경 후 공개 페이지에서도 변경 사항이 반영됨 (캐시 무효화 시)
- [ ] 콘솔 에러 0개 (경고는 허용)
- [ ] 관리자 페이지 로드 시간 3초 이내

---

### 완료 기준

- [ ] 실제 Notion API 연동으로 전체 코스 목록 조회
- [ ] Completed 필드 변경이 Notion 데이터베이스에 즉시 반영
- [ ] Published 필드 변경이 Notion 데이터베이스에 즉시 반영
- [ ] 상태 변경 실패 시 UI 롤백 및 오류 토스트 표시
- [ ] Playwright E2E 테스트 5개 시나리오 모두 통과
- [ ] `npm run build` 성공 (에러 0개)
- [ ] Vercel 프로덕션 배포 후 `/admin` 정상 동작 확인

### 예상 소요 시간

**2일**
- 관리자 API 연동 완성 (3시간)
- 상태 변경 핸들러 및 낙관적 업데이트 구현 (3시간)
- Notion PATCH API 연동 (2시간)
- Playwright E2E 테스트 실행 및 수정 (4시간)

---

## 전체 고도화 타임라인

| Phase | 작업 내용 | 예상 기간 | 시작 예정일 | 완료 예정일 | 상태 |
|---|---|---|---|---|---|
| Phase 7 | 관리자 초기 설정 + 로그인 인증 (골격 구축) | **1.5일** | 2026-04-06 | 2026-04-07 | 대기 중 |
| Phase 8 | 관리자 핵심 기능 개발 | **1.5일** | 2026-04-07 | 2026-04-08 | 대기 중 |
| Phase 9 | API 연동 + 비즈니스 로직 + Playwright 테스트 | **2일** | 2026-04-09 | 2026-04-10 | 대기 중 |
| **합계** | | **5일** | **2026-04-06** | **2026-04-10** | | |

> 1인 개발 기준. `.env.local` 및 Notion Integration 권한 설정이 사전에 완료되어 있어야 합니다.

---

## 완료 체크리스트

### Phase 7 체크리스트

- [ ] 로그인 페이지 (`/auth/login`) 구현
  - [ ] `src/app/auth/login/page.tsx` 컴포넌트 작성
  - [ ] 패스워드 입력 필드 및 로그인 버튼
  - [ ] 에러 메시지 표시 기능
- [ ] 인증 API Route 구현
  - [ ] `POST /api/auth/login` (패스워드 검증 + 쿠키 설정)
  - [ ] `POST /api/auth/logout` (쿠키 삭제)
- [ ] Middleware 구현 (`src/middleware.ts`)
  - [ ] `/admin` 경로 접근 제어 (쿠키 검증)
  - [ ] 미인증 요청 시 `/auth/login`으로 리다이렉트
- [ ] 로그인 환경변수 설정
  - [ ] `.env.local`에 `ADMIN_PASSWORD` 추가
- [ ] `/admin` 라우트 및 독립 레이아웃 생성
- [ ] `AdminCourseRow`, `UpdateCourseStatusPayload` 타입 정의
- [ ] `getAllPostsForAdmin()`, `updateCourseStatus()` 함수 추가
- [ ] `GET /api/admin/courses` API Route
- [ ] `PATCH /api/admin/courses/[pageId]` API Route
- [ ] Notion Integration 쓰기 권한 확인
- [ ] 관리자 레이아웃에 "로그아웃" 버튼 추가
- [ ] `npm run build` 성공

### Phase 8 체크리스트

- [ ] `AdminLayout.tsx` 관리자 레이아웃 컴포넌트
- [ ] `CourseAdminTable.tsx` 코스 관리 테이블
- [ ] `CompletedSelector.tsx` 완보 상태 선택 컴포넌트
- [ ] `PublishedCheckbox.tsx` 게시 상태 체크박스 컴포넌트
- [ ] `StatusBadge.tsx`, `AdminSummaryCard.tsx` 공통 컴포넌트
- [ ] `/admin/page.tsx` Mock 데이터 기반 대시보드 완성
- [ ] 반응형(375/768/1280px) 및 다크모드 검증
- [ ] `npm run build` 성공

### Phase 9 체크리스트

- [ ] Mock 데이터 → 실제 Notion API 연동
- [ ] 낙관적 업데이트(Optimistic Update) 구현
- [ ] Completed 필드 PATCH 연동 및 Notion 반영 확인
- [ ] Published 필드 PATCH 연동 및 Notion 반영 확인
- [ ] 에러 시 롤백 + 토스트 처리
- [ ] Playwright E2E 테스트 5개 시나리오 통과
- [ ] Vercel 프로덕션 재배포 및 `/admin` 동작 확인
- [ ] `npm run build` 성공

---

## 위험 요소 및 주의사항

### RISK-A1: Notion Integration 쓰기 권한 미설정 (높음)

- **현상:** 현재 `NOTION_API_TOKEN`이 읽기 전용(Read only)으로 설정되어 있을 수 있음
- **영향:** `pages.update()` 호출 시 권한 오류(403) 발생
- **대응:** Phase 7 시작 전 Notion Developer 페이지에서 Integration 권한 확인 및 "Update content" 권한 추가 필수

### RISK-A2: Notion 필드 타입 불일치 (중간)

- **현상:** PRD의 Completed 필드가 "Radio Button"으로 정의되어 있으나,
  Notion에서 실제 구현 타입(Select, Checkbox 등)이 다를 경우 PATCH API 형식 불일치
- **영향:** `pages.update()` 호출 실패
- **대응:** Phase 7 API Route 구현 전에 Notion 데이터베이스에서 실제 필드 타입 확인 후 코드 작성

### RISK-A3: 관리자 페이지 보안 (중간) - **Phase 7에서 해결**

- **원래 현상:** `/admin` 경로가 인증 없이 공개적으로 접근 가능
- **영향:** 외부 사용자가 관리자 기능(상태 변경) 접근 가능
- **Phase 7 대응 방안:**
  1. ✅ **로그인 페이지** (`/auth/login`): 패스워드 입력 필드
  2. ✅ **Middleware 기반 접근 제어**: `/admin` 경로 요청 시 쿠키 검증
  3. ✅ **환경변수 기반 패스워드**: `ADMIN_PASSWORD`로 보안 강화
  4. 🔮 **추후 고도화 (별도 Phase)**: NextAuth.js 또는 Clerk 기반 다중 계정 관리

> **보안 고려사항:**
> - `ADMIN_PASSWORD`는 `.env.local`에만 저장 (`.gitignore` 등재)
> - HTTPS 환경(Vercel 프로덕션)에서 쿠키는 Secure 플래그로 보호됨
> - 현재 구현은 개인 블로그용 기본 보안 수준
> - 다중 관리자 또는 공개 서비스의 경우 중기 고도화 방안 적용 권장

### RISK-A4: 공개 페이지 캐시와 관리자 변경 사항 불일치 (낮음)

- **현상:** Published 상태를 `false`로 변경해도 ISR 캐시가 남아 공개 페이지에서 계속 노출
- **영향:** 관리자가 미게시 처리한 코스가 일정 시간 동안 공개 목록에 잔류
- **대응:** `revalidatePath()` 호출로 즉시 캐시 무효화 (Phase 9에서 구현)

---

## 개발 규칙 (코딩 스타일 가이드)

아래 규칙은 기존 MVP 코드와 일관성을 유지하기 위해 고도화 개발에도 동일하게 적용합니다.

- **들여쓰기**: 2칸 (스페이스)
- **함수/변수 네이밍**: camelCase (예: `handleStatusChange`, `adminCourseRow`)
- **컴포넌트 네이밍**: PascalCase (예: `CourseAdminTable`, `CompletedSelector`)
- **파일 구조**: 관리자 전용 컴포넌트는 `src/components/admin/` 폴더에 위치
- **주석 및 문서**: 한국어로 작성
- **반응형**: Tailwind breakpoint 사용 (`sm:`, `md:`, `lg:`)
- **다크모드**: `dark:` 접두사 활용 (ThemeContext 연동)
- **타입**: 모든 props와 반환값에 TypeScript 타입 명시 (any 사용 금지)
