// API 문서 Mock 데이터

export interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: ApiSchema;
  responseSchema: ApiSchema;
  queryParams?: ApiParam[];
  pathParams?: ApiParam[];
  tags: string[];
  example: {
    request?: string;
    response: string;
  };
}

export interface ApiSchema {
  type: string;
  properties?: Record<string, ApiProperty>;
  example?: unknown;
}

export interface ApiProperty {
  type: string;
  description: string;
  required?: boolean;
  enum?: string[];
  format?: string;
}

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

// 정적 API 엔드포인트 데이터
export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "get-users",
    method: "GET",
    path: "/api/users",
    description: "모든 사용자 목록을 반환합니다.",
    queryParams: [
      { name: "page", type: "number", required: false, description: "페이지 번호 (기본값: 1)" },
      { name: "limit", type: "number", required: false, description: "페이지당 항목 수 (기본값: 10)" },
      { name: "search", type: "string", required: false, description: "사용자 이름 또는 이메일 검색어" },
    ],
    responseSchema: {
      type: "object",
      properties: {
        data: { type: "User[]", description: "사용자 배열" },
        total: { type: "number", description: "전체 사용자 수" },
        page: { type: "number", description: "현재 페이지" },
        limit: { type: "number", description: "페이지당 항목 수" },
      },
    },
    tags: ["users"],
    example: {
      response: JSON.stringify(
        {
          data: [
            { id: 1, name: "홍길동", email: "hong@example.com", role: "admin", createdAt: "2024-01-01" },
            { id: 2, name: "김철수", email: "kim@example.com", role: "user", createdAt: "2024-01-15" },
          ],
          total: 2,
          page: 1,
          limit: 10,
        },
        null,
        2
      ),
    },
  },
  {
    id: "get-user",
    method: "GET",
    path: "/api/users/:id",
    description: "특정 사용자의 상세 정보를 반환합니다.",
    pathParams: [
      { name: "id", type: "number", required: true, description: "사용자 고유 ID" },
    ],
    responseSchema: {
      type: "User",
      properties: {
        id: { type: "number", description: "사용자 고유 ID" },
        name: { type: "string", description: "사용자 이름" },
        email: { type: "string", description: "이메일 주소", format: "email" },
        role: { type: "string", description: "역할", enum: ["admin", "user", "guest"] },
        createdAt: { type: "string", description: "계정 생성일", format: "date" },
      },
    },
    tags: ["users"],
    example: {
      response: JSON.stringify(
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          role: "admin",
          createdAt: "2024-01-01",
        },
        null,
        2
      ),
    },
  },
  {
    id: "create-user",
    method: "POST",
    path: "/api/users",
    description: "새로운 사용자를 생성합니다.",
    requestBody: {
      type: "object",
      properties: {
        name: { type: "string", description: "사용자 이름", required: true },
        email: { type: "string", description: "이메일 주소", required: true, format: "email" },
        password: { type: "string", description: "비밀번호 (8자 이상)", required: true },
        role: { type: "string", description: "역할", enum: ["admin", "user", "guest"] },
      },
    },
    responseSchema: {
      type: "User",
      properties: {
        id: { type: "number", description: "생성된 사용자 ID" },
        name: { type: "string", description: "사용자 이름" },
        email: { type: "string", description: "이메일 주소" },
        role: { type: "string", description: "역할" },
        createdAt: { type: "string", description: "계정 생성일" },
      },
    },
    tags: ["users"],
    example: {
      request: JSON.stringify(
        {
          name: "이영희",
          email: "lee@example.com",
          password: "securePassword123",
          role: "user",
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          id: 3,
          name: "이영희",
          email: "lee@example.com",
          role: "user",
          createdAt: "2024-03-01",
        },
        null,
        2
      ),
    },
  },
  {
    id: "update-user",
    method: "PATCH",
    path: "/api/users/:id",
    description: "사용자 정보를 부분 업데이트합니다.",
    pathParams: [
      { name: "id", type: "number", required: true, description: "사용자 고유 ID" },
    ],
    requestBody: {
      type: "object",
      properties: {
        name: { type: "string", description: "사용자 이름" },
        email: { type: "string", description: "이메일 주소", format: "email" },
        role: { type: "string", description: "역할", enum: ["admin", "user", "guest"] },
      },
    },
    responseSchema: {
      type: "User",
      properties: {
        id: { type: "number", description: "사용자 ID" },
        name: { type: "string", description: "업데이트된 이름" },
        email: { type: "string", description: "업데이트된 이메일" },
        role: { type: "string", description: "역할" },
        updatedAt: { type: "string", description: "업데이트 시간" },
      },
    },
    tags: ["users"],
    example: {
      request: JSON.stringify({ name: "홍길동 수정" }, null, 2),
      response: JSON.stringify(
        {
          id: 1,
          name: "홍길동 수정",
          email: "hong@example.com",
          role: "admin",
          updatedAt: "2024-03-15",
        },
        null,
        2
      ),
    },
  },
  {
    id: "delete-user",
    method: "DELETE",
    path: "/api/users/:id",
    description: "사용자를 삭제합니다.",
    pathParams: [
      { name: "id", type: "number", required: true, description: "삭제할 사용자 ID" },
    ],
    responseSchema: {
      type: "object",
      properties: {
        success: { type: "boolean", description: "삭제 성공 여부" },
        message: { type: "string", description: "결과 메시지" },
      },
    },
    tags: ["users"],
    example: {
      response: JSON.stringify(
        {
          success: true,
          message: "사용자가 성공적으로 삭제되었습니다.",
        },
        null,
        2
      ),
    },
  },
  {
    id: "get-products",
    method: "GET",
    path: "/api/products",
    description: "상품 목록을 반환합니다.",
    queryParams: [
      { name: "category", type: "string", required: false, description: "카테고리 필터" },
      { name: "minPrice", type: "number", required: false, description: "최소 가격" },
      { name: "maxPrice", type: "number", required: false, description: "최대 가격" },
    ],
    responseSchema: {
      type: "object",
      properties: {
        data: { type: "Product[]", description: "상품 배열" },
        total: { type: "number", description: "전체 상품 수" },
      },
    },
    tags: ["products"],
    example: {
      response: JSON.stringify(
        {
          data: [
            { id: 1, name: "노트북", price: 1200000, category: "전자기기", stock: 50 },
            { id: 2, name: "마우스", price: 35000, category: "주변기기", stock: 200 },
          ],
          total: 2,
        },
        null,
        2
      ),
    },
  },
];

// 테이블 예시 데이터
export const tableExampleData = [
  { id: 1, name: "홍길동", email: "hong@example.com", role: "admin", status: "active" },
  { id: 2, name: "김철수", email: "kim@example.com", role: "user", status: "active" },
  { id: 3, name: "이영희", email: "lee@example.com", role: "user", status: "inactive" },
  { id: 4, name: "박민준", email: "park@example.com", role: "guest", status: "active" },
  { id: 5, name: "최수연", email: "choi@example.com", role: "user", status: "active" },
];

// API 태그 목록
export const apiTags = [...new Set(apiEndpoints.flatMap((e) => e.tags))];
