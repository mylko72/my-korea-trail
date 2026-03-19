# ApiDocsPage

> Mock API 엔드포인트 구조, 데이터 모델, 사용 방법을 문서화하는 API 레퍼런스 페이지입니다.

## 개요

`src/app/api-docs/page.tsx`는 `/api-docs` 경로에서 접근할 수 있는 API 문서 페이지입니다.
실제 백엔드 서버 없이도 API 스펙을 미리 정의하고 팀원과 공유할 수 있도록 설계된 Mock API 문서입니다.
각 엔드포인트를 카드 형태로 나열하고, 클릭 시 파라미터와 예시 코드를 펼쳐서 확인할 수 있습니다.

## 사용 방법

`/api-docs` URL로 접속하면 자동으로 렌더링됩니다. 직접 import는 필요하지 않습니다.

## 페이지 섹션 구조

| 섹션 | 역할 |
|------|------|
| 데이터 구조 개요 | User, Product TypeScript 인터페이스 표시 |
| 샘플 데이터 | `tableExampleData`를 JSON으로 시각화 |
| 엔드포인트 목록 | 태그 필터 + EndpointCard 목록 |
| Mock 데이터 사용 방법 | import 코드, fetch 시뮬레이션 예시 |

## 내부 컴포넌트

### CodeBlock

API 문서 전용 다크 테마 코드 블록입니다. 상단 바에 언어 이름과 복사 버튼을 표시합니다.

```tsx
<CodeBlock code={`{ "id": 1, "name": "홍길동" }`} language="json" />
<CodeBlock code={`interface User { id: number; }`} language="typescript" />
```

| Props | 타입 | 필수 | 기본값 | 설명 |
|-------|------|:----:|--------|------|
| code | string | ✅ | - | 표시할 코드 문자열 |
| language | string | ❌ | `"json"` | 상단 바에 표시될 언어 이름 |

### EndpointCard

개별 API 엔드포인트를 카드 형태로 표시합니다. 헤더 클릭으로 상세 정보를 토글합니다.

```tsx
<EndpointCard endpoint={endpoint} />
```

| Props | 타입 | 필수 | 설명 |
|-------|------|:----:|------|
| endpoint | ApiEndpoint | ✅ | 표시할 엔드포인트 데이터 |

카드 헤더에는 HTTP 메서드, 경로, 설명이 표시됩니다.
카드를 펼치면 Path Parameters, Query Parameters, Request Body, 예시 코드가 나타납니다.

## 상태 관리

| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `activeTag` | string | `"all"` | 현재 선택된 태그 필터 |
| `expanded` (EndpointCard 내부) | boolean | false | 각 카드의 펼침/접힘 상태 |

## 주요 로직 설명

### 태그 필터링

```tsx
const filteredEndpoints = activeTag === "all"
  ? apiEndpoints
  : apiEndpoints.filter((e) => e.tags.includes(activeTag));
```

`activeTag`가 `"all"`이면 전체 엔드포인트를, 특정 태그면 해당 태그를 포함하는 엔드포인트만 표시합니다.

### HTTP 메서드 색상 구분

```tsx
<span className={`... ${getMethodColor(endpoint.method)}`}>
  {endpoint.method}
</span>
```

`getMethodColor()` 유틸 함수로 메서드별 색상을 적용합니다.

| 메서드 | 색상 |
|--------|------|
| GET | 초록색 |
| POST | 파란색 |
| PUT | 노란색 |
| DELETE | 빨간색 |

### Request Body 렌더링

```tsx
{Object.entries(endpoint.requestBody.properties ?? {}).map(([key, prop], idx) => (
  <tr key={key}>
    <td>{key}</td>
    <td>{prop.type}</td>
  </tr>
))}
```

`requestBody.properties` 객체를 `Object.entries()`로 키-값 배열로 변환해 테이블 행으로 렌더링합니다.
`?? {}`으로 properties가 undefined일 때 빈 객체로 폴백 처리합니다.

### 샘플 데이터 직렬화

```tsx
<CodeBlock code={JSON.stringify(tableExampleData, null, 2)} />
```

`JSON.stringify(data, null, 2)`: 두 번째 인자 `null`은 replacer(변환 함수) 미사용, 세 번째 인자 `2`는 들여쓰기 칸 수입니다.
배열 데이터를 사람이 읽기 쉬운 형식의 JSON 문자열로 변환합니다.

## 데이터 모델

### ApiEndpoint 타입

```typescript
interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  tags: string[];
  pathParams?: ParamDef[];
  queryParams?: ParamDef[];
  requestBody?: RequestBodyDef;
  example: {
    request?: string;
    response: string;
  };
}
```

엔드포인트 데이터는 `src/data/apiDocs.ts`에서 관리합니다. 새 엔드포인트 추가 시 해당 파일을 수정하세요.

## 관련 파일

- [`src/data/apiDocs.ts`](../../data/apiDocs.ts) — 엔드포인트 Mock 데이터, apiTags, tableExampleData 정의
- [`src/utils/format.ts`](../../utils/format.ts) — `getMethodColor`, `copyToClipboard` 유틸 함수

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-03-09 | 한국어 주석 및 문서 추가 |
| 2026-03-09 | 최초 생성 |
