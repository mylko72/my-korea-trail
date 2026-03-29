---
name: Notion API 에러 핸들링 패턴
description: Notion API 미설정(unauthorized) 상태에서도 npm run build가 성공하려면 모든 API 호출을 try-catch로 감싸야 함
type: project
---

모든 Server Component에서 Notion API 함수 호출 시 반드시 try-catch로 감싸야 한다.

**Why:** `.env.local`에 `NOTION_API_TOKEN`이 없거나 유효하지 않으면 빌드 타임에 `APIResponseError: API token is invalid.` 에러가 발생하여 `npm run build`가 실패한다. Phase 5 API 연동 전까지는 빈 배열/null 폴백으로 렌더링해야 한다.

**How to apply:** 카테고리 페이지, 상세 페이지 등 Notion API를 호출하는 모든 Server Component에서 아래 패턴을 사용한다.

```ts
let posts: TrailPost[] = [];
try {
  posts = await getPostsByCategory(categoryName);
} catch {
  // Notion API 에러 시 빈 목록으로 안전하게 렌더링
}
```

`generateStaticParams`에서도 동일하게 처리하고, API 실패 시 Mock 경로만 반환하는 폴백을 둔다.
