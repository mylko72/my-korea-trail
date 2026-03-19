/**
 * API 문서 페이지 (API Docs Page)
 *
 * Mock API 엔드포인트의 구조와 사용 방법을 문서화하는 페이지입니다.
 * 실제 백엔드가 없어도 API 스펙을 미리 정의하고 참고할 수 있습니다.
 *
 * 페이지 구성:
 * 1. 데이터 구조 개요 — User, Product TypeScript 인터페이스 표시
 * 2. 샘플 데이터 — tableExampleData를 JSON으로 시각화
 * 3. 엔드포인트 목록 — 태그별 필터링 + 클릭으로 상세 펼치기
 * 4. Mock 데이터 사용 방법 — import 방법과 fetch 시뮬레이션 코드
 *
 * "use client" 선언 이유:
 * - 태그 필터 버튼 클릭 상태(activeTag) 관리
 * - 각 엔드포인트 카드의 펼침/접힘(expanded) 상태 관리
 * - 코드 복사 버튼 인터랙션
 */
"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Database, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiEndpoints, tableExampleData, apiTags, type ApiEndpoint } from "@/data/apiDocs";
import { getMethodColor, copyToClipboard } from "@/utils/format";

/**
 * CodeBlock 컴포넌트 (API 문서 전용)
 *
 * 코드를 다크 테마로 표시하고 클립보드 복사 기능을 제공합니다.
 * 상단 바에 언어 이름을 표시해 코드 유형을 명확히 합니다.
 * 복사 성공 시 Sonner 토스트 알림도 함께 표시합니다.
 *
 * @param code - 표시할 코드 문자열
 * @param language - 상단에 표시할 언어 이름 (기본값: "json")
 */
function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  // 복사 성공 상태: true일 때 아이콘이 체크마크로 변경됩니다.
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      toast.success("클립보드에 복사되었습니다.");
      // 2초 후 복사 아이콘을 원래대로 되돌립니다.
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      {/* 상단 바: 언어 표시와 복사 버튼 */}
      <div className="flex items-center justify-between bg-zinc-800 dark:bg-zinc-900 rounded-t-lg px-4 py-2">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
          onClick={handleCopy}
          aria-label="코드 복사"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      {/* 코드 본문: 다크 배경으로 가독성을 높입니다 */}
      <pre className="bg-zinc-900 rounded-b-lg p-4 text-sm font-mono overflow-x-auto text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * EndpointCard 컴포넌트
 *
 * 개별 API 엔드포인트를 카드 형태로 표시합니다.
 * 헤더 클릭 시 상세 정보(파라미터, 예시 코드)를 토글로 펼칩니다.
 * 접힌 상태에서는 HTTP 메서드, 경로, 설명만 간략히 보여줍니다.
 *
 * @param endpoint - 표시할 API 엔드포인트 데이터 (ApiEndpoint 타입)
 */
