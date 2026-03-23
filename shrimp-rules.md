# 코리아 둘레길 기록 블로그 - AI 개발 표준 (shrimp-rules.md)

## 1. 프로젝트 개요

### 목적
Notion을 CMS로 활용하여 코리아 둘레길(동해안·남해안·서해안·DMZ·지리산) 코스 정보를 자동으로 블로그에 반영하는 Next.js 기반 웹 애플리케이션.

### 기술 스택
| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript 5 (strict 모드) |
| UI | React 19 |
| 스타일링 | TailwindCSS v4 (설정 파일 없음), shadcn/ui |
| CMS | Notion API v5 (@notionhq/client) |
| 지도 | Google Maps JavaScript API (@react-google-maps/api) |
| 패키지 관리 | npm |
| 배포 | Vercel |

### 프로젝트 상태
- **Phase**: 1 (초기 설정) 90% 완료
- **완료 항목**: 프로젝트 구조, 타입 정의, 기본 레이아웃, Notion 클라이언트
- **미완료 항목**: 코스 상세 페이지, 검색/필터 UI, Google Maps 통합, E2E 테스트
- **현재 작업**: Phase 2-3 공통 컴포넌트 및 핵심 기능 개발

---

## 2. 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (ThemeProvider, NavBar, Footer)
│   ├── page.tsx                  # 홈 페이지
│   ├── globals.css               # 전역 스타일
│   └── [category]/
│       ├── page.tsx              # 카테고리별 코스 목록 페이지
│       └── [slug]/
│           └── page.tsx          # 코스 상세 페이지 (미개발)
│
├── components/
│   ├── layout/
│   │   ├── NavBar.tsx            # 상단 네비게이션 (sticky, 다크모드 토글, 햄버거 메뉴)
│   │   └── Footer.tsx            # 푸터
│   ├── ui/                        # shadcn/ui 컴포넌트 (Button, Card, Badge 등)
│   ├── map/                       # Google Maps 관련 (미개발)
│   └── [기능]/                    # 기능별 컴포넌트 (TrailCard, CategoryFilter 등 - Phase 2)
│
├── contexts/
│   └── ThemeContext.tsx          # 다크/라이트 모드 상태 관리 (Context API)
│
└── lib/
    ├── types.ts                  # 타입 정의 (TrailPost, TrailCategory 등)
    ├── notion.ts                 # Notion API 클라이언트 (서버 전용)
    └── utils.ts                  # 유틸리티 함수 (날짜, 거리 포맷팅 등)
```

### 핵심 모듈 간 의존성

```
types.ts
    ↓
notion.ts (types.ts의 타입을 import)
    ↓
page.tsx (notion.ts의 함수로 데이터 페칭, 데이터를 컴포넌트에 전달)
    ↓
