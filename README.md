# 코리아 둘레길 기록 블로그

Notion을 CMS로 활용하여 코리아 둘레길 코스 정보를 자동으로 블로그에 반영하고, 트래킹 기록을 체계적으로 관리하는 웹 프로젝트입니다.

## 🎯 프로젝트 개요

**목적**: Notion 데이터베이스에서 글과 사진을 등록하면 자동으로 블로그에 반영되도록 하여, 코리아 둘레길 코스 정보와 완주 기록을 효과적으로 관리합니다.

**대상 사용자**: 코리아 둘레길 완주를 목표로 하는 트래킹 애호가 및 여행 기록을 공유하고자 하는 블로거

**코스**: 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길

## ✨ 주요 기능

- ✅ **Notion API 연동**: Notion 데이터베이스에서 코스 데이터 실시간 조회
- ✅ **코스 목록 표시**: 모든 완주한 코스를 카드 형태로 표시
- ✅ **코스 상세 페이지**: 코스 소개, 리뷰, 사진, 메타정보(시간, 거리) 표시
- ✅ **카테고리 필터링**: 4개 코스별 분류 및 필터링
- ✅ **날짜 필터링**: 특정 날짜 범위로 코스 기록 필터링
- ✅ **검색 기능**: 코스명으로 빠른 검색
- ✅ **Google Map API 연동**: 코스 위치를 지도로 시각화
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 완벽 대응

## 🗄️ Notion 데이터베이스 구조

| 필드 | 설명 | 타입 |
|------|------|------|
| Title | 코스명 | Text |
| Category | 코스 분류 (해파랑길/남파랑길/서해랑길/DMZ) | Select |
| Date | 완주 날짜 | Date |
| Time | 소요 시간 | Text |
| Distance | 걸은 거리 (km) | Number |
| Completed | 완주 여부 | Radio Button |
| Content1 | 코스 소개 | Rich Text |
| Content2 | 코스 리뷰 | Rich Text |
| Image | 코스 사진 | Files/Images |
| Map | 코스 지도 (google map) | Text |
| Rate | 코스 별점 (1~5점) | Number |

## 🛠️ 기술 스택

| 기술 | 버전 | 설명 |
|------|------|------|
| **Next.js** | 15 | React 풀스택 프레임워크 (App Router) |
| **React** | 19 | UI 라이브러리 |
| **TypeScript** | 5.6+ | 정적 타입 언어 |
| **Tailwind CSS** | v4 | 유틸리티 CSS 프레임워크 |
| **shadcn/ui** | Latest | 재사용 가능한 UI 컴포넌트 |
| **Lucide React** | Latest | 아이콘 라이브러리 |
| **Notion API** | Latest | @notionhq/client |
| **Google Maps API** | Latest | 지도 표시 및 마커 관리 |
| **@react-google-maps/api** | Latest | React Google Maps 통합 |

## 🚀 빠른 시작

### 환경 변수 설정 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정합니다.

#### Notion API 설정

**1. NOTION_API_TOKEN** (서버 전용, 필수)

Notion 통합(Integration)을 생성하여 토큰을 발급합니다.

발급 방법:
1. https://www.notion.so/my-integrations 접속
2. `+ New integration` 클릭
3. 이름 입력 (예: "코리아 둘레길 블로그") 후 `Submit`
4. `Internal Integration Token` 값 복사
5. Notion 데이터베이스 페이지에서 `...` 메뉴 → `Add connections` → 생성한 통합 추가

> 절대 공개하지 마세요. `.gitignore`에 등재되어 커밋되지 않습니다.

**2. NOTION_DATABASE_ID** (서버 전용, 필수)

코스 데이터가 저장된 Notion 데이터베이스 ID를 입력합니다.

추출 방법:
- 데이터베이스 URL 형식: `https://www.notion.so/{workspace}/{DATABASE_ID}?v=...`
- URL에서 `?v=` 앞의 32자리 문자열이 데이터베이스 ID입니다.
- 예: URL이 `https://www.notion.so/mysite/abc123def456ghi789jkl000mno111?v=...` 이면
  `NOTION_DATABASE_ID=abc123def456ghi789jkl000mno111`

#### Google Maps API 설정

**3. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY** (클라이언트 노출 가능, 필수)

Google Cloud Console에서 Maps JavaScript API 키를 발급합니다.

발급 방법:
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. `API 및 서비스` → `라이브러리` → `Maps JavaScript API` 활성화
4. `사용자 인증 정보` → `+ 사용자 인증 정보 만들기` → `API 키`
5. 보안 설정: `HTTP 리퍼러` 제한 추가
   - 로컬 개발: `http://localhost:3000/*`
   - 프로덕션: Vercel 도메인 추가 필수
6. 과금 방지: `할당량` 탭에서 일일 요청 한도 설정 권장

#### .env.local 예시

