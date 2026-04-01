/**
 * 카테고리 필터링 디버깅 Route Handler
 *
 * /api/debug/category?category=해파랑길 에 접속하여 카테고리 필터링을 테스트합니다.
 */

import { getPostsByCategory } from "@/lib/notion";
import type { TrailCategory } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") as TrailCategory | null;

    if (!category) {
      return Response.json({ error: "카테고리 파라미터가 없습니다" });
    }

    const result = await getPostsByCategory(category);

    return Response.json({
      category,
      results_count: result.length,
      posts: result.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        slug: p.slug,
      })),
    });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      details: error.toString(),
    });
  }
}
