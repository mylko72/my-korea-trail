# 코리아 둘레길 기록 블로그 PRD

## 🎯 핵심 정보

**목적**: Notion을 CMS로 활용하여 코리아 둘레길 코스 정보를 자동으로 블로그에 반영하고, 관리자 기능으로 운영할 수 있는 웹 플랫폼 제공

**사용자**: 
- **공개 사용자**: 코리아 둘레길 완주를 목표로 하는 트래킹 애호가 및 여행 기록을 공유하고자 하는 블로거
- **관리자 사용자**: 블로그 운영자 (코스 상태 관리, 게시 제어)

**프로젝트 상태**: ✅ **완료** (Phase 1~9 모두 완료, 2026-04-09)
- MVP (Phase 1~6): ✅ 완료
- 관리자 기능 고도화 (Phase 7~9): ✅ 완료

## 🚶 사용자 여정

```
1. 홈 페이지 방문
   ↓ [코스 소개 보기 또는 검색]

2. 검색 또는 카테고리 선택
   ↓ [검색어 입력 또는 4개 코스 중 선택]

   [검색 실행] → 홈 페이지 (검색 결과 필터링)
   [카테고리 선택] → 카테고리 페이지
   ↓

3. 코스 목록 확인
   ↓ [날짜 필터링 또는 개별 코스 선택]

   [날짜 필터] → 카테고리 페이지 (필터된 목록)
   [코스 클릭] → 코스 상세 페이지
   ↓

4. 코스 상세 정보 확인
   ↓ [상세 설명, 리뷰, 사진 확인]

5. 목록으로 돌아가기
   ↓ [뒤로 가기 또는 다른 카테고리 선택]

```

## ⚡ 기능 명세

### 1. MVP 핵심 기능 (공개 페이지 - Phase 1~6)

| ID | 기능명 | 설명 | 관련 페이지 | 상태 |
|----|--------|------|-----------|------|
| **F001** | Notion API 연동 | Notion 데이터베이스에서 코스 데이터 실시간 조회 | 홈, 카테고리, 상세 페이지 | ✅ 완료 |
| **F002** | 코스 목록 표시 | 게시된 코스를 카드 형태로 표시 (제목, 카테고리, 날짜, 거리) | 홈 페이지, 카테고리 페이지 | ✅ 완료 |
| **F003** | 코스 상세 표시 | 선택한 코스의 소개, 리뷰, 사진, 메타정보(시간, 거리) 표시 | 코스 상세 페이지 | ✅ 완료 |
| **F004** | 카테고리 필터링 | 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길로 분류 | 카테고리 페이지 | ✅ 완료 |
| **F005** | 날짜 필터링 | 특정 날짜 범위로 코스 기록 필터링 | 카테고리 페이지 | ✅ 완료 |
| **F006** | 검색 기능 | 코스명으로 빠르게 검색 | 홈 페이지 | ✅ 완료 |
| **F007** | Google Map API 연동 | 코스 좌표로 Google Map 표시 | 코스 상세 페이지 | ✅ 완료 |

### 2. 관리자 기능 (Phase 7~9)

| ID | 기능명 | 설명 | 관련 페이지 | 상태 |
|----|--------|------|-----------|------|
| **A001** | 관리자 레이아웃 구축 | `/admin` 경로 전용 레이아웃 및 대시보드 | 관리자 대시보드 | ✅ 완료 |
| **A002** | 코스 전체 목록 테이블 | 관리자 대시보드에서 모든 코스를 테이블로 표시 (Published 무관) | 관리자 대시보드 | ✅ 완료 |
| **A003** | 완보/미완 상태 관리 | 각 코스의 Completed 필드를 관리자가 직접 수정 | 관리자 대시보드 | ✅ 완료 |
| **A004** | 게시 상태 관리 | 각 코스의 Published 필드를 체크박스로 관리 | 관리자 대시보드 | ✅ 완료 |

### 3. 추가 기능 (Phase 1~6에 포함)

- ✅ 다크모드 지원
- ✅ ARIA 접근성
- ✅ SEO 메타태그 (Open Graph, JSON-LD, Sitemap)
- ✅ 이미지 최적화 (next/image)
- ✅ ISR 캐싱 (60초)

### 4. 향후 기능 (범위 제외)

- 댓글 및 평점 시스템
- 다중 관리자 계정 관리
- 고급 통계 및 분석
- 모바일 앱

## 📱 메뉴 구조

