/**
 * DateFilter 컴포넌트 (F005)
 *
 * 날짜 범위로 코스 기록을 필터링하는 컴포넌트입니다.
 * from/to 날짜 입력 필드와 초기화 버튼으로 구성됩니다.
 *
 * 사용 예시:
 * <DateFilter
 *   from="2024-01-01"
 *   to="2024-12-31"
 *   onChange={({ from, to }) => handleDateChange(from, to)}
 * />
 */

"use client";

import { useCallback } from "react";
import { X, CalendarRange } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// =====================================================
// Props 타입 정의
// =====================================================

interface DateRange {
  from?: string;
  to?: string;
}

interface DateFilterProps {
  /** 시작 날짜 (ISO 형식: "YYYY-MM-DD") */
  from?: string;
  /** 종료 날짜 (ISO 형식: "YYYY-MM-DD") */
  to?: string;
  /** 날짜 범위 변경 시 호출되는 콜백 */
  onChange: (range: DateRange) => void;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
}

/**
 * DateFilter
 *
 * 시작일/종료일 날짜 범위 필터 컴포넌트입니다.
 * 두 날짜 입력 필드와 초기화 버튼으로 구성됩니다.
 * 클라이언트 컴포넌트이며 상위에서 상태를 관리합니다.
 */
export function DateFilter({ from, to, onChange, className }: DateFilterProps) {
  // 시작 날짜 변경 핸들러
  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ from: e.target.value || undefined, to });
    },
    [onChange, to]
  );

  // 종료 날짜 변경 핸들러
  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ from, to: e.target.value || undefined });
    },
    [onChange, from]
  );

  // 필터 초기화 핸들러
  const handleReset = useCallback(() => {
    onChange({ from: undefined, to: undefined });
  }, [onChange]);

  // 하나라도 날짜가 선택되면 초기화 버튼 표시
  const hasFilter = Boolean(from || to);

  return (
    <fieldset className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-3", className)}>
      {/* 레전드: 스크린리더를 위한 필드셋 설명 */}
      <legend className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0 mb-1 sm:mb-0">
        <CalendarRange className="h-4 w-4" aria-hidden="true" />
        날짜 범위
      </legend>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
        {/* 시작 날짜 입력 */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label htmlFor="date-filter-from" className="sr-only">
            시작 날짜
          </label>
          <Input
            id="date-filter-from"
            type="date"
            value={from ?? ""}
            onChange={handleFromChange}
            max={to}
            className="h-8 text-sm w-full sm:w-40"
            aria-label="필터 시작 날짜"
          />
        </div>

        {/* 구분자 */}
        <span className="text-muted-foreground text-sm shrink-0 hidden sm:block" aria-hidden="true">
          ~
        </span>

        {/* 종료 날짜 입력 */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label htmlFor="date-filter-to" className="sr-only">
            종료 날짜
          </label>
          <Input
            id="date-filter-to"
            type="date"
            value={to ?? ""}
            onChange={handleToChange}
            min={from}
            className="h-8 text-sm w-full sm:w-40"
            aria-label="필터 종료 날짜"
          />
        </div>

        {/* 초기화 버튼: 날짜가 선택된 경우에만 표시 */}
        {hasFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            aria-label="날짜 필터 초기화"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="ml-1 text-xs">초기화</span>
          </Button>
        )}
      </div>
    </fieldset>
  );
}
