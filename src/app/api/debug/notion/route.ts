/**
 * Notion API 디버깅 Route Handler
 *
 * /api/debug/notion에 접속하여 Notion API 호출 상태를 확인할 수 있습니다.
 */

import { Client } from "@notionhq/client";

export async function GET() {
  try {
    const TOKEN = process.env.NOTION_API_TOKEN;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    const debug: any = {
      timestamp: new Date().toISOString(),
      env: {
        TOKEN_SET: !!TOKEN,
        DATABASE_ID,
      },
      steps: [],
    };

    // Step 1: 클라이언트 초기화
    debug.steps.push({
      step: "Client initialization",
      status: "OK",
    });

    const notion = new Client({ auth: TOKEN });

    // Step 2: search() 호출
    debug.steps.push({
      step: "Calling notion.search()",
      status: "Calling...",
    });

    const response = await notion.search({
      filter: { value: "page", property: "object" },
      page_size: 100,
    });

    debug.steps[debug.steps.length - 1].status = "OK";
    debug.steps[debug.steps.length - 1].results_count = response.results.length;
    debug.steps[debug.steps.length - 1].has_more = response.has_more;

    // Step 3: 데이터베이스 필터링
    debug.steps.push({
      step: "Filtering by DATABASE_ID",
      status: "Filtering...",
    });

    let filteredPages = response.results.filter((page: any) => {
      if (page.object !== "page") return false;

      const normalizedDbId = DATABASE_ID?.replace(/-/g, "");
      const pageDbId = page.parent?.database_id?.replace(/-/g, "");

      // parent.type이 "database_id" 또는 "data_source_id"일 수 있음
      const isValidParentType =
        page.parent?.type === "database_id" ||
        page.parent?.type === "data_source_id";

      return isValidParentType && pageDbId === normalizedDbId;
    });

    debug.steps[debug.steps.length - 1].status = "OK";
    debug.steps[debug.steps.length - 1].filtered_count = filteredPages.length;
    debug.steps[debug.steps.length - 1].all_parent_database_ids = [
      ...new Set(
        response.results
          .filter((p: any) => p.parent?.type === "database_id")
          .map((p: any) => p.parent.database_id)
      ),
    ];

    // Step 4: Published 필터링
    debug.steps.push({
      step: "Filtering by Published=true",
      status: "Filtering...",
    });

    const publishedPages = filteredPages.filter(
      (page: any) => page.properties?.Published?.checkbox === true
    );

    debug.steps[debug.steps.length - 1].status = "OK";
    debug.steps[debug.steps.length - 1].published_count = publishedPages.length;

    // Step 5: 샘플 페이지 정보
    if (publishedPages.length > 0) {
      debug.steps.push({
        step: "Sample page info",
        status: "OK",
        sample: {
          id: publishedPages[0].id,
          title:
            publishedPages[0].properties?.Title?.title?.[0]?.plain_text ||
            "No title",
          published:
            publishedPages[0].properties?.Published?.checkbox,
          category:
            publishedPages[0].properties?.Category?.select?.name ||
            "No category",
        },
      });
    }

    // Step 6: 첫 번째 페이지 상세 정보
    const firstPage = response.results[0];
    if (firstPage) {
      debug.steps.push({
        step: "First page detailed info",
        status: "OK",
        id: firstPage.id,
        object: firstPage.object,
        parent: firstPage.parent,
        properties: Object.keys(firstPage.properties || {}),
        first_page_has_published:
          "Published" in (firstPage.properties || {}),
      });
    }

    // Step 7: databases.query 시도 (v5에서 지원 안 할 수도)
    debug.steps.push({
      step: "Trying databases.query",
      status: "Trying...",
    });

    try {
      const dbResult = await (notion.databases as any).query({
        database_id: DATABASE_ID,
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        page_size: 10,
      });

      debug.steps[debug.steps.length - 1].status = "OK";
      debug.steps[debug.steps.length - 1].query_results_count =
        dbResult.results.length;
      debug.steps[debug.steps.length - 1].query_has_more = dbResult.has_more;

      if (dbResult.results.length > 0) {
        debug.steps[debug.steps.length - 1].sample_from_query = {
          id: dbResult.results[0].id,
          title:
            dbResult.results[0].properties?.Title?.title?.[0]?.plain_text ||
            "No title",
          published: dbResult.results[0].properties?.Published?.checkbox,
          category:
            dbResult.results[0].properties?.Category?.select?.name ||
            "No category",
        };
      }
    } catch (dbError: any) {
      debug.steps[debug.steps.length - 1].status = "FAILED";
      debug.steps[debug.steps.length - 1].error = dbError.message;
    }

    return Response.json(debug);
  } catch (error: any) {
    return Response.json({
      error: error.message,
      details: error.toString(),
      timestamp: new Date().toISOString(),
    });
  }
}
