# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**코리아 둘레길 기록 블로그** - Notion을 CMS로 활용하여 코스 정보를 자동으로 블로그에 반영하고, 관리자 기능으로 운영할 수 있는 Next.js 기반 웹 프로젝트.

- **기술 스택**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, Notion API v5, Google Maps API
- **배포**: Vercel (https://my-korea-trail.vercel.app/)
- **테스트**: Playwright E2E 테스트 (관리자 기능, 코스 상세 페이지)
- **현재 상태**: **Phase 9 완료** ✅ (2026-04-09)

## 개발 명령어

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 프로덕션 모드로 실행
npm run start

# ESLint 검사
npm run lint

# E2E 테스트 (Playwright)
npm run test:e2e
# 모드별 실행:
# - npm run test:e2e --headed        # 브라우저 창 띄워서 실행
# - npm run test:e2e --ui            # 테스트 UI로 실행
# - npm run test:e2e --debug         # 디버그 모드
```

## 프로젝트 구조 및 아키텍처

### 핵심 레이어

```
src/
├── lib/
│   ├── types.ts           # TrailPost, TrailCategory, GeoPoint 등 모든 타입 정의
│   ├── notion.ts          # Notion API 클라이언트 및 데이터 페칭 함수 (서버 전용)
│   └── utils.ts           # 날짜, 거리, 카테고리 포맷팅 함수
├── app/
│   ├── page.tsx           # 홈 페이지 (모든 코스 목록)
│   ├── [category]/        # 동적 라우트 (카테고리별 코스)
│   └── [category]/[slug]/ # 동적 라우트 (코스 상세 페이지) - 아직 미개발
├── components/
│   ├── layout/            # NavBar, Footer 등 레이아웃 컴포넌트
│   └── ui/                # shadcn/ui 컴포넌트 (Button, Card, Input 등)
├── contexts/
│   └── ThemeContext.tsx   # 테마 관리 (다크모드)
└── types/
    └── index.ts           # (legacy) 현재는 lib/types.ts 사용
```

### 데이터 흐름

1. **Notion → Server Component**: `src/lib/notion.ts`의 함수들이 서버 사이드에서 데이터를 가져옴
2. **Server Component → UI**: 페이지 컴포넌트가 데이터를 받아 렌더링
3. **환경 변수**:
   - `NOTION_API_TOKEN` (비공개, 서버 전용) - Notion API 인증
   - `NOTION_DATABASE_ID` (비공개, 서버 전용) - 코스 데이터 DB ID
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (공개) - 클라이언트 사이드 지도 표시

### 라우팅 패턴 (공개 페이지)

- `/` - 홈 (모든 코스)
- `/[category]` - 카테고리별 코스 목록 (예: `/동해안`)
- `/[category]/[slug]` - 코스 상세 페이지 (예: `/동해안/course-1`)
- `/auth/login` - 관리자 로그인 페이지

**카테고리**: "해파랑길", "남파랑길", "서해랑길", "DMZ 평화의 길" (type: `TrailCategory`)

### 라우팅 패턴 (관리자 페이지)

- `/auth/login` - 로그인 페이지 (ADMIN_PASSWORD 인증)
- `/admin` - 관리자 대시보드 (코스 목록 테이블, 상태 편집)
- `/admin/*` - 관리자 기능 (Middleware로 인증 제어)

**인증**: `src/middleware.ts`에서 `/admin` 접근 시 `admin-auth` 쿠키 검증. 미인증 시 `/auth/login`으로 리다이렉트.

## 관리자 기능 (Phase 9)

### 개요

관리자는 로그인 후 `/admin` 대시보드에서 모든 코스를 테이블로 보고 상태를 편집할 수 있습니다.

### 관리자 인증

- **로그인**: `ADMIN_PASSWORD` 환경변수로 패스워드 검증 (`.env.local`에 설정)
- **세션**: `admin-auth` 쿠키로 로그인 상태 유지
- **접근 제어**: `src/middleware.ts`에서 `/admin` 경로 보호

### 관리자 대시보드 기능

| 기능 | 설명 | 파일 |
|------|------|------|
| **코스 목록 테이블** | 모든 코스를 테이블로 표시 (Published 무관) | `CourseAdminTable.tsx` |
| **완보 상태 편집** | 각 코스의 Completed 필드 변경 (완보/미완) | `CompletedSelector.tsx` |
| **게시 상태 편집** | 각 코스의 Published 필드 변경 (게시/미게시) | `PublishedCheckbox.tsx` |
| **요약 카드** | 전체/게시/완보 코스 수 표시 | `AdminSummaryCard.tsx` |

### 관리자 API Routes

- `GET /api/admin/courses` - 전체 코스 목록 조회 (Published 필터 없음)
- `PATCH /api/admin/courses/[pageId]` - 코스 상태 업데이트 (Completed 또는 Published)

**주의**: Notion API Token에 "Update content" 권한이 필요합니다.

## Notion API 연동

### 주요 함수

`src/lib/notion.ts`에 정의된 함수:

**공개 페이지용 (캐싱 적용)**
- `getAllPosts()` - 모든 게시글 조회 (Published=true만)
- `getPostsByCategory(category)` - 카테고리별 조회
- `getPostBySlug(slug)` - 슬러그로 특정 게시글 조회
- `getPageBlocks(pageId)` - 게시글의 블록 콘텐츠 조회

**관리자용 (캐싱 없음)**
- `getAllPostsForAdmin()` - 모든 코스 조회 (Published 무관)
- `updateCourseStatus(pageId, field, value)` - Notion 페이지 상태 업데이트

### 주의 사항

- **v5 API 변경**: `databases.query()` 제거됨 → `notion.search()`로 대체
- **서버 전용**: 이 파일의 함수들은 Server Component나 Route Handler에서만 사용 가능
- **클라이언트 import 금지**: `use client` 컴포넌트에서 `src/lib/notion.ts` 직접 import 불가
- **타입 안전성**: `TrailPost` 타입 사용으로 IDE 자동완성 지원

### Notion 데이터베이스 스키마

| Notion 필드 | 타입 | 예시 |
|-----------|------|------|
| `Title` | Title | "강릉~삼척 구간" |
| `Category` | Select | "동해안" |
| `Slug` | Rich Text | "gangneung-samcheok" |
| `Date` | Date | "2026-03-15" |
| `CoverImage` | Files | 대표 이미지 |
| `Description` | Rich Text | 요약 설명 |
| `Distance` | Number | 33.5 |
| `Duration` | Number | 330 (분) |
| `Difficulty` | Select | "보통" |
| `StartLocation` | Rich Text | JSON: `{"lat":37.75,"lng":129.10}` |
| `EndLocation` | Rich Text | JSON: `{"lat":37.50,"lng":129.00}` |
| `Published` | Checkbox | true |

## 타입 정의

핵심 타입은 `src/lib/types.ts`에서 정의:

- `TrailPost` - 게시글 (id, title, category, slug, date, coverImage 등)
- `TrailCategory` - 카테고리 유니온 ("동해안" | "남해안" | "서해안" | "DMZ" | "지리산")
- `GeoPoint` - 지리적 좌표 ({lat, lng, name?})
- `TrailDifficulty` - 난이도 ("쉬움" | "보통" | "어려움")

**타입 추가/수정 시**: `types.ts` → `notion.ts` → 페이지 컴포넌트 순으로 반영

## 스타일링

- **Tailwind CSS v4**: 설정 파일 없는 새로운 엔진 (자동 설정)
- **shadcn/ui**: 사전 구성된 컴포넌트 (Button, Card, Input, Dialog 등)
- **Lucide React**: 아이콘 라이브러리
- **전역 스타일**: `src/app/globals.css`

## 환경 변수 설정

`.env.local` 파일 생성 (프로젝트 루트):

```env
# Notion API (필수)
NOTION_API_TOKEN=ntn_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx

# Google Maps (클라이언트 사이드, 필수)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIxxxxxxxxxxxxxxxxxxx

# 관리자 인증 (선택, 로컬 개발 시 필수)
ADMIN_PASSWORD=your-secure-password-here
```

**주의**:
- `NOTION_API_TOKEN`은 절대 커밋하지 마세요
- `.env.local`은 `.gitignore`에 등재됨
- `ADMIN_PASSWORD`는 로컬 개발 및 E2E 테스트 실행 시 필수

## 개발 중 주의 사항

1. **Notion API v5**: `page.properties[fieldName]` 구조는 동일하나, 필드명은 Notion에서 정한 이름을 사용
2. **이미지 최적화**: `next/image` 컴포넌트 사용 권장 (CLS 방지)
3. **동적 라우트**: `generateStaticParams`로 정적 생성 가능 (성능 향상)
4. **클라이언트 컴포넌트**: `use client` 지시문이 있는 곳에서 Notion API 함수 사용 금지
5. **에러 처리**: Notion API 실패 시 적절한 폴백 UI 제공 필요

# Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 문서 참고

- **[PRD.md](./docs/PRD.md)** - 제품 요구사항 및 기능 명세 (F001~F007)
- **[ROADMAP.md](./docs/ROADMAP.md)** - 개발 로드맵 및 Phase별 작업 (현재 상태 포함)
- **[Notion API 공식](https://developers.notion.com/reference)** - API 레퍼런스
- **[Next.js 공식](https://nextjs.org/docs)** - 프레임워크 문서

## 기본 코딩 규칙

(사용자의 전역 설정 `C:\Users\mypmk\.claude\CLAUDE.md` 참고)

- **언어**: 한국어 주석 및 문서화
- **들여쓰기**: 2칸
- **변수명**: camelCase (예: `trailPost`, `categorySlug`)
- **컴포넌트**: PascalCase (예: `TrailCard`, `CategoryFilter`)
- **반응형**: Tailwind breakpoint 사용 (sm:, md:, lg: 등)

## 현재 진행 상태

**MVP + 관리자 기능 모두 완료** ✅

### Phase 별 완료 상황

| Phase | 작업 내용 | 상태 |
|---|---|---|
| Phase 1~6 | MVP 개발 (홈/카테고리/상세 페이지, Notion 연동, 배포) | ✅ 완료 |
| Phase 7 | 관리자 초기 설정 (로그인, 라우트, 타입, 기본 API) | ✅ 완료 |
| Phase 8 | 관리자 UI 컴포넌트 개발 | ✅ 완료 |
| Phase 9 | 관리자 API 연동, E2E 테스트 (Playwright) | ✅ 완료 (2026-04-09) |

### 구현된 핵심 기능

**공개 사이트**
- ✅ 홈 페이지 (코스 검색, 필터링)
- ✅ 카테고리별 코스 목록 (날짜 필터링)
- ✅ 코스 상세 페이지 (Google Maps 지도 표시)
- ✅ 다크모드, ARIA 접근성, SEO

**관리자 기능**
- ✅ 패스워드 기반 로그인 (`/auth/login`)
- ✅ 관리자 대시보드 (`/admin`)
- ✅ 코스 상태 편집 (완보/미완, 게시/미게시)
- ✅ Notion 데이터 실시간 동기화
- ✅ E2E 테스트 (5개 시나리오, Playwright)

## 개발 워크플로우

### E2E 테스트 실행

```bash
# 1. 개발 서버 시작
npm run dev

# 2. .env.local에 ADMIN_PASSWORD 설정 확인
# ADMIN_PASSWORD=admin123  (예시)

# 3. E2E 테스트 실행
npm run test:e2e

# 4. 테스트 결과 확인
# - HTML Report: playwright-report/index.html 에서 상세 결과 확인
# - 실패 시 Traces/Videos 확인
```

### 관리자 기능 로컬 테스트

```bash
# 1. .env.local 설정
NOTION_API_TOKEN=...
NOTION_DATABASE_ID=...
ADMIN_PASSWORD=admin123

# 2. 개발 서버 실행
npm run dev

# 3. 로그인
# http://localhost:3000/auth/login
# - 패스워드: ADMIN_PASSWORD 값 입력

# 4. 관리자 페이지 접속
# http://localhost:3000/admin
```

### Notion API 권한 확인

관리자 기능이 정상 동작하려면 Notion Integration에 **Update content** 권한이 필요합니다.

**확인 방법:**
1. https://www.notion.so/my-integrations 접속
2. 사용 중인 Integration 클릭
3. **Capabilities** 섹션에서 "Update content" 체크 확인
4. 없으면 활성화 후 `NOTION_API_TOKEN` 재발급

## 문제 해결 (Troubleshooting)

### 1. Notion API 환경변수 오류
**증상**: `❌ [Notion API] 필수 환경 변수 미설정` 에러
```bash
# 해결
1. .env.local 파일 생성
2. NOTION_API_TOKEN, NOTION_DATABASE_ID 추가
3. npm run dev 재실행
```

### 2. 관리자 대시보드에 코스가 안 보임
**증상**: `/admin` 접속 후 테이블이 비어있음
```bash
# 확인 사항
1. Notion Integration에 "Read content" 권한 확인
2. NOTION_DATABASE_ID가 올바른지 확인
3. Notion 데이터베이스의 Published 필드 상태 확인 (관리자는 모두 표시)
4. 브라우저 콘솔에서 API 응답 확인 (F12 → Network → /api/admin/courses)
```

### 3. 상태 변경(완보/게시)이 저장 안됨
**증상**: 상태 변경 후 "저장 실패" 토스트 메시지
```bash
# 확인 사항
1. Notion Integration에 "Update content" 권한 확인
   - 권한 없으면 403 에러 발생
2. 콘솔 에러 메시지 확인 (F12 → Console)
3. Notion 데이터베이스의 필드 타입 확인:
   - Completed: Select 또는 Checkbox 타입
   - Published: Checkbox 타입
```

### 4. E2E 테스트 실패
**증상**: `npm run test:e2e` 실행 시 테스트 실패
```bash
# 확인 사항
1. ADMIN_PASSWORD 환경변수 설정 확인
2. 개발 서버가 실행 중인지 확인 (npm run dev)
3. 로그인 페이지에서 수동으로 로그인 테스트
4. Playwright 리포트 확인:
   npx playwright show-report
5. 테스트 브라우저 창 띄우기:
   npm run test:e2e --headed
```

### 5. 공개 페이지에서 미게시 코스가 계속 보임
**증상**: 관리자에서 Published를 false로 바꿨는데 공개 사이트에 여전히 표시
```bash
# 원인
ISR 캐시가 유효한 상태에서 재생성까지 최대 60초 대기 필요

# 즉시 확인하려면
1. 브라우저 새로고침 (Shift + F5 강력 새로고침)
2. 또는 캐시 무효화: POST /api/revalidate 호출
3. Vercel에서 배포된 경우 캐시 완전 재구성 (약 1분)
```

### 6. "패스워드가 일치하지 않습니다" 에러
**증상**: 올바른 패스워드를 입력했는데 로그인 실패
```bash
# 확인 사항
1. ADMIN_PASSWORD 환경변수 정확히 입력 확인
   - 공백 없음, 대소문자 구분
2. .env.local을 저장 후 개발 서버 재시작
3. 서버 로그 확인 (npm run dev 콘솔)
```

## 아키텍처 세부사항

### 캐싱 전략

**공개 페이지 (ISR)**
- `getAllPosts()`: 60초 캐시 + ISR (Published=true만 포함)
- `getPostsByCategory()`: 60초 캐시
- `getPostBySlug()`: 60초 캐시
- 캐시 갱신: 자동(60초) 또는 Published 상태 변경 시 수동 무효화

**관리자 페이지**
- `getAllPostsForAdmin()`: 캐시 없음 (항상 최신 데이터)
- 상태 변경 후 즉시 반영

### 상태 변경 흐름 (낙관적 업데이트)

```
사용자 UI 변경
    ↓
즉시 로컬 상태 업데이트 (낙관적)
    ↓
PATCH /api/admin/courses/[pageId] 호출
    ↓
Notion API 업데이트
    ↓
성공 → 토스트 "저장되었습니다"
실패 → 로컬 상태 롤백 + 토스트 "저장 실패"
```

### 타입 안전성

- `AdminCourseRow` - 관리자 테이블 행 타입
- `UpdateCourseStatusPayload` - API 요청 타입
- `TrailPost` - 공개 게시글 타입
- 모든 Notion 필드는 명확한 타입으로 정의 (`src/lib/types.ts`)