```bash
# Notion API (서버 전용 - 절대 NEXT_PUBLIC_ 접두사 붙이지 말 것)
NOTION_API_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Maps JavaScript API (클라이언트 사이드 사용)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **주의사항**
> - `.env.local`은 `.gitignore`에 등재되어 커밋되지 않습니다.
> - 토큰 유출 시 즉시 Notion/Google Cloud에서 재발급하세요.
> - 로컬 개발 중에는 환경 변수 없이도 Mock 데이터로 UI 테스트가 가능합니다.
> - Vercel 배포 시 Vercel 대시보드 `Settings → Environment Variables`에도 동일하게 등록해야 합니다.

### 로컬 개발 시작

```bash
# 1. 저장소 클론
git clone <repository-url>
cd notion-cms-project

# 2. 의존성 설치
npm install

# 3. .env.local 파일 생성 및 환경 변수 설정
# (위 가이드 참고)

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 열기
# http://localhost:3000
```

### 빌드 및 배포

```bash
# 빌드 검증 (TypeScript 타입 체크 + 정적 생성)
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 코드 검사
npm run lint

# Vercel 배포 (GitHub 연동 시 main 브랜치 push로 자동 배포)
# vercel 명령어로 수동 배포도 가능
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 홈 페이지 (코스 목록 + 검색)
│   ├── loading.tsx                 # 홈 페이지 로딩 UI
│   ├── error.tsx                   # 에러 바운더리
│   ├── not-found.tsx               # 404 페이지
│   ├── layout.tsx                  # 루트 레이아웃 (NavBar, Footer 포함)
│   ├── globals.css                 # 전역 스타일
│   └── [category]/
│       ├── page.tsx                # 카테고리 페이지 (카테고리별 코스 + 필터)
│       ├── loading.tsx             # 카테고리 로딩 UI
│       └── [slug]/
│           ├── page.tsx            # 코스 상세 페이지 (지도 + 정보 + 이미지)
│           └── loading.tsx         # 상세 페이지 로딩 UI
│
├── components/
│   ├── layout/
│   │   ├── NavBar.tsx              # 반응형 네비게이션 바 (다크모드 토글)
│   │   └── Footer.tsx              # 푸터
│   └── ui/                         # shadcn/ui 컴포넌트
│
├── contexts/
│   └── ThemeContext.tsx             # 다크/라이트 모드 Context
│
└── lib/
    ├── types.ts                    # TrailPost, TrailCategory 등 타입 정의
    ├── notion.ts                   # Notion API 클라이언트 (서버 전용)
    └── utils.ts                    # 날짜, 거리, 카테고리 포맷팅 함수
```

## 📋 구현 단계

1. **프로젝트 초기 설정**
   - Next.js 15 프로젝트 생성
   - Notion API 키 설정
   - Tailwind CSS, shadcn/ui 설치

2. **Notion 데이터베이스 연동**
   - @notionhq/client 설치
   - 데이터베이스 스키마 설정
   - 데이터 페칭 유틸리티 작성

3. **Google Map API 연동**
   - Google Cloud Console에서 Maps API 활성화
   - @react-google-maps/api 설치
   - 지도 컴포넌트 구현

4. **홈 페이지 구현**
   - 4개 코스 소개 카드
   - 코스 목록 표시
   - 검색 기능

5. **카테고리 페이지 구현**
   - 동적 라우트 설정
   - 카테고리별 필터링
   - 날짜 범위 필터링

6. **코스 상세 페이지 구현**
   - 동적 라우트 설정
   - Google Map 표시
   - 이미지 갤러리

7. **스타일링 및 최적화**
   - Tailwind CSS 스타일링
   - 이미지 최적화
   - SEO 메타태그 추가

8. **배포**
   - Vercel 배포
   - 환경 변수 설정

## 🔐 환경 변수

| 변수명 | 노출 범위 | 설명 | 필수 |
|--------|----------|------|------|
| `NOTION_API_TOKEN` | 서버 전용 | Notion 통합 토큰 | 필수 |
| `NOTION_DATABASE_ID` | 서버 전용 | 코스 데이터 DB ID | 필수 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 클라이언트 노출 | Google Maps JavaScript API 키 | 필수 |

자세한 발급 및 설정 방법은 [빠른 시작](#-빠른-시작) 섹션을 참고하세요.

`.env.local` 예시:

```env
# Notion API (서버 전용)
NOTION_API_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Maps (클라이언트 사이드)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📚 참고 문서

- [PRD 문서](./docs/PRD.md) - 제품 요구사항 명세서
- [Notion API 공식 문서](https://developers.notion.com)
- [Google Maps API 공식 문서](https://developers.google.com/maps)
- [Next.js 공식 문서](https://nextjs.org/docs)

## 📝 라이선스

MIT

## 👨‍💻 개발자

- 프로젝트명: 코리아 둘레길 기록 블로그
- 버전: 1.0.0
- 생성일: 2026-03-20
