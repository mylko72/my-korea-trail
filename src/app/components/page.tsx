/**
 * UI 컴포넌트 쇼케이스 페이지 (Components Page)
 *
 * shadcn/ui 기반 UI 컴포넌트들의 실제 동작 예시와 사용 코드를 보여주는 페이지입니다.
 * 각 컴포넌트를 직접 사용해보고 코드를 복사할 수 있어 개발 참고용으로 활용됩니다.
 *
 * 포함된 컴포넌트:
 * - Button (variant, size, 상태)
 * - Badge (variant)
 * - Card (기본, 강조)
 * - Alert (정보, 오류)
 * - Toast/Sonner (기본, 성공, 오류, 경고, 정보)
 * - Modal/Dialog (기본 모달, 테이블 행 클릭 모달)
 * - Form 요소 (Input, Select, Checkbox, RadioGroup)
 * - Table (사용자 목록, 행 클릭 시 모달 연동)
 * - Accordion (single, multiple 타입)
 * - Loading Spinner (sm, md, lg, xl 크기)
 *
 * "use client" 선언 이유:
 * useState로 다이얼로그/폼 요소의 상태를 관리하고,
 * 버튼 클릭 등 사용자 인터랙션을 처리하기 때문입니다.
 */
"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, Info, Terminal, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { copyToClipboard } from "@/utils/format";

/**
 * 테이블 예시 데이터
 * 실제 프로젝트에서는 API에서 데이터를 가져오지만,
 * 이 쇼케이스에서는 정적 데이터로 UI 동작을 시연합니다.
 */
const tableData = [
  { id: 1, name: "홍길동", email: "hong@example.com", role: "Admin", status: "활성" },
  { id: 2, name: "김철수", email: "kim@example.com", role: "User", status: "활성" },
  { id: 3, name: "이영희", email: "lee@example.com", role: "User", status: "비활성" },
  { id: 4, name: "박민준", email: "park@example.com", role: "Guest", status: "활성" },
];

/**
 * CodeBlock 컴포넌트
 *
 * 코드를 보기 좋게 표시하고 클립보드 복사 기능을 제공합니다.
 * 호버 시 복사 버튼이 나타나고, 복사 성공 시 체크 아이콘으로 교체됩니다.
 * 2초 후 다시 복사 아이콘으로 돌아옵니다.
 *
 * @param code - 표시할 코드 문자열
 */