### 공개 사이트 네비게이션

```
📱 공개 네비게이션 (모든 사용자)
├── 🏠 홈 (/)
│   └── 기능: F001, F002, F006 (모든 코스 목록 + 검색)
├── 🌊 해파랑길 (/해파랑길)
│   └── 기능: F001, F002, F004, F005 (카테고리별 코스 + 필터)
├── 🏜️ 남파랑길 (/남파랑길)
│   └── 기능: F001, F002, F004, F005 (카테고리별 코스 + 필터)
├── 🌅 서해랑길 (/서해랑길)
│   └── 기능: F001, F002, F004, F005 (카테고리별 코스 + 필터)
└── 🕊️ DMZ 평화의 길 (/DMZ 평화의 길)
    └── 기능: F001, F002, F004, F005 (카테고리별 코스 + 필터)

📄 개별 페이지
└── [카테고리]/[슬러그] 상세 페이지
    └── 기능: F001, F003, F007 (상세 정보 + 이미지 + 지도)
```

### 관리자 사이트 네비게이션

```
🔐 관리자 네비게이션 (인증 필요)
├── 🔑 로그인 (/auth/login)
│   └── 기능: 패스워드 기반 인증, 쿠키 세션 관리
└── 📊 관리자 대시보드 (/admin)
    ├── 기능: A001, A002, A003, A004
    ├── 코스 목록 테이블 (전체 코스, Published 무관)
    ├── 완보 상태 관리 (선택박스)
    ├── 게시 상태 관리 (체크박스)
    └── 요약 카드 (전체/게시/완보 수)
```

---

## 📄 페이지별 상세 기능

### 홈 페이지

> **구현 기능:** `F001`, `F002`, `F006` | **메뉴 위치:** 헤더 로고/홈 버튼

| 항목 | 내용 |
|------|------|
| **역할** | 코리아 둘레길 소개 및 완주 코스 전체 목록 표시 |
| **진입 경로** | 사이트 접속 시 자동 진입, 헤더 로고 클릭 |
| **사용자 행동** | 4개 코스 소개 카드 확인, 검색어 입력, 전체 코스 목록 스크롤 |
| **주요 기능** | • 해파랑길/남파랑길/서해랑길/DMZ 평화의 길 소개 카드 4개<br>• 검색창 (코스명 검색) - F006<br>• 최근 완주 코스 목록 (역순 정렬)<br>• 각 코스 카드: 제목, 카테고리 배지, 완주 날짜, 거리<br>• **코스 카드 클릭** → 코스 상세 페이지 이동 |
| **다음 이동** | 검색 실행 → 필터링된 목록 표시, 코스 클릭 → 코스 상세 페이지 |

---

### 카테고리 페이지 (해파랑길/남파랑길/서해랑길/DMZ 평화의 길)

> **구현 기능:** `F001`, `F002`, `F004`, `F005` | **메뉴 위치:** 헤더 네비게이션 (4개 코스별)

| 항목 | 내용 |
|------|------|
| **역할** | 선택한 카테고리의 코스 목록과 필터링 기능 제공 |
| **진입 경로** | 홈 페이지에서 카테고리 버튼 클릭, 헤더 네비게이션 메뉴 선택 |
| **사용자 행동** | 카테고리별 코스 목록 확인, 날짜 범위 선택, 코스명 검색 |
| **주요 기능** | • 카테고리명 제목 표시<br>• 날짜 범위 필터 (From/To) - F005<br>• 필터링된 코스 목록 (테이블 또는 카드 형식)<br>• 각 행: 코스명, 완주 날짜, 소요시간, 거리, 상태(완보/미완)<br>• **코스명 클릭** → 코스 상세 페이지 이동 |
| **다음 이동** | 날짜 필터 변경 → 목록 재조회, 코스 클릭 → 코스 상세 페이지 |

---

### 코스 상세 페이지

> **구현 기능:** `F001`, `F003`, `F007` | **메뉴 위치:** 코스 목록에서 진입