function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  // 카드의 펼침/접힘 상태를 독립적으로 관리합니다.
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      {/* 헤더 영역: button 태그로 감싸 키보드 접근성을 확보합니다 */}
      <button
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <CardHeader className="hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/*
                HTTP 메서드 배지: getMethodColor()로 GET(녹색), POST(파란색) 등
                메서드별 색상을 적용합니다.
              */}
              <span className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-bold font-mono ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              {/* truncate: 경로가 길면 말줄임표(...)로 처리합니다 */}
              <code className="text-sm font-mono text-foreground truncate">{endpoint.path}</code>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* 태그 배지: sm 이상에서만 표시합니다 (모바일에서 공간 절약) */}
              {endpoint.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs hidden sm:flex">
                  {tag}
                </Badge>
              ))}
              {/* 펼침 상태 아이콘: 화살표 방향으로 열림/닫힘을 표현합니다 */}
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-left mt-1">{endpoint.description}</p>
        </CardHeader>
      </button>

      {/* 상세 정보 영역: expanded가 true일 때만 렌더링됩니다 */}
      {expanded && (
        <CardContent className="border-t border-border pt-6 space-y-6">

          {/* Path Parameters: URL 경로에 포함되는 파라미터 (예: /users/:id의 id) */}
          {endpoint.pathParams && endpoint.pathParams.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                경로 파라미터 (Path Parameters)
              </h4>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium">파라미터</th>
                      <th className="px-4 py-2 text-left font-medium">타입</th>
                      <th className="px-4 py-2 text-left font-medium">필수</th>
                      <th className="px-4 py-2 text-left font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.pathParams.map((param, idx) => (
                      // 짝수/홀수 행을 번갈아 배경색을 달리해 가독성을 높입니다
                      <tr key={param.name} className={idx % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-primary">{param.name}</code>
                        </td>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-muted-foreground">{param.type}</code>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={param.required ? "default" : "outline"} className="text-xs">
                            {param.required ? "필수" : "선택"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Query Parameters: URL 쿼리스트링으로 전달되는 파라미터 (예: ?page=1&limit=10) */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                쿼리 파라미터 (Query Parameters)
              </h4>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium">파라미터</th>
                      <th className="px-4 py-2 text-left font-medium">타입</th>
                      <th className="px-4 py-2 text-left font-medium">필수</th>
                      <th className="px-4 py-2 text-left font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.queryParams.map((param, idx) => (
                      <tr key={param.name} className={idx % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-primary">{param.name}</code>
                        </td>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-muted-foreground">{param.type}</code>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={param.required ? "default" : "outline"} className="text-xs">
                            {param.required ? "필수" : "선택"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body: POST/PUT 요청 시 전송하는 JSON 본문 필드 */}
          {endpoint.requestBody && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                요청 본문 (Request Body)
              </h4>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-medium">필드</th>
                      <th className="px-4 py-2 text-left font-medium">타입</th>
                      <th className="px-4 py-2 text-left font-medium">필수</th>
                      <th className="px-4 py-2 text-left font-medium">설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*
                      Object.entries()로 requestBody.properties 객체를 배열로 변환해
                      각 필드를 테이블 행으로 렌더링합니다.
                    */}
                    {Object.entries(endpoint.requestBody.properties ?? {}).map(([key, prop], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? "" : "bg-muted/30"}>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-primary">{key}</code>
                        </td>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono text-muted-foreground">{prop.type}</code>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={prop.required ? "default" : "outline"} className="text-xs">
                            {prop.required ? "필수" : "선택"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 예시 코드: 요청(Request Body)과 응답(Response) JSON 예시 */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              예시 코드
            </h4>
            <div className="space-y-3">
              {/* 요청 예시는 있을 때만 표시합니다 (GET 요청은 보통 없음) */}
              {endpoint.example.request && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Request Body</p>
                  <CodeBlock code={endpoint.example.request} />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Response</p>
                <CodeBlock code={endpoint.example.response} />
              </div>
            </div>
          </div>

        </CardContent>
      )}
    </Card>
  );
}

/**
 * ApiDocsPage 컴포넌트
 *
 * API 문서 페이지의 최상위 컴포넌트입니다.
 * activeTag 상태로 엔드포인트 목록을 태그별로 필터링합니다.
 */
export default function ApiDocsPage() {
  // 현재 선택된 태그 필터 ("all"이면 전체 표시)
  const [activeTag, setActiveTag] = useState<string>("all");

  // 선택된 태그에 해당하는 엔드포인트만 필터링합니다.
  const filteredEndpoints = activeTag === "all"
    ? apiEndpoints
    : apiEndpoints.filter((e) => e.tags.includes(activeTag));

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">

      {/* 페이지 헤더 */}
      <div className="mb-12">
        <Badge variant="secondary" className="mb-4">Mock API</Badge>
        <h1 className="text-4xl font-bold mb-4">API 문서</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          정적 Mock 데이터 기반의 API 엔드포인트 구조를 설명합니다.
          실제 백엔드 연동 시 아래 스펙을 참고하세요.
        </p>
      </div>

      <Separator className="mb-12" />

      {/* =========================================================
          데이터 구조 개요 섹션
          User와 Product의 TypeScript 인터페이스를 보여줍니다.
          실제 API 연동 시 이 구조를 기반으로 타입을 정의하세요.
          ========================================================= */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">데이터 구조 개요</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User 모델 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-base">User 모델</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
  createdAt: string; // ISO 8601
  updatedAt?: string;
}`}
              />
            </CardContent>
          </Card>

          {/* Product 모델 카드 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-base">Product 모델</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  createdAt: string;
}`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =========================================================
          샘플 데이터 섹션
          tableExampleData를 JSON.stringify로 직렬화해 표시합니다.
          null, 2 파라미터로 2칸 들여쓰기를 적용해 가독성을 높입니다.
          ========================================================= */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">샘플 데이터</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">사용자 목록 (tableExampleData)</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={JSON.stringify(tableExampleData, null, 2)} />
          </CardContent>
        </Card>
      </section>

      {/* =========================================================
          API 엔드포인트 목록 섹션
          태그 필터 버튼으로 특정 도메인(Users, Products 등)만 볼 수 있습니다.
          각 EndpointCard는 독립적인 펼침/접힘 상태를 가집니다.
          ========================================================= */}
      <section>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">엔드포인트</h2>

          {/* 태그 필터 버튼 그룹 */}
          <div className="flex gap-2 flex-wrap">
            {/* 전체 보기 버튼 */}
            <Button
              variant={activeTag === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag("all")}
            >
              전체
            </Button>
            {/* apiTags 배열을 순회하며 태그별 필터 버튼을 렌더링합니다 */}
            {apiTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* 필터링된 엔드포인트 목록 */}
        <div className="space-y-4">
          {filteredEndpoints.map((endpoint) => (
            <EndpointCard key={endpoint.id} endpoint={endpoint} />
          ))}
        </div>
      </section>

      {/* =========================================================
          Mock 데이터 사용 방법 섹션
          실제 개발 시 Mock 데이터를 어떻게 import하고
          비동기 fetch처럼 시뮬레이션할 수 있는지 예시를 제공합니다.
          ========================================================= */}
      <section className="mt-12 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-6">Mock 데이터 사용 방법</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 데이터 Import 예시 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">데이터 Import</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`// 데이터 임포트
import { tableExampleData } from "@/data/apiDocs";
import { components } from "@/data/components";

// 컴포넌트에서 사용
export default function UserList() {
  return (
    <ul>
      {tableExampleData.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`}
              />
            </CardContent>
          </Card>

          {/* fetch 시뮬레이션 예시 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">fetch 시뮬레이션</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`// 비동기 처리 시뮬레이션
import { tableExampleData } from "@/data/apiDocs";

async function fetchUsers() {
  // 실제 API 호출을 시뮬레이션
  await new Promise((r) => setTimeout(r, 500));
  return tableExampleData;
}

// React에서 사용
const [users, setUsers] = useState([]);
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);`}
              />
            </CardContent>
          </Card>

        </div>
      </section>

    </div>
  );
}