function CodeBlock({ code }: { code: string }) {
  // 복사 성공 여부를 일시적으로 표시하기 위한 상태입니다.
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      // 2초 후 복사 아이콘을 원래대로 되돌립니다.
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    // group 클래스: 부모 hover 시 자식의 opacity를 변경하는 Tailwind 패턴입니다.
    <div className="relative group">
      <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground border border-border">
        <code>{code}</code>
      </pre>
      {/* 평소에는 투명(opacity-0), hover 시에만 보이는 복사 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
        aria-label="코드 복사"
      >
        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}

/**
 * ComponentSection 컴포넌트
 *
 * 각 UI 컴포넌트 예시를 일관된 레이아웃으로 감싸는 래퍼 컴포넌트입니다.
 * 제목, 설명, 실제 미리보기, 사용 예제 코드를 하나의 섹션으로 묶어줍니다.
 *
 * @param title - 섹션 제목 (컴포넌트 이름)
 * @param description - 컴포넌트에 대한 간단한 설명
 * @param children - 실제 컴포넌트 미리보기 내용
 * @param code - 복사 가능한 사용 예제 코드
 */
function ComponentSection({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <section className="mb-14">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          {/* 점선 테두리로 미리보기 영역을 시각적으로 구분합니다 */}
          <div className="mb-6 p-6 rounded-lg border border-dashed border-border bg-background">
            {children}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">사용 예제</p>
            <CodeBlock code={code} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * ComponentsPage 컴포넌트
 *
 * 페이지 레벨 컴포넌트로, 모든 UI 쇼케이스 섹션을 순서대로 렌더링합니다.
 * 다이얼로그, 폼 요소 등의 상태를 이 컴포넌트에서 중앙 관리합니다.
 */
export default function ComponentsPage() {
  // 모달(Dialog)의 열림/닫힘 상태
  const [dialogOpen, setDialogOpen] = useState(false);

  // Checkbox의 체크 여부 상태
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  // RadioGroup의 선택된 값 상태
  const [radioValue, setRadioValue] = useState("option1");

  // Select의 선택된 값 상태
  const [selectValue, setSelectValue] = useState("");

  // 테이블 행 클릭 시 모달에 표시할 선택된 데이터 (초기값: null)
  const [selectedItem, setSelectedItem] = useState<{name: string, email: string, role: string, status: string} | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">

      {/* 페이지 헤더 */}
      <div className="mb-12">
        <Badge variant="secondary" className="mb-4">shadcn/ui</Badge>
        <h1 className="text-4xl font-bold mb-4">UI 컴포넌트</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          shadcn/ui 기반의 재사용 가능한 UI 컴포넌트 목록입니다.
          각 컴포넌트의 사용 예시와 코드를 확인하세요.
        </p>
      </div>

      <Separator className="mb-12" />

      {/* =========================================================
          Button 섹션
          variant(default, secondary, destructive, outline, ghost, link)와
          size(sm, default, lg) 조합 예시를 보여줍니다.
          ========================================================= */}
      <ComponentSection
        title="Button"
        description="다양한 variant와 크기를 지원하는 버튼 컴포넌트입니다."
        code={`import { Button } from "@/components/ui/button";

// Variant 예시
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// 크기 예시
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">Variant</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">Size</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">상태</p>
            <div className="flex flex-wrap gap-3">
              <Button disabled>비활성화</Button>
              <Button>
                <Terminal className="mr-2 h-4 w-4" />
                아이콘 포함
              </Button>
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* =========================================================
          Badge 섹션
          상태, 카테고리, 레이블 표시에 사용하는 소형 배지입니다.
          ========================================================= */}
      <ComponentSection
        title="Badge"
        description="상태나 카테고리를 표시하는 작은 배지 컴포넌트입니다."
        code={`import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </ComponentSection>

      {/* =========================================================
          Card 섹션
          콘텐츠를 그룹핑하는 카드 컨테이너입니다.
          Header, Content, Footer 영역을 조합해서 사용합니다.
          ========================================================= */}
      <ComponentSection
        title="Card"
        description="콘텐츠를 담는 컨테이너 컴포넌트. Header, Content, Footer 영역으로 구성됩니다."
        code={`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    <p>카드 본문 내용</p>
  </CardContent>
  <CardFooter>
    <Button>확인</Button>
  </CardFooter>
</Card>`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 기본 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
              <CardDescription>카드 설명 텍스트가 여기에 표시됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">카드 본문 내용을 여기에 작성하세요.</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm">확인</Button>
              <Button size="sm" variant="outline">취소</Button>
            </CardFooter>
          </Card>

          {/* border-primary로 테두리를 강조한 카드 */}
          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-1" variant="secondary">추천</Badge>
              <CardTitle>강조된 카드</CardTitle>
              <CardDescription>테두리를 활용해 강조할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">중요한 정보를 강조할 때 사용합니다.</p>
            </CardContent>
          </Card>
        </div>
      </ComponentSection>

      {/* =========================================================
          Alert 섹션
          사용자에게 중요한 정보나 경고를 인라인으로 표시합니다.
          Toast와 달리 페이지 내에 고정 표시됩니다.
          ========================================================= */}
      <ComponentSection
        title="Alert"
        description="중요한 정보나 경고를 표시하는 Alert 컴포넌트입니다."
        code={`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>정보</AlertTitle>
  <AlertDescription>일반적인 안내 메시지입니다.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>오류</AlertTitle>
  <AlertDescription>오류 메시지입니다.</AlertDescription>
</Alert>`}
      >
        <div className="space-y-4">
          {/* 일반 정보 Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>정보</AlertTitle>
            <AlertDescription>이것은 일반적인 안내 메시지입니다. 사용자에게 중요한 정보를 전달합니다.</AlertDescription>
          </Alert>

          {/* 오류(destructive) Alert: 빨간색으로 위험 상황을 강조합니다 */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.</AlertDescription>
          </Alert>
        </div>
      </ComponentSection>

      {/* =========================================================
          Toast 섹션
          화면 우측 하단에 일시적으로 나타나는 알림 메시지입니다.
          Sonner 라이브러리를 사용하며, layout.tsx의 <Toaster>가 필요합니다.
          ========================================================= */}
      <ComponentSection
        title="Toast (Sonner)"
        description="일시적인 알림을 화면 구석에 표시하는 Toast 컴포넌트입니다."
        code={`import { toast } from "sonner";

// 다양한 Toast 유형
toast("기본 메시지입니다.");
toast.success("성공적으로 처리되었습니다!");
toast.error("오류가 발생했습니다.");
toast.warning("주의가 필요합니다.");
toast.info("참고할 정보입니다.");`}
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => toast("기본 메시지입니다.")}>
            기본 Toast
          </Button>
          <Button variant="outline" onClick={() => toast.success("성공적으로 처리되었습니다!")}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            성공
          </Button>
          <Button variant="outline" onClick={() => toast.error("오류가 발생했습니다.")}>
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            오류
          </Button>
          <Button variant="outline" onClick={() => toast.warning("주의가 필요합니다.")}>
            경고
          </Button>
          <Button variant="outline" onClick={() => toast.info("참고할 정보입니다.")}>
            <Info className="mr-2 h-4 w-4" />
            정보
          </Button>
        </div>
      </ComponentSection>

      {/* =========================================================
          Modal/Dialog 섹션
          오버레이(배경 어두워짐)와 함께 콘텐츠를 팝업으로 표시합니다.
          Radix UI 기반이라 포커스 트랩, ESC 키 닫기 등 접근성이 내장되어 있습니다.
          ========================================================= */}
      <ComponentSection
        title="Modal / Dialog"
        description="오버레이 형태로 콘텐츠를 표시하는 모달 컴포넌트입니다."
        code={`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>모달 열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>모달 제목</DialogTitle>
      <DialogDescription>모달 설명</DialogDescription>
    </DialogHeader>
    <p>모달 본문 내용</p>
    <DialogFooter>
      <Button>확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <div className="flex gap-3">
          {/*
            controlled 모드: open/onOpenChange로 열림 상태를 직접 제어합니다.
            테이블 행 클릭 등 외부 이벤트로도 모달을 열 수 있어 유연합니다.
          */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>모달 열기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>모달 제목</DialogTitle>
                <DialogDescription>
                  이것은 Dialog 컴포넌트입니다. 접근성을 고려해 포커스 트랩과 ESC 키 닫기를 지원합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  모달 안에 다양한 콘텐츠를 넣을 수 있습니다.
                  Form, 이미지, 텍스트 등 원하는 내용을 자유롭게 배치하세요.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
                <Button onClick={() => { setDialogOpen(false); toast.success("확인되었습니다."); }}>
                  확인
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ComponentSection>

      {/* =========================================================
          Form 요소 섹션
          Input, Select, Checkbox, RadioGroup을 조합한 폼 예시입니다.
          Label과 htmlFor를 통해 클릭 접근성을 확보합니다.
          ========================================================= */}
      <ComponentSection
        title="Form 요소"
        description="Input, Select, Checkbox, Radio 등 다양한 폼 요소를 제공합니다."
        code={`import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Input
<Label htmlFor="email">이메일</Label>
<Input id="email" type="email" placeholder="example@email.com" />

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">옵션 1</SelectItem>
    <SelectItem value="opt2">옵션 2</SelectItem>
  </SelectContent>
</Select>

// Checkbox
<Checkbox id="terms" />
<Label htmlFor="terms">약관에 동의합니다</Label>

// Radio
<RadioGroup value="opt1">
  <RadioGroupItem value="opt1" id="opt1" />
  <Label htmlFor="opt1">옵션 1</Label>
</RadioGroup>`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 왼쪽: Input과 Select */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-name">이름</Label>
              <Input id="demo-name" placeholder="이름을 입력하세요" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-email">이메일</Label>
              <Input id="demo-email" type="email" placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label>직업</Label>
              {/* controlled Select: value와 onValueChange로 상태를 연결합니다 */}
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="직업을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">개발자</SelectItem>
                  <SelectItem value="designer">디자이너</SelectItem>
                  <SelectItem value="pm">프로덕트 매니저</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-disabled">비활성화된 Input</Label>
              {/* disabled 상태: 시각적으로 입력 불가임을 표시합니다 */}
              <Input id="demo-disabled" placeholder="비활성화 상태" disabled />
            </div>
          </div>

          {/* 오른쪽: Checkbox와 RadioGroup */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Checkbox</p>
              <div className="space-y-3">
                {/* controlled Checkbox: checked 상태를 직접 관리합니다 */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={checkboxChecked}
                    onCheckedChange={(v) => setCheckboxChecked(v === true)}
                  />
                  <Label htmlFor="terms">이용약관에 동의합니다</Label>
                </div>
                {/* uncontrolled Checkbox: defaultChecked로 초기값만 지정합니다 */}
                <div className="flex items-center gap-3">
                  <Checkbox id="newsletter" defaultChecked />
                  <Label htmlFor="newsletter">뉴스레터 수신 동의</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled" className="text-muted-foreground">비활성화된 항목</Label>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Radio Group</p>
              {/* RadioGroup: 한 번에 하나만 선택할 수 있는 라디오 버튼 그룹입니다 */}
              <RadioGroup value={radioValue} onValueChange={setRadioValue} className="space-y-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">옵션 1</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">옵션 2</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">옵션 3</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </ComponentSection>

      {/* =========================================================
          Table 섹션
          사용자 목록을 표 형태로 표시합니다.
          이름 셀 클릭 시 해당 행의 데이터를 모달로 보여주는 연동을 시연합니다.
          ========================================================= */}
      <ComponentSection
        title="Table"
        description="데이터를 표 형태로 표시하는 Table 컴포넌트입니다."
        code={`import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>이름</TableHead>
      <TableHead>이메일</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>홍길동</TableCell>
      <TableCell>hong@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-muted-foreground">{row.id}</TableCell>
                  <TableCell className="font-medium">
                    {/*
                      이름 셀을 링크 버튼으로 만들어 클릭 시 해당 행의 데이터를
                      selectedItem에 저장하고 모달을 엽니다.
                    */}
                    <Button
                      onClick={() => {
                        setSelectedItem(row);
                        setDialogOpen(true);
                      }}
                      variant="link"
                      className="px-0"
                    >
                      {row.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell>
                    {/* Admin 역할은 default(강조), 나머지는 secondary(일반) 배지로 구분합니다 */}
                    <Badge variant={row.role === "Admin" ? "default" : "secondary"}>
                      {row.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* 활성/비활성 상태를 색상으로 구분합니다 */}
                    <span className={`text-sm font-medium ${row.status === "활성" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/*
          테이블과 연동된 상세 정보 모달
          TableBody 안에 중첩하면 HTML 구조가 깨질 수 있으므로 밖으로 분리했습니다.
          selectedItem?.name 처럼 옵셔널 체이닝을 써서 null 상태를 안전하게 처리합니다.
        */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-0">
              <p><span className="text-muted-foreground mr-2">이메일:</span> {selectedItem?.email}</p>
            </div>
            <div className="py-0">
              <p><span className="text-muted-foreground mr-2">역할:</span> {selectedItem?.role}</p>
            </div>
            <div className="py-0">
              <p><span className="text-muted-foreground mr-2">상태:</span> {selectedItem?.status}</p>
            </div>
            <hr className="my-4" />
            {/* 폼 제출 시 저장 성공 토스트를 띄우고 모달을 닫습니다 */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("저장되었습니다.");
                setDialogOpen(false);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="userName">이름</Label>
                <Input id="userName" name="userName" placeholder="이름을 입력하세요" className="mt-1" />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit">저장하기</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </ComponentSection>

      {/* =========================================================
          Accordion 섹션
          클릭으로 열고 닫을 수 있는 접힘 섹션 컴포넌트입니다.
          type="single": 한 번에 하나만 열림
          type="multiple": 여러 개 동시에 열 수 있음
          ========================================================= */}
      <ComponentSection
        title="Accordion"
        description="접을 수 있는 섹션으로 콘텐츠를 구성하는 Accordion 컴포넌트입니다."
        code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Single type (한 번에 하나만 열림)
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
    <AccordionContent>
      첫 번째 섹션의 상세 내용입니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>두 번째 섹션</AccordionTrigger>
    <AccordionContent>
      두 번째 섹션의 상세 내용입니다.
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple type (여러 개 동시에 열림)
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>섹션 1</AccordionTrigger>
    <AccordionContent>섹션 1의 내용</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>섹션 2</AccordionTrigger>
    <AccordionContent>섹션 2의 내용</AccordionContent>
  </AccordionItem>
</Accordion>`}
      >
        <div className="space-y-8">

          {/* Single Type: collapsible 추가 시 열려있는 항목을 다시 클릭해 닫을 수 있습니다 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">Single Type (한 번에 하나만 열림)</p>
            <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
              <AccordionItem value="faq-1" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  Accordion은 어떻게 사용하나요?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  Accordion 컴포넌트를 사용하여 긴 콘텐츠를 섹션별로 나누고 필요할 때만 펼칠 수 있습니다.
                  트리거를 클릭하면 콘텐츠가 부드러운 애니메이션으로 열리고 닫힙니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  여러 섹션을 동시에 열 수 있나요?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  기본적으로 `type="single"`은 한 번에 하나의 섹션만 열립니다.
                  여러 섹션을 동시에 열려면 `type="multiple"`을 사용하세요.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  디자인을 커스터마이즈할 수 있나요?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  네, Tailwind CSS 클래스를 사용하여 완전히 커스터마이즈할 수 있습니다.
                  각 컴포넌트에 `className` prop을 전달하여 스타일을 적용하세요.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Multiple Type: 여러 항목을 동시에 열어 비교할 수 있습니다 */}
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">Multiple Type (여러 개 동시에 열림)</p>
            <Accordion type="multiple" className="border rounded-lg overflow-hidden">
              <AccordionItem value="feature-1" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  라이브 미리보기
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  이 페이지의 위쪽에서 실제로 작동하는 Accordion을 볼 수 있습니다.
                  클릭해보세요!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="feature-2" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  애니메이션
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  열리고 닫힐 때 부드러운 슬라이드 애니메이션이 적용됩니다.
                  `tw-animate-css` 패키지의 `animate-accordion-down/up` 클래스를 사용합니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="feature-3" className="border-b last:border-b-0">
                <AccordionTrigger className="px-4 hover:bg-muted/50">
                  접근성
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  Radix UI의 Accordion primitive를 기반으로 하여 완벽한 접근성을 지원합니다.
                  키보드 네비게이션과 ARIA 속성이 포함되어 있습니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ComponentSection>

      {/* =========================================================
          Loading Spinner 섹션
          비동기 작업 중 로딩 상태를 표시하는 스피너입니다.
          4가지 크기(sm, md, lg, xl)와 접근성 label을 지원합니다.
          ========================================================= */}
      <ComponentSection
        title="Loading Spinner"
        description="로딩 상태를 표시하는 Spinner 컴포넌트입니다."
        code={`import { Spinner } from "@/components/ui/spinner";

// 다양한 크기
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// 커스텀 레이블 (접근성)
<Spinner label="데이터 불러오는 중..." />`}
      >
        <div className="flex flex-wrap items-center gap-8">
          {/* 크기별 스피너 예시 */}
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-xs text-muted-foreground">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-muted-foreground">md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-muted-foreground">lg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" />
            <span className="text-xs text-muted-foreground">xl</span>
          </div>

          {/* 실제 로딩 UI 예시: 스피너와 텍스트를 함께 배치한 패턴 */}
          <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
            <Spinner size="sm" />
            <span className="text-sm text-muted-foreground">데이터 불러오는 중...</span>
          </div>
        </div>
      </ComponentSection>

    </div>
  );
}