컴포넌트 (props로 데이터 수신)
```

**규칙**: 타입을 수정하면 반드시 notion.ts의 매핑 함수도 확인 및 수정해야 함.

---

## 3. 코드 표준

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| **변수/함수** | camelCase | `getAllPosts`, `trailPost`, `formatDate` |
| **컴포넌트** | PascalCase | `TrailCard`, `NavBar`, `CategoryFilter` |
| **타입/인터페이스** | PascalCase | `TrailPost`, `GeoPoint`, `TrailCategory` |
| **상수** | UPPER_SNAKE_CASE | `DATABASE_ID`, `MAX_RESULTS` |
| **파일명 (컴포넌트)** | PascalCase | `NavBar.tsx`, `TrailCard.tsx` |
| **파일명 (유틸리티)** | camelCase | `notion.ts`, `utils.ts`, `types.ts` |
| **CSS 클래스** | kebab-case (Tailwind) | `flex`, `bg-background`, `text-foreground` |

### 코드 포맷팅

- **들여쓰기**: 2칸 (스페이스)
- **주석 언어**: 한국어
- **커밋 메시지**: 한국어 (예: `feat: 코스 상세 페이지 추가`)
- **문서화**: 한국어 (CLAUDE.md, PRD.md 등)

### 타입 안정성

- **TypeScript strict 모드 필수** (tsconfig.json 기준)
- **any 타입 사용 금지** 단, 예외 시 반드시 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 주석 추가
  - 예: `mapPageToTrailPost()` 함수의 Notion API 응답 처리
- **null/undefined 명시적 처리** (옵셔널 체이닝, null 병합 연산자 활용)

---

## 4. 타입 시스템 규칙

### 타입 정의 파일: `src/lib/types.ts`

**이 파일이 모든 타입의 단일 소스(Single Source of Truth)입니다.**

### 핵심 타입

| 타입 | 설명 | Notion 필드 동기화 |
|---|---|---|
| `TrailCategory` | 카테고리 (동해안\|남해안\|서해안\|DMZ\|지리산) | Notion의 Category 속성명과 정확히 일치 필요 |
| `TrailPost` | 게시글 (id, title, category, slug, date 등) | `mapPageToTrailPost()`에서 매핑 |
| `TrailDifficulty` | 난이도 (쉬움\|보통\|어려움) | Notion의 Difficulty 속성값 |
| `GeoPoint` | 지리적 좌표 ({lat, lng, name?}) | Google Maps와 호환 |
| `PaginatedResult<T>` | 페이지네이션 ({items, nextCursor?, hasMore}) | 대량 데이터 조회 시 사용 |

### 타입 수정 시 체크리스트

**⚠️ CRITICAL: 타입을 수정하면 반드시 다음 파일도 확인 및 수정해야 함**

1. **타입 추가/수정**: `src/lib/types.ts`
2. **즉시 확인/수정**: `src/lib/notion.ts`의 `mapPageToTrailPost()` 함수
   - Notion 속성명과 매핑 관계 검증
   - 기본값(fallback) 설정 확인
3. **사용 중인 페이지 컴포넌트**: `src/app/page.tsx`, `src/app/[category]/page.tsx`
   - 새 필드를 사용하는 경우 렌더링 로직 추가
4. **Notion 데이터베이스 스키마**: CLAUDE.md의 "Notion 데이터베이스 스키마" 섹션과 동기화

**예시: 새로운 필드 추가**
```typescript
// 1. types.ts에 필드 추가
export interface TrailPost {
  // ...기존 필드
  season?: "봄" | "여름" | "가을" | "겨울";  // 새 필드
}

// 2. notion.ts의 mapPageToTrailPost()에 매핑 추가
function mapPageToTrailPost(page: any): TrailPost {
  // ...기존 코드
  season: (props.Season?.select?.name as any) ?? undefined,  // 새 필드
}