| 항목 | 내용 |
|------|------|
| **역할** | 선택한 코스의 전체 상세 정보, 지도, 사진, 기록 표시 |
| **진입 경로** | 홈 페이지 또는 카테고리 페이지에서 코스 클릭 |
| **사용자 행동** | 코스 상세 정보 확인, 지도 확인, 사진 보기, 뒤로 가기 |
| **주요 기능** | • 코스명 및 카테고리 배지<br>• 메타정보: 완주 날짜, 소요시간, 거리, 완보 여부<br>• Google Map 표시 (Notion Map 필드 좌표 활용) - F007<br>• 코스 소개 (Content1) - 마크다운 렌더링<br>• 코스 리뷰 (Content2) - 마크다운 렌더링<br>• 코스 사진 갤러리 (이미지 목록) - F001에서 조회<br>• **뒤로 가기** 버튼 → 이전 페이지로 복귀 |
| **다음 이동** | 뒤로 가기 → 목록 페이지, 다른 코스 선택 가능 |

---

### 로그인 페이지

> **구현 기능:** 관리자 인증 | **메뉴 위치:** `/auth/login`

| 항목 | 내용 |
|------|------|
| **역할** | 관리자만 관리자 기능에 접근할 수 있도록 패스워드 인증 |
| **진입 경로** | 직접 접속: `http://localhost:3000/auth/login` 또는 미인증 상태에서 `/admin` 접속 시 자동 리다이렉트 |
| **사용자 행동** | 패스워드 입력 후 "로그인" 버튼 클릭 |
| **주요 기능** | • 패스워드 입력 필드 (type="password")<br>• "로그인" 버튼 클릭 시 `/api/auth/login` POST 요청<br>• 정확한 패스워드 입력 시 `admin-auth` 쿠키 설정 + `/admin`으로 리다이렉트<br>• 잘못된 패스워드 입력 시 에러 메시지 표시 ("패스워드가 일치하지 않습니다.")<br>• 반응형 + 다크모드 지원 |
| **다음 이동** | 로그인 성공 → `/admin` 대시보드로 이동 |

---

### 관리자 대시보드

> **구현 기능:** `A001`, `A002`, `A003`, `A004` | **메뉴 위치:** `/admin` (인증 필요)

| 항목 | 내용 |
|------|------|
| **역할** | 관리자가 모든 코스를 한눈에 보고 상태를 관리하는 통제 센터 |
| **진입 경로** | 로그인 후 `/admin` 접속 (미인증 시 `/auth/login`으로 리다이렉트) |
| **사용자 행동** | 코스 목록 확인, 완보/미완 상태 변경, 게시/미게시 상태 변경 |
| **주요 기능** | • **상단 요약 카드**: 전체 코스 수 / 게시된 코스 수 / 완보한 코스 수<br>• **코스 관리 테이블**:<br>&nbsp;&nbsp;- 컬럼: 코스명, 카테고리, 완주 날짜, 거리, 완보 여부, 게시 상태<br>&nbsp;&nbsp;- 각 코스 클릭 시 공개 상세 페이지로 이동<br>&nbsp;&nbsp;- 완보 여부: 셀렉트박스 (완보/미완) → 선택 즉시 저장<br>&nbsp;&nbsp;- 게시 상태: 체크박스 (게시/미게시) → 클릭 즉시 저장<br>• **상태 변경 처리 (낙관적 업데이트)**:<br>&nbsp;&nbsp;1. UI 즉시 업데이트 (사용자가 변경을 즉시 확인)<br>&nbsp;&nbsp;2. `PATCH /api/admin/courses/[pageId]` 호출<br>&nbsp;&nbsp;3. Notion API로 필드 업데이트<br>&nbsp;&nbsp;4. 성공 → 토스트 "저장되었습니다" + UI 유지<br>&nbsp;&nbsp;5. 실패 → 토스트 "저장 실패. 다시 시도해 주세요." + UI 롤백<br>• **로그아웃 버튼**: 우측 상단에 위치, 클릭 시 쿠키 삭제 후 홈(`/`)으로 이동<br>• 로딩 중 스켈레톤 UI 표시<br>• 반응형(모바일/태블릿/데스크톱) + 다크모드 지원 |
| **다음 이동** | 로그아웃 버튼 클릭 → 홈 페이지(`/`)로 이동 |

---

## 🗄️ 데이터 모델

### TrailPost (TypeScript 타입 - `src/lib/types.ts`)

공개 페이지에서 사용하는 게시글 타입입니다.

