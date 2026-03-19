// UI 컴포넌트 목록 Mock 데이터

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "stable" | "beta" | "experimental";
  tags: string[];
}

export const components: ComponentItem[] = [
  {
    id: "button",
    name: "Button",
    description: "다양한 variant와 크기를 지원하는 버튼 컴포넌트. Primary, Secondary, Destructive, Outline, Ghost, Link 등의 스타일을 제공합니다.",
    category: "기본 요소",
    status: "stable",
    tags: ["interactive", "form", "cta"],
  },
  {
    id: "card",
    name: "Card",
    description: "콘텐츠를 담는 컨테이너 컴포넌트. Header, Content, Footer 영역으로 구성됩니다.",
    category: "레이아웃",
    status: "stable",
    tags: ["container", "layout"],
  },
  {
    id: "dialog",
    name: "Modal / Dialog",
    description: "오버레이 형태로 콘텐츠를 표시하는 모달 컴포넌트. 접근성을 고려한 포커스 트랩을 지원합니다.",
    category: "오버레이",
    status: "stable",
    tags: ["modal", "overlay", "dialog"],
  },
  {
    id: "input",
    name: "Input",
    description: "텍스트 입력을 위한 기본 Input 컴포넌트. 다양한 타입과 상태를 지원합니다.",
    category: "폼",
    status: "stable",
    tags: ["form", "input", "text"],
  },
  {
    id: "select",
    name: "Select",
    description: "옵션 목록에서 값을 선택하는 드롭다운 Select 컴포넌트입니다.",
    category: "폼",
    status: "stable",
    tags: ["form", "dropdown", "select"],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "체크/미체크 상태를 토글하는 Checkbox 컴포넌트. 중간 상태(indeterminate)도 지원합니다.",
    category: "폼",
    status: "stable",
    tags: ["form", "toggle", "boolean"],
  },
  {
    id: "radio-group",
    name: "Radio Group",
    description: "여러 옵션 중 하나를 선택하는 Radio 버튼 그룹 컴포넌트입니다.",
    category: "폼",
    status: "stable",
    tags: ["form", "selection", "radio"],
  },
  {
    id: "table",
    name: "Table",
    description: "데이터를 표 형태로 표시하는 Table 컴포넌트. 정렬과 다양한 열 타입을 지원합니다.",
    category: "데이터 표시",
    status: "stable",
    tags: ["data", "grid", "list"],
  },
  {
    id: "alert",
    name: "Alert",
    description: "중요한 정보나 경고를 표시하는 Alert 컴포넌트. Default, Destructive 등의 variant가 있습니다.",
    category: "피드백",
    status: "stable",
    tags: ["feedback", "notification", "status"],
  },
  {
    id: "toast",
    name: "Toast",
    description: "일시적인 알림을 화면 구석에 표시하는 Toast 컴포넌트입니다.",
    category: "피드백",
    status: "stable",
    tags: ["feedback", "notification", "temporary"],
  },
  {
    id: "badge",
    name: "Badge",
    description: "상태나 카테고리를 표시하는 작은 Badge 컴포넌트입니다.",
    category: "기본 요소",
    status: "stable",
    tags: ["status", "label", "tag"],
  },
  {
    id: "spinner",
    name: "Loading Spinner",
    description: "로딩 상태를 표시하는 Spinner 컴포넌트. 다양한 크기를 지원합니다.",
    category: "피드백",
    status: "stable",
    tags: ["loading", "async", "feedback"],
  },
];

// 카테고리 목록
export const componentCategories = [...new Set(components.map((c) => c.category))];
