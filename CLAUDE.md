# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**코리아 둘레길 기록 블로그** - Notion을 CMS로 활용하여 코스 정보를 자동으로 블로그에 반영하는 Next.js 기반 웹 프로젝트.

- **기술 스택**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, Notion API, Google Maps API
- **배포**: Vercel

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

### 라우팅 패턴

- `/` - 홈 (모든 코스)
- `/[category]` - 카테고리별 코스 목록 (예: `/동해안`)
- `/[category]/[slug]` - 코스 상세 (예: `/동해안/course-1`) *(미개발)*

**카테고리**: "해파랑길", "남파랑길", "서해랑길", "DMZ 평화의 길" (type: `TrailCategory`)

## Notion API 연동

### 주요 함수

`src/lib/notion.ts`에 정의된 주요 데이터 페칭 함수:

- `getAllPosts()` - 모든 게시글 조회
- `getPostsByCategory(category)` - 카테고리별 조회
- `getPostBySlug(slug)` - 슬러그로 특정 게시글 조회
- `getPageBlocks(pageId)` - 게시글의 블록 콘텐츠 조회

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
# Notion API
NOTION_API_TOKEN=ntn_xxxxxxxxxxxx (Notion Developer 페이지에서 발급)
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx (공유 DB ID)

# Google Maps (클라이언트 사이드)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIxxxxxxxxxxxxxxxxxxx
```

**주의**: NOTION_API_TOKEN은 절대 커밋하지 마세요. `.env.local`은 `.gitignore`에 등재됨.

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

프로젝트는 **Phase 1 (초기 설정) 90% 완료** 상태입니다.

- ✅ Next.js 15, TypeScript, Tailwind CSS v4 구성
- ✅ Notion API 기본 함수 작성
- ✅ 홈 페이지, 카테고리 페이지 레이아웃
- ❌ 코스 상세 페이지 ([category]/[slug])
- ❌ 필터/검색 UI 완성
- ❌ Google Maps 컴포넌트
- ❌ Playwright E2E 테스트

**다음 작업**: Phase 2 (공통 컴포넌트 개발) - TrailCard, CategoryFilter, DateFilter, SearchBar 등