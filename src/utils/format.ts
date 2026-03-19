// 공통 포맷 유틸리티 함수

/**
 * HTTP 메서드에 따른 색상 클래스 반환
 */
export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    POST: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[method] ?? "bg-gray-100 text-gray-700";
}

/**
 * 상태에 따른 Badge variant 반환
 */
export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    stable: "default",
    beta: "secondary",
    experimental: "outline",
    active: "default",
    inactive: "secondary",
  };
  return variants[status] ?? "outline";
}

/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 숫자를 한국 화폐 형식으로 포맷
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}

/**
 * 문자열을 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * 상태 레이블 한국어 변환
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    stable: "안정",
    beta: "베타",
    experimental: "실험적",
    active: "활성",
    inactive: "비활성",
  };
  return labels[status] ?? status;
}