```typescript
interface TrailPost {
  id: string;              // Notion Page ID
  title: string;           // 코스명
  category: TrailCategory; // 해파랑길 | 남파랑길 | 서해랑길 | DMZ 평화의 길
  slug: string;            // URL 슬러그 (예: "gangneung-samcheok")
  date: string;            // ISO 8601 날짜 (예: "2026-03-15")
  distance: number;        // 거리 (km 단위)
  duration: number;        // 소요시간 (분 단위)
  difficulty: TrailDifficulty; // 쉬움 | 보통 | 어려움
  coverImage?: string;     // 대표 이미지 URL
  description: string;     // 짧은 설명
  published: boolean;      // 게시 여부 (공개 페이지에서는 true만 조회)
  completed?: boolean;     // 완보 여부
  content?: string;        // 코스 소개 (마크다운)
  review?: string;         // 코스 리뷰 (마크다운)
  images?: string[];       // 사진 갤러리 URL 배열
  startLocation?: GeoPoint; // 시작점 좌표
  endLocation?: GeoPoint;   // 종료점 좌표
}
```

### AdminCourseRow (TypeScript 타입 - 관리자 테이블용)

관리자 대시보드에서 테이블 행으로 표시되는 타입입니다.

```typescript
interface AdminCourseRow {
  id: string;              // Notion Page ID
  title: string;           // 코스명
  category: TrailCategory; // 카테고리
  date: string;            // 완주 날짜
  distance: number;        // 거리
  completed: boolean;      // 완보 여부 (A003)
  published: boolean;      // 게시 여부 (A004)
}
```

### Notion 데이터베이스 스키마

| Notion 필드 | 설명 | 타입 |
|-----------|------|------|
| Title | 코스명 | Title |
| Category | 코스 분류 | Select |
| Slug | URL 슬러그 | Rich Text |
| Date | 완주 날짜 | Date |
| Distance | 거리 (km) | Number |
| Duration | 소요시간 (분) | Number |
| Difficulty | 난이도 | Select (쉬움/보통/어려움) |
| CoverImage | 대표 이미지 | Files |
| Description | 짧은 설명 | Rich Text |
| Content | 코스 소개 | Rich Text |
| Review | 코스 리뷰 | Rich Text |
| Images | 사진 갤러리 | Files |
| StartLocation | 시작점 좌표 | Rich Text (JSON: `{"lat":37.75,"lng":129.10}`) |
| EndLocation | 종료점 좌표 | Rich Text (JSON: `{"lat":37.50,"lng":129.00}`) |
| Published | 게시 여부 (F001에서 관리) | Checkbox |
| Completed | 완보 여부 (A003에서 관리) | Select 또는 Checkbox |

---

## 🛠️ 기술 스택

### 🎨 프론트엔드 프레임워크

- **Next.js 15** (App Router) - React 풀스택 프레임워크
- **TypeScript 5** - 타입 안전성 보장
- **React 19** - UI 라이브러리 (최신 동시성 기능)

### 🎨 스타일링 & UI

- **TailwindCSS v4** (설정파일 없는 새로운 엔진) - 유틸리티 CSS 프레임워크
- **shadcn/ui** - 고품질 React 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### 📡 CMS & 데이터

- **Notion API v5** (@notionhq/client) - Headless CMS로 데이터베이스 연동
- **Notion Database** - 외부 CMS (사용자가 직접 관리)

### 🔐 인증 & 보안

- **NextAuth 미사용** - 간단한 패스워드 기반 관리자 인증
- **쿠키 기반 세션** - `admin-auth` 쿠키로 로그인 상태 유지
- **Middleware** - `/admin` 경로 접근 제어

### 🗺️ 지도 & 위치 서비스

- **Google Maps JavaScript API** - 대화형 지도 표시 및 마커 관리
- **@react-google-maps/api** - React에서 Google Maps 편리하게 사용

### 🧪 테스트

- **Playwright** - E2E 테스트 (관리자 기능, 코스 상세 페이지)
- **@playwright/test** - 테스트 러너

### 🚀 배포 & 호스팅

- **Vercel** - Next.js 15 최적화 배포 플랫폼
- **ISR (Incremental Static Regeneration)** - 60초 캐시 + 자동 재생성

### 📦 패키지 관리

- **npm** - 의존성 관리

---

## 🎯 구현 범위

### ✅ Phase 1~6 (공개 페이지 - MVP)

- ✅ Notion API 연동 (읽기 전용)
- ✅ 코스 목록 및 코스 상세 페이지
- ✅ 검색 및 필터링 (카테고리, 날짜)
- ✅ 스타일링 (Tailwind CSS v4 + shadcn/ui)
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ Google Map API 연동 (상세 페이지에서 코스 지도 표시)
- ✅ 다크모드 지원
- ✅ ARIA 접근성
- ✅ SEO 메타태그 (Open Graph, JSON-LD, Sitemap)
- ✅ ISR 캐싱 (60초)

