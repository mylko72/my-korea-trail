# 코리아 둘레길 기록 블로그 - 배포 가이드

> **프로덕션 URL**: https://my-korea-trail.vercel.app/  
> **배포 날짜**: 2026-04-03  
> **플랫폼**: Vercel (Next.js 최적화)

## 🚀 배포 상태

### 프로덕션 환경
- **CI/CD**: GitHub 연동 (main 브랜치 자동 배포)
- **Build**: `npm run build` (15개 정적 페이지, ~3초)
- **Status**: ✅ 정상 운영 중

### 환경 변수 설정 (Vercel)

**Server-only** (`.env.local`, Vercel 대시보드에 등록):
```
NOTION_API_TOKEN=ntn_xxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Public** (브라우저 공개 안전):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **주의**: 민감한 정보(NOTION_API_TOKEN)는 절대 커밋하지 마세요. `.env.local`은 `.gitignore`에 등재됨.

## 📊 배포된 페이지 구조

```
├ ○ /                           (홈페이지)
├ ● /hae-parang-gil            (해파랑길)
├ ● /nam-parang-gil            (남파랑길)
├ ● /seo-hae-rang-gil          (서해랑길)
├ ● /dmz-peace-trail           (DMZ 평화의 길)
├ ● /[category]/[slug]         (10개 코스 상세 페이지)
├ ƒ /api/search                (검색 API)
├ ƒ /api/image                 (이미지 프록시)
├ ○ /robots.txt                (검색 엔진 가이드)
└ ○ /sitemap.xml               (사이트맵)

○ Static   - 정적 콘텐츠 (캐시, CDN)
● SSG      - 정적 생성 (generateStaticParams)
ƒ Dynamic  - 서버 렌더링 (요청마다 실행)
```

## ⚙️ 성능 최적화

### ISR (Incremental Static Regeneration)
- **재검증 주기**: 60초
- **동작**: Notion 데이터 변경 시 1분 이내 반영
- **이점**: 캐시 성능 + 실시간 업데이트 조화

### 이미지 최적화
- **next/image 컴포넌트**: WebP 자동 변환, 반응형 크기
- **원격 도메인 화이트리스트**:
  - `www.notion.so` (Notion 기본 이미지)
  - `prod-files-secure.s3.us-west-2.amazonaws.com` (AWS 저장소)
  - `images.unsplash.com` (개발용 이미지)
  - `www.durunubi.kr`, `durunubi.kr` (사용자 커스텀 도메인)
- **블러 플레이스홀더**: 로딩 중 SVG 그라디언트

### 코드 스플리팅
- **TrailMap**: `next/dynamic`으로 지연 로딩
  - Google Maps 라이브러리를 필요할 때만 로드
  - 번들 크기 감소, 초기 로딩 속도 향상
- **클라이언트 컴포넌트**: 필터링 상태는 클라이언트에서 처리

## 🔍 성능 검증

### Lighthouse 점수 확인
1. **Vercel 대시보드**:
   - 프로젝트 선택 → "Analytics" 탭 → "Core Web Vitals"
   
2. **Google PageSpeed Insights**:
   - https://pagespeed.web.dev에서 URL 입력
   - Desktop & Mobile 점수 확인

**목표**:
- Performance: 85점 이상
- Accessibility: 90점 이상
- Best Practices: 90점 이상
- SEO: 90점 이상

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5초
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🛠️ 운영 및 유지보수

### Notion 데이터베이스 관리
```
게시글 발행 흐름:
1. Notion 데이터베이스에 게시글 작성
2. 모든 필드 작성 (Title, Category, Slug, Date, Content, Images 등)
3. Published = true로 설정
4. 최대 60초 후 자동으로 블로그에 반영 (ISR)
```

### API 호출 모니터링
```
예상 일일 API 호출:
- getCachedAllPosts(): 1분마다 1회 → 1,440회/일
- Notion 초당 3회 한도: OK ✅

실제 사용자 접속:
- 캐시 덕분에 API 호출 없음
- ISR 재검증 시에만 호출
```

### 에러 처리
**Notion API 연결 실패 시**:
- Mock 데이터(hardcoded)로 자동 폴백
- 사용자에게 영향 없음
- 관리자는 Vercel 빌드 로그에서 확인

## 📋 배포 체크리스트

배포 후 매월 점검:

- [ ] Vercel 대시보드에서 빌드 상태 확인
- [ ] Core Web Vitals 점수 확인
- [ ] Notion 데이터베이스 연결 확인
- [ ] 프로덕션 사이트 스모크 테스트
  - 홈페이지 로드
  - 각 카테고리 페이지 접근
  - 코스 상세 페이지 접근
  - 검색 기능 테스트
- [ ] Google Maps API 할당량 확인
- [ ] SSL 인증서 유효 기간 확인 (Vercel 자동 관리)

## 🚨 문제 해결

### 배포 실패
```
원인: npm run build 실패
확인: Vercel 대시보드 → "Deployments" → 실패한 배포 선택 → 빌드 로그 확인
```

### Notion 이미지가 안 보임
```
원인 1: Notion 파일 타입 이미지 (1시간 만료)
해결: durunubi.kr 등 외부 URL 사용

원인 2: 도메인이 화이트리스트에 없음
해결: next.config.ts에서 remotePatterns 추가
```

### Google Maps 렌더링 안 됨
```
원인 1: API 키 미설정
해결: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 환경 변수 확인

원인 2: 일일 요청 한도 초과
해결: Google Cloud Console에서 할당량/한도 확인
```

### ISR 재검증이 작동 안 함
```
원인: generateStaticParams에서 경로 생성 실패
확인: 빌드 로그에서 "Generating static pages" 섹션 확인
```

## 📚 참고 문서

- **PRD**: `docs/PRD.md` - 기능 명세
- **ROADMAP**: `docs/ROADMAP.md` - 개발 진행 상황
- **Notion API**: https://developers.notion.com/reference
- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs

## 🔐 보안

- **HTTPS**: Vercel에서 자동 설정 (Let's Encrypt)
- **환경 변수**: Vercel 대시보드에서 암호화 저장
- **Repository**: GitHub private 저장소 권장
- **API 토큰**: 절대 코드에 하드코딩하지 마세요 (.gitignore 필수)

## 📞 지원 및 문의

- **Vercel Support**: https://vercel.com/support
- **Notion Community**: https://www.notion.so/help
- **Google Cloud Support**: https://cloud.google.com/support

---

**마지막 업데이트**: 2026-04-03  
**담당자**: 프로젝트 관리자

프로덕션 환경이 안정적으로 운영 중입니다! 🎉
