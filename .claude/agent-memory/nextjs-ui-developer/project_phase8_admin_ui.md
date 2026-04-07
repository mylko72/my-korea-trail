---
name: Phase 8 관리자 UI 컴포넌트 완료
description: Phase 8 관리자 핵심 기능 개발 완료 - 6개 컴포넌트 + 대시보드 페이지 조립 (2026-04-06)
type: project
---

Phase 8 관리자 UI 컴포넌트 6개 + 대시보드 페이지 구현 완료 (2026-04-06).

**Why:** MVP 완료 후 관리자 기능 고도화 단계. Mock 데이터 기반 UI를 먼저 완성하고 Phase 9에서 실제 API 연동.

**How to apply:** Phase 9 작업 시 admin/page.tsx의 mockCourses를 실제 GET /api/admin/courses 호출로 교체, handleStatusChange를 PATCH API + 낙관적 업데이트로 교체.

## 구현된 파일 목록

- `src/components/admin/StatusBadge.tsx` — 완보/게시 상태 배지 (type + value props)
- `src/components/admin/AdminSummaryCard.tsx` — 대시보드 요약 통계 카드 (label + count props)
- `src/components/admin/CompletedSelector.tsx` — 완보/미완 Select 드롭다운 (loading 시 Spinner)
- `src/components/admin/PublishedCheckbox.tsx` — 게시/미게시 Checkbox + Label (loading 시 비활성화)
- `src/components/admin/CourseAdminTable.tsx` — 코스 관리 테이블 (6컬럼, 완주일 내림차순 정렬)
- `src/components/layout/AdminLayout.tsx` — 관리자 레이아웃 래퍼 (sticky 헤더, 로그아웃 버튼)
- `src/app/admin/page.tsx` — 대시보드 페이지 (useState로 Mock 데이터 관리)
- `src/app/admin/layout.tsx` — App Router 레이아웃 (pass-through, 공개 NavBar/Footer 제외)

## 설계 결정 사항

- `admin/layout.tsx`는 단순 pass-through로 처리 (공개 레이아웃과 분리 목적)
- `AdminLayout.tsx`는 `use client` 컴포넌트 (로그아웃 useRouter 필요)
- `CourseAdminTable`에서 코스명 링크는 `/${categorySlug}/${course.id}` 형태로 구성
- `categoryColorMap`은 TrailCard의 패턴을 admin 컴포넌트에서 재정의 (카테고리 이름이 다름 주의)

## 주의: 카테고리 색상 매핑 불일치

TrailCard.tsx의 categoryColorMap은 "동해안", "남해안" 등 구버전 카테고리명 기준.
CourseAdminTable.tsx는 "해파랑길", "남파랑길", "서해랑길", "DMZ 평화의 길" (현재 타입 기준).
두 파일의 categoryColorMap이 다르므로 TrailCard는 수정하지 않도록 주의.