// 3. 페이지 컴포넌트에서 렌더링
<span>{post.season}</span>
```

---

## 5. Notion API 연동 규칙

### 파일: `src/lib/notion.ts`

**이 파일은 서버 전용입니다. 클라이언트 컴포넌트에서 절대 import하면 안 됩니다.**

### 환경 변수 (필수)

```env
# .env.local (프로젝트 루트, .gitignore에 등재)
NOTION_API_TOKEN=ntn_xxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIxxxxxxxxxxx
```

- `NOTION_API_TOKEN`: Notion Developer 페이지에서 발급 (비공개, 서버 전용)
- `NOTION_DATABASE_ID`: Notion 공유 데이터베이스 ID (비공개, 서버 전용)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Cloud Console에서 발급 (공개, 클라이언트 접근 가능)

### 주요 함수

| 함수 | 반환값 | 설명 |
|---|---|---|
| `getAllPosts()` | `TrailPost[]` | 모든 게시글 조회 (published=true인 항목만) |
| `getPostsByCategory(category)` | `TrailPost[]` | 카테고리별 게시글 조회 |
| `getPostBySlug(slug)` | `TrailPost \| null` | 슬러그로 단일 게시글 조회 |
| `getPageBlocks(pageId)` | Notion Block[] | 게시글 본문 블록 조회 (미개발) |
| `getAllCategories()` | `TrailCategory[]` | 카테고리 목록 조회 (현재 하드코딩) |

### 사용 제약사항

**🚫 금지 사항:**
- `use client` 컴포넌트에서 `src/lib/notion.ts` import
- 클라이언트에서 `NOTION_API_TOKEN` 사용
- 비동기 함수를 컴포넌트의 초기 상태 설정에 사용

**✅ 권장 방식:**
- Server Component에서만 사용 (기본값)
- Route Handler에서 필요 시 감싸기
- 캐싱 전략 적용 (Phase 5에서 구현)

### Notion API v5 주요 변경사항

- ❌ `databases.query()` 제거
- ✅ `notion.search()` 사용으로 대체
- 페이지 속성 접근: `page.properties[fieldName]` (동일)

### 알려진 제약사항

| 제약 | 영향 | 대응 방안 |
|---|---|---|
| **Notion 이미지 URL 1시간 만료** | 배포 환경에서 이미지 깨짐 | Phase 5: 이미지 프록시 또는 외부 URL 정책 |
| **API 요청 한도 (초당 3회)** | 동시 접근 시 429 에러 | Phase 5: ISR 캐싱, 요청 최소화 |
| **`search()` 필터링 정밀도 낮음** | 카테고리/날짜 필터링 부정확 | 클라이언트 필터링 병행 |

---

## 6. 라우팅 패턴

### 페이지 구조

| 경로 | 파일 | 기능 | 상태 |
|---|---|---|---|
| `/` | `src/app/page.tsx` | 홈 페이지 (모든 코스 + 검색) | ✅ 기본 구조 완료 |
| `/[category]` | `src/app/[category]/page.tsx` | 카테고리별 코스 목록 + 필터 | ✅ 기본 구조 완료 |
| `/[category]/[slug]` | `src/app/[category]/[slug]/page.tsx` | 코스 상세 페이지 | ❌ 미개발 |

### 동적 라우트 규칙

**`[category]` 파라미터:**
- 유효값: "동해안", "남해안", "서해안", "DMZ", "지리산"
- URL 슬러그로 변환 필요: 공백/특수문자 → 하이픈 또는 아래밀줄

**`[slug]` 파라미터:**
- Notion `Slug` 필드 값과 정확히 일치
- 데이터베이스에 존재하지 않으면 404 페이지 표시 (Phase 1 체크리스트 항목)

### generateStaticParams 활용

**상세 페이지 개발 시** (`/[category]/[slug]/page.tsx`):
```typescript
// 빌드 타임에 동적 경로 사전 생성 → 첫 방문 응답 속도 향상
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}
```

---

## 7. 컴포넌트 개발 규칙

### Server vs Client Component

| 구분 | Server Component | Client Component |
|---|---|---|
| **선언** | 기본값 (선언 불필요) | `"use client"` 지시문 필수 |
| **Notion API** | ✅ 직접 import 및 호출 가능 | ❌ 절대 금지 |
| **환경 변수** | ✅ 모든 변수 접근 가능 | ⚠️ `NEXT_PUBLIC_` 접두어만 |
| **Context** | ❌ Context 읽기 불가 | ✅ Context 읽기/쓰기 가능 |
| **인터랙션** | ❌ onClick, onChange 등 불가 | ✅ 이벤트 핸들러 가능 |

### 컴포넌트 분류

**레이아웃 컴포넌트** (`src/components/layout/`)
- NavBar, Footer 등 모든 페이지에서 재사용
- Server Component 권장

**shadcn/ui 기본 컴포넌트** (`src/components/ui/`)
- Button, Card, Badge 등 (이미 설치 완료)
- 대부분 Client Component

**기능 컴포넌트** (`src/components/[기능]/` - Phase 2)
- TrailCard, CategoryFilter, DateFilter, SearchBar 등
- 상태 관리 필요 시 Client Component
- 단순 표시만 하면 Server Component

### 반응형 디자인

**Tailwind CSS 브레이크포인트 적용 필수:**
```
모바일 (기본): 0-639px
md: 768px 이상
lg: 1024px 이상
xl: 1280px 이상
```

**예시:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
</div>
```

### 다크모드 지원

