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

## 🚀 시작하기

### 필요 조건

- Node.js 18.17 이상
- npm / yarn / pnpm / bun
- Notion API 키 (개발자 콘솔에서 발급)
- Google Maps API 키 (Google Cloud Console에서 발급)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd notion-cms-project

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# .env.local 파일 생성 후 아래 항목 추가
# NEXT_PUBLIC_NOTION_DATABASE_ID=your_database_id
# NOTION_API_KEY=your_notion_api_key
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 확인
# http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm run start

# Vercel 배포
# vercel 명령어 또는 GitHub 연동으로 자동 배포
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈 페이지 (코스 목록 + 검색)
│   ├── [category]/
│   │   └── page.tsx          # 카테고리 페이지 (카테고리별 코스 + 필터)
│   ├── [category]/[id]/
│   │   └── page.tsx          # 코스 상세 페이지 (지도 + 정보)
│   ├── layout.tsx            # 루트 레이아웃 (NavBar 포함)
│   └── globals.css           # 전역 스타일
│
├── components/
│   ├── layout/
│   │   ├── NavBar.tsx        # 네비게이션 바
│   │   └── Footer.tsx        # 푸터
│   └── ui/                   # shadcn/ui 컴포넌트
│
├── lib/
│   ├── notionApi.ts          # Notion API 클라이언트
│   └── utils.ts              # 유틸리티 함수
│
└── types/
    └── index.ts              # TypeScript 타입 정의
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

`.env.local` 파일에 다음 항목을 추가하세요:

```env
# Notion
NEXT_PUBLIC_NOTION_DATABASE_ID=your_database_id
NOTION_API_KEY=your_api_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
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
