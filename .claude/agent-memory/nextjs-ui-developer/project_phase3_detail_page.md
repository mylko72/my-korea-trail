---
name: 코스 상세 페이지 구현 현황
description: Phase 3 기준 /[category]/[slug]/page.tsx 구현 상태 및 Phase 5 연동 계획
type: project
---

`src/app/[category]/[slug]/page.tsx` 파일이 생성되어 Phase 3 UI가 완료되었다 (2026-03-30 기준).

**Phase 1 최종 완료 (2026-03-30):**
- README.md 환경 변수 가이드 섹션 추가 (NOTION_API_TOKEN, NOTION_DATABASE_ID, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 발급 방법 포함)
- `npm run build` 성공 (TypeScript 에러 0개)
- Hydration 에러 수정: `ThemeContext.tsx`에서 `useState` 초기값을 항상 `"light"`로 고정 후 `useEffect`에서 `localStorage` 동기화하는 패턴으로 전환
- Playwright 통합 테스트 통과: 홈/카테고리/상세/404 페이지 모두 정상, 브라우저 콘솔 에러 0개
- 다크모드 `localStorage` 유지 확인

**현재 구현 내용:**
- `generateStaticParams`: `getAllPosts()` try-catch 후 Mock 경로(`east-coast/gangneung-samcheok`) 폴백
- `generateMetadata`: 코스 제목 기반 SEO + OG 태그
- 커버 이미지: `next/image` fill + priority (LCP 대응)
- 메타 카드: 완주날짜 / 총거리 / 소요시간 / 구간경로 (`<dl>/<dt>/<dd>` 시맨틱 마크업)
- 지도 영역: 좌표 있을 때만 노출, Google Maps 플레이스홀더 (Phase 5에서 TrailMap으로 교체)
- 본문: 단락 분리 렌더링 (Phase 5에서 `NotionBlockRenderer`로 교체)
- 이미지 갤러리: 커버 이미지 + 추가 사진 플레이스홀더
- 뒤로 가기: 상단 `<nav>` + 하단 `<footer>` 양쪽에 배치

**Phase 5 교체 대상:**
- `MOCK_POST`, `MOCK_CONTENT1`, `MOCK_CONTENT2` → 실제 `getPostBySlug()` + `getPageBlocks()` 데이터
- 지도 플레이스홀더 → `TrailMap` 컴포넌트 (`next/dynamic` ssr:false)
- 단락 렌더러 → `NotionBlockRenderer` 컴포넌트

**Why:** Notion API 연동 전에 UI를 먼저 완성하여 디자인 검토와 로직 구현을 분리하는 프로젝트 전략에 따름.