**모든 컴포넌트에서 다크모드 색상 정의 필수:**
```typescript
// ❌ 나쁜 예
<div className="bg-white text-black">

// ✅ 좋은 예 (Tailwind 의미론적 클래스)
<div className="bg-background text-foreground">
```

**Tailwind 의미론적 토큰:** `background`, `foreground`, `primary`, `secondary`, `destructive`, `muted` 등

---

## 8. 환경 변수 관리

### 필수 환경 변수

**서버 전용 (비공개, 절대 클라이언트 코드에 포함되지 않음):**
```
NOTION_API_TOKEN
NOTION_DATABASE_ID
```

**클라이언트 접근 가능 (공개):**
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### 로컬 개발 환경 설정

```bash
# 1. 프로젝트 루트에 .env.local 파일 생성
touch .env.local

# 2. 필수 환경 변수 입력
NOTION_API_TOKEN=ntn_xxxxx
NOTION_DATABASE_ID=xxxxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIxxxxx

# 3. 개발 서버 실행
npm run dev
```

### Vercel 배포 환경 설정

1. Vercel 대시보드 → Settings → Environment Variables
2. 모든 환경 변수 입력 (Production, Preview, Development)
3. 배포 후 환경 변수 검증

---

## 9. 파일 상호작용 규칙 (핵심)

### 동시 수정이 필요한 파일 세트

#### 세트 1: 타입 시스템

**⚠️ 다음 파일들은 항상 함께 수정되어야 합니다:**

```
수정 시작: src/lib/types.ts
    ↓
필수 확인: src/lib/notion.ts (mapPageToTrailPost 함수)
    ↓
필요 시 수정: src/app/page.tsx, src/app/[category]/page.tsx
    ↓
문서화: CLAUDE.md의 "Notion 데이터베이스 스키마" 섹션
```

**규칙:** TrailPost 인터페이스에 필드 추가 → notion.ts의 매핑 함수 즉시 업데이트 → 빌드 테스트

#### 세트 2: 카테고리 관리

```
변경 대상: src/lib/types.ts (TrailCategory 타입)
동시 수정: src/lib/notion.ts (getAllCategories 함수 - 하드코딩)
동시 수정: src/app/layout.tsx (NavBar의 카테고리 메뉴)
동시 수정: CLAUDE.md의 "카테고리" 섹션
```

**규칙:** 새 카테고리 추가 시 4개 파일 모두 업데이트 필요

#### 세트 3: 라우팅 구조

```
신규 라우트: src/app/[새_경로]/page.tsx
필수 추가: generateStaticParams(), generateMetadata() 함수
필수 연결: src/components/layout/NavBar.tsx (내비게이션 메뉴)
문서화: ROADMAP.md의 "라우팅 패턴" 섹션
```

---

## 10. 금지된 패턴

### 🚫 절대 금지

| 금지 사항 | 이유 | 정정 방법 |
|---|---|---|
| **`use client` 컴포넌트에서 `src/lib/notion.ts` import** | Notion API 토큰이 클라이언트에 노출됨 | Route Handler 또는 Server Component에서 데이터 페칭 후 props로 전달 |
| **타입 수정 후 `notion.ts` 미수정** | 런타임 에러, 타입 불일치 | 타입 추가 즉시 `mapPageToTrailPost()`에 매핑 추가 |
| **Notion 데이터베이스와 타입 동기화 실패** | 페칭 데이터 손실, undefined 필드 | CLAUDE.md의 "Notion 데이터베이스 스키마" 테이블 먼저 확인 |
| **`any` 타입 남용 (주석 없이)** | TypeScript strict 모드 위반 | 반드시 `// eslint-disable-next-line` 주석 추가 |
| **하드코딩된 카테고리 값** | 새 카테고리 추가 시 누락 가능 | `getAllCategories()` 함수 또는 `TrailCategory` 타입 사용 |
| **환경 변수 .env.local 커밋** | 보안 위험 | `.gitignore`에 등재 확인 후 git rm --cached .env.local |
| **`next/image` 미사용** | CLS(누적 레이아웃 변경) 증가, SEO 악화 | 모든 이미지는 `<Image>` 컴포넌트 사용 |
| **클라이언트에서 `process.env.NOTION_API_TOKEN` 접근** | 빌드 타임에 번들링되어 노출 | 절대 금지 |

