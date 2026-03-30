---
name: Phase 2 공통 컴포넌트 완료 현황
description: Phase 2에서 구현된 7개 Trail 컴포넌트 목록 및 위치 (2026-03-30)
type: project
---

Phase 2 공통 컴포넌트 7개 모두 구현 완료 (2026-03-30).
위치: `src/components/trail/`

**Why:** Phase 3 핵심 기능 개발 시 이 컴포넌트들을 재사용해야 하므로 먼저 완성

**How to apply:** 홈/카테고리/상세 페이지에서 아래 컴포넌트를 임포트하여 사용

| 파일 | 기능 | 특이사항 |
|------|------|---------|
| `TrailCard.tsx` | 코스 카드 (F002) | next/image, categoryToSlug, FALLBACK_IMAGE 처리 포함 |
| `DifficultyBadge.tsx` | 난이도 배지 | 쉬움=green outline, 보통=secondary, 어려움=destructive 변형 |
| `CategoryFilter.tsx` | 카테고리 필터 (F004) | "use client", 전체+5개 카테고리 pill 버튼 |
| `DateFilter.tsx` | 날짜 범위 필터 (F005) | "use client", fieldset 구조, from/to input[date] |
| `SearchBar.tsx` | 검색창 (F006) | "use client", 300ms 디바운스, Enter 즉시 검색 |
| `PostGrid.tsx` | 카드 그리드 래퍼 (F002) | 로딩/빈결과/정상 3가지 상태, 서버 컴포넌트 |
| `LoadingSkeleton.tsx` | 스켈레톤 UI | variant: "card" \| "list" \| "detail" |

빌드 결과: TypeScript 에러 0개, 빌드 성공 확인.
Notion API warn은 토큰 미설정으로 인한 예상된 동작 (에러 아님).