### ✅ Phase 7~9 (관리자 기능 - 고도화)

- ✅ 패스워드 기반 관리자 인증 (`/auth/login`)
- ✅ 관리자 대시보드 (`/admin`)
- ✅ 코스 전체 목록 테이블 (Published 무관)
- ✅ 완보/미완 상태 관리 (Notion 연동, 실시간 저장)
- ✅ 게시/미게시 상태 관리 (Notion 연동, 실시간 저장)
- ✅ 낙관적 업데이트 (Optimistic Update)
- ✅ 요약 카드 (전체/게시/완보 수)
- ✅ 에러 처리 및 토스트 알림
- ✅ Playwright E2E 테스트 (5개 시나리오)

---

## 🛣️ 구현 단계 (완료됨)

### Phase 1~6: MVP 개발 (공개 페이지)

1. **Phase 1: 프로젝트 초기 설정** ✅
   - Next.js 15 프로젝트 생성
   - Notion API v5 키 설정
   - Tailwind CSS v4, shadcn/ui 설치 및 설정

2. **Phase 2: 공통 모듈/컴포넌트 개발** ✅
   - Notion 데이터베이스 스키마 정의
   - 타입 정의 (`TrailPost`, `TrailCategory`, `GeoPoint` 등)
   - 공통 컴포넌트 개발 (`TrailCard`, `CategoryFilter`, `DateFilter` 등)

3. **Phase 3: 핵심 기능 개발** ✅
   - Notion API 함수 구현 (`getAllPosts`, `getPostsByCategory`, `getPostBySlug`)
   - 홈 페이지 (`/`)
   - 카테고리 페이지 (`/[category]`)
   - 코스 상세 페이지 (`/[category]/[slug]`)

4. **Phase 4: 부가 기능 개발** ✅
   - 다크모드 (ThemeContext)
   - ARIA 접근성
   - SEO 메타태그 (Open Graph, JSON-LD)
   - Sitemap 생성

5. **Phase 5: API 연동 및 비즈니스 로직** ✅
   - ISR 캐싱 (60초)
   - 검색 필터링
   - Google Maps 연동

