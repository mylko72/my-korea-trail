---
name: next/image remotePatterns 설정
description: next.config.ts의 images.remotePatterns에 등록된 허용 호스트 목록
type: project
---

`next.config.ts`에 현재 등록된 이미지 호스트 목록:

- `www.notion.so` — Notion 이미지
- `prod-files-secure.s3.us-west-2.amazonaws.com` — Notion S3 파일
- `s3.us-west-2.amazonaws.com` — Notion S3 파일(대안)
- `images.unsplash.com` — 개발/Mock 데이터용 Unsplash 이미지

**Why:** `next/image`는 허용되지 않은 외부 호스트의 이미지를 차단한다. Mock 데이터에 Unsplash URL을 사용하면 반드시 등록해야 하며, 미등록 시 런타임 에러가 발생한다.

**How to apply:** 새로운 외부 이미지 소스(예: Cloudinary, Imgur 등)를 추가할 때마다 `next.config.ts`의 `remotePatterns` 배열에 추가해야 한다.