### ⚠️ 주의해야 할 패턴

| 패턴 | 주의점 | 권장 방법 |
|---|---|---|
| **`mapPageToTrailPost()`에서 null 체크 없음** | 필드 누락 시 undefined 반환 | null 병합 연산자(`??`) 사용하여 기본값 설정 |
| **Notion 이미지 직접 URL 사용** | 1시간 후 만료 | Phase 5: 이미지 프록시 또는 외부 URL 정책 적용 |
| **대량 Notion API 호출** | Rate limit (초당 3회) 도달 | Phase 5: ISR 캐싱, `unstable_cache` 적용 |
| **동기적 이미지 로딩** | 페이지 렌더링 지연 | `next/image`의 `priority` 속성으로 선택적 적용 |

---

## 11. AI 의사 결정 기준

### 기능 추가 우선순위

**우선순위 결정 트리:**

```
1. Phase 1 미완료 항목 존재?
   → Yes: Phase 1 완료 (환경 변수, not-found.tsx, error.tsx 등)

2. Phase 2 공통 컴포넌트 미완료?
   → Yes: TrailCard, CategoryFilter, DateFilter, SearchBar 개발

3. Phase 3 핵심 기능 미완료?
   → Yes: 상세 페이지, 필터/검색 UI, Notion 블록 렌더러 개발

4. Phase 4 추가 기능?
   → Phase 5 이후에 진행

5. 모든 Phase 완료?
   → 버그 수정, 성능 최적화, 배포 준비
```

### 파일 선택 기준

**특정 기능을 구현할 때:**

1. **타입 필요?** → `src/lib/types.ts` 먼저 확인
2. **Notion 연동?** → `src/lib/notion.ts` 확인 및 함수 추가
3. **페이지 레이아웃?** → `src/app/layout.tsx`, `src/components/layout/` 확인
4. **새로운 경로?** → `src/app/[new-route]/page.tsx` 생성, generateStaticParams 추가
5. **재사용 컴포넌트?** → `src/components/[기능]/` 폴더 생성

### 애매한 구현 방식 결정

| 상황 | 결정 기준 | 선택 |
|---|---|---|
| **Server vs Client?** | Notion API 필요? | → Yes: Server, No: Client |
| **페이지 vs 컴포넌트?** | 라우트가 필요? | → Yes: 페이지, No: 컴포넌트 |
| **캐싱 전략?** | Phase 단계? | Phase 5 이후에 `unstable_cache`, ISR 적용 |
| **카테고리 슬러그?** | URL 형식 정의? | CLAUDE.md 확인 후 일관성 유지 |

---

## 12. 개발 명령어

### 필수 명령어

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 (TypeScript 컴파일 포함)
npm run build

# 빌드된 앱 프로덕션 모드로 실행
npm run start

# ESLint 검사
npm run lint
```

### 개발 중 체크리스트

- [ ] `npm run build` 성공 (TypeScript 에러 없음)
- [ ] `npm run lint` 통과 (ESLint 에러 없음)
- [ ] 모든 환경 변수 (.env.local) 입력 완료
- [ ] 브라우저 콘솔에 에러/경고 없음
- [ ] 다크모드 전환 정상 동작
- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 반응형 확인

---

## 13. 참고 문서

- **프로젝트 요구사항**: `/docs/PRD.md`
- **개발 로드맵**: `/docs/ROADMAP.md`
- **프로젝트 설정**: `/CLAUDE.md`
- **Notion API 공식 문서**: https://developers.notion.com/reference
- **Next.js 공식 문서**: https://nextjs.org/docs
- **TypeScript 공식 문서**: https://www.typescriptlang.org/docs/

---

## 14. 변경 이력

| 버전 | 날짜 | 변경 사항 |
|---|---|---|
| 1.0 | 2026-03-23 | 초기 표준 문서 작성 |