6. **Phase 6: 최적화 및 배포** ✅
   - 이미지 최적화 (next/image)
   - Vercel 배포 (https://my-korea-trail.vercel.app/)
   - 프로덕션 성능 검증

### Phase 7~9: 관리자 기능 고도화

7. **Phase 7: 관리자 초기 설정 (골격 구축)** ✅
   - 로그인 페이지 (`/auth/login`) - 패스워드 기반 인증
   - 관리자 라우트 및 레이아웃 (`/admin`)
   - Middleware 기반 접근 제어
   - 관리자 API Route 생성 (`GET /api/admin/courses`, `PATCH /api/admin/courses/[pageId]`)
   - Notion API 함수 확장 (`getAllPostsForAdmin`, `updateCourseStatus`)

8. **Phase 8: 관리자 핵심 기능 개발** ✅
   - 코스 목록 테이블 컴포넌트 (`CourseAdminTable`)
   - 완보 상태 선택 컴포넌트 (`CompletedSelector`)
   - 게시 상태 체크박스 컴포넌트 (`PublishedCheckbox`)
   - 관리자 대시보드 페이지 (Mock 데이터)
   - 요약 카드 (`AdminSummaryCard`)

9. **Phase 9: API 연동 및 E2E 테스트** ✅
   - 실제 Notion API 연동 (쓰기 권한)
   - 낙관적 업데이트 구현
   - 상태 변경 핸들러
   - 에러 처리 및 토스트 알림
   - Playwright E2E 테스트 (5개 시나리오 통과)

---

## 📏 작성 가이드라인

1. **구체성**: 추상적 기능이 아닌 "Notion에서 코스 데이터 조회", "날짜 범위 필터링" 등 구체적 기능
2. **사용자 관점**: 기술 구현이 아닌 사용자가 사용하는 기능 중심 (데이터 모델, API는 최소화)
3. **즉시 개발 가능**: 개발자가 이 문서만 보고 바로 코딩 시작 가능한 수준
4. **MVP 범위**: 블로그 핵심 기능에 필수적인 기능만 포함 (로그인, 댓글, 통계 제외)
5. **반응형 필수**: 모든 페이지는 모바일/태블릿/데스크톱 대응
6. **Notion 데이터 신뢰**: Notion의 정보를 단일 소스 오브 트루스로 취급

---

## ✅ 정합성 검증 완료

### MVP 기능 (F001~F007) 매핑 확인
- ✅ F001 (Notion API 연동): 홈, 카테고리, 상세 페이지, 관리자 페이지 모두 구현
- ✅ F002 (코스 목록 표시): 홈, 카테고리 페이지에 구현
- ✅ F003 (코스 상세 표시): 상세 페이지에 구현
- ✅ F004 (카테고리 필터링): 카테고리 페이지에 구현
- ✅ F005 (날짜 필터링): 카테고리 페이지에 구현
- ✅ F006 (검색 기능): 홈 페이지에 구현
- ✅ F007 (지도 연동): 상세 페이지에 구현

### 관리자 기능 (A001~A004) 매핑 확인
- ✅ A001 (관리자 레이아웃 구축): 관리자 대시보드에 구현
- ✅ A002 (코스 전체 목록 테이블): 관리자 대시보드에 구현
- ✅ A003 (완보/미완 상태 관리): 관리자 대시보드 테이블에 구현
- ✅ A004 (게시 상태 관리): 관리자 대시보드 테이블에 구현

### 메뉴-페이지 연결 확인
**공개 사이트:**
- ✅ 홈 메뉴 (`/`) → 홈 페이지
- ✅ 4개 카테고리 메뉴 → 카테고리 페이지 (각각)
- ✅ 코스 카드/목록 클릭 → 상세 페이지

**관리자 사이트:**
- ✅ 로그인 페이지 (`/auth/login`) → 패스워드 입력 → 관리자 대시보드
- ✅ 관리자 대시보드 (`/admin`) → 인증 필요 (Middleware)

### 완전성 검증
- ✅ 모든 기능 ID (F001~F007, A001~A004)가 최소 1개 이상의 페이지에 배정됨
- ✅ 모든 페이지가 메뉴 또는 내부 링크로 접근 가능
- ✅ 기능 명세 ↔ 메뉴 ↔ 페이지 상호 참조 완성
- ✅ 공개/관리자 라우트 분리 완료
- ✅ Notion API 읽기/쓰기 권한 분리 (공개: 읽기, 관리자: 읽기+쓰기)

---

## 📋 배포 및 운영 정보

### 배포 환경

| 환경 | 주소 | 상태 |
|------|------|------|
| **Vercel (프로덕션)** | https://my-korea-trail.vercel.app/ | ✅ 운영 중 |
| **로컬 개발** | http://localhost:3000 | - |

### 환경 변수 설정

**.env.local (프로젝트 루트)**

```env
# Notion API (필수, 서버 전용)
NOTION_API_TOKEN=ntn_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx

# Google Maps (필수, 클라이언트 사이드)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIxxxxxxxxxxxxxxxxxxx

# 관리자 인증 (필수, 로컬 개발 및 E2E 테스트)
ADMIN_PASSWORD=your-secure-password-here
```

**주의 사항:**
- `NOTION_API_TOKEN`, `NOTION_DATABASE_ID`는 절대 커밋하지 마세요
- `.env.local`은 `.gitignore`에 등재됨
- `ADMIN_PASSWORD`는 강력한 문자열 권장
- Notion Integration에 "Read content" + "Update content" 권한 필요

### 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# E2E 테스트 실행
npm run test:e2e

# 테스트 리포트 확인
npx playwright show-report
```

### Notion Integration 권한 확인

관리자 기능(상태 변경)이 정상 동작하려면 다음 권한이 필수입니다:

1. https://www.notion.so/my-integrations 접속
2. 사용 중인 Integration 클릭
3. **Capabilities** 섹션 확인:
   - ✅ Read content (읽기)
   - ✅ Update content (쓰기) **← 관리자 기능 필요**

---

## 📚 참고 문서

- **[ROADMAP.md](./ROADMAP.md)** - Phase별 개발 로드맵 및 상세 일정
- **[CLAUDE.md](../CLAUDE.md)** - 프로젝트 개발 가이드 및 아키텍처
- **[Notion API 공식](https://developers.notion.com/reference)** - API 레퍼런스
- **[Next.js 공식](https://nextjs.org/docs)** - 프레임워크 문서
- **[Playwright 공식](https://playwright.dev/)** - E2E 테스트 문서
