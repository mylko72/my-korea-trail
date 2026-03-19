# ComponentsPage

> shadcn/ui 기반 UI 컴포넌트들의 실제 동작 예시와 복사 가능한 사용 코드를 제공하는 쇼케이스 페이지입니다.

## 개요

`src/app/components/page.tsx`는 `/components` 경로에서 접근할 수 있는 UI 컴포넌트 쇼케이스 페이지입니다.
개발자가 각 컴포넌트의 실제 동작을 직접 확인하고, 코드를 복사해 바로 프로젝트에 적용할 수 있도록 설계되었습니다.
클라이언트 컴포넌트(`"use client"`)로 선언되어 버튼 클릭, 폼 입력 등 모든 인터랙션을 처리합니다.

## 사용 방법

`/components` URL로 접속하면 자동으로 렌더링됩니다. 직접 import는 필요하지 않습니다.

## 포함된 컴포넌트 목록

| 섹션 | 컴포넌트 | 시연 내용 |
|------|----------|-----------|
| Button | `Button` | variant 6종, size 3종, 비활성/아이콘 포함 |
| Badge | `Badge` | variant 4종 |
| Card | `Card` | 기본 카드, 테두리 강조 카드 |
| Alert | `Alert` | 정보(default), 오류(destructive) |
| Toast | Sonner `toast` | 기본, success, error, warning, info |
| Modal | `Dialog` | 기본 모달, 테이블 행 연동 모달 |
| Form | `Input`, `Select`, `Checkbox`, `RadioGroup` | 다양한 입력 요소와 상태 |
| Table | `Table` | 사용자 목록, 행 클릭 → 모달 연동 |
| Accordion | `Accordion` | single 타입, multiple 타입 |
| Spinner | `Spinner` | sm, md, lg, xl 크기 |

## 내부 컴포넌트

### CodeBlock

코드를 다크 배경으로 표시하고 클립보드 복사 기능을 제공합니다.

```tsx
<CodeBlock code={`<Button variant="default">Primary</Button>`} />
```

| Props | 타입 | 필수 | 설명 |
|-------|------|:----:|------|
| code | string | ✅ | 표시할 코드 문자열 |

복사 버튼은 코드 블록 호버 시에만 나타납니다. 복사 성공 시 2초간 체크 아이콘으로 변경됩니다.

### ComponentSection

각 UI 컴포넌트 예시를 일관된 레이아웃으로 래핑하는 컴포넌트입니다.

```tsx
<ComponentSection
  title="Button"
  description="다양한 variant와 크기를 지원하는 버튼 컴포넌트입니다."
  code={`<Button>클릭</Button>`}
>
  <Button>클릭</Button>
</ComponentSection>
```

| Props | 타입 | 필수 | 설명 |
|-------|------|:----:|------|
| title | string | ✅ | 섹션 제목 (컴포넌트 이름) |
| description | string | ✅ | 컴포넌트 간단 설명 |
| children | React.ReactNode | ✅ | 실제 동작하는 미리보기 |
| code | string | ✅ | 복사 가능한 사용 예제 코드 |

## 상태 관리

| 상태 | 타입 | 설명 |
|------|------|------|
| `dialogOpen` | boolean | Dialog(모달)의 열림/닫힘 상태 |
| `checkboxChecked` | boolean | Checkbox의 체크 여부 |
| `radioValue` | string | RadioGroup의 선택된 값 |
| `selectValue` | string | Select의 선택된 값 |
| `selectedItem` | object \| null | 테이블 행 클릭 시 모달에 표시할 데이터 |

## 주요 로직 설명

### 테이블-모달 연동

테이블의 이름 셀을 클릭하면 해당 행의 데이터를 `selectedItem`에 저장하고 모달을 엽니다.

```tsx
<Button
  onClick={() => {
    setSelectedItem(row);   // 선택된 행 데이터를 상태에 저장
    setDialogOpen(true);    // 모달을 열기
  }}
  variant="link"
>
  {row.name}
</Button>
```

Dialog는 `TableBody` 밖에 분리해서 배치합니다. HTML 유효성 규칙상 `<table>` 안에 `<dialog>` 중첩이 허용되지 않기 때문입니다.

### Accordion 타입 차이

```tsx
// Single: 한 번에 하나의 항목만 열립니다. collapsible을 추가하면 열린 항목을 다시 클릭해 닫을 수 있습니다.
<Accordion type="single" collapsible>

// Multiple: 여러 항목을 동시에 열 수 있습니다.
<Accordion type="multiple">
```

### 폼 요소 controlled vs uncontrolled

```tsx
// Controlled: React state로 값을 직접 관리합니다.
<Checkbox checked={checkboxChecked} onCheckedChange={(v) => setCheckboxChecked(v === true)} />

// Uncontrolled: defaultChecked로 초기값만 지정하고 이후는 DOM이 관리합니다.
<Checkbox defaultChecked />
```

## 관련 파일

- [`src/utils/format.ts`](../../utils/format.ts) — `copyToClipboard` 유틸 함수
- [`src/components/ui/`](../../components/ui/) — 사용된 모든 shadcn/ui 컴포넌트 소스

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-03-09 | 한국어 주석 및 문서 추가 |
| 2026-03-09 | Accordion 섹션 추가 |
| 2026-03-09 | 최초 생성 |
