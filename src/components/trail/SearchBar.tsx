/**
 * SearchBar 컴포넌트 (F006)
 *
 * 검색어 입력 컴포넌트입니다.
 * 300ms 디바운스를 적용하여 불필요한 검색 호출을 줄입니다.
 * 검색어 초기화 버튼과 검색 로딩 인디케이터를 포함합니다.
 *
 * 사용 예시:
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={handleSearch}
 *   placeholder="코스명 검색..."
 * />
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// =====================================================
// Props 타입 정의
// =====================================================

interface SearchBarProps {
  /** 현재 검색어 값 (제어 컴포넌트) */
  value: string;
  /** 검색어 변경 시 호출되는 콜백 */
  onChange: (value: string) => void;
  /** 디바운스 후 검색 실행 콜백 */
  onSearch: (value: string) => void;
  /** 입력 필드 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 디바운스 지연 시간 (밀리초, 기본: 300) */
  debounceMs?: number;
  /** 추가 CSS 클래스 (선택) */
  className?: string;
  /** 검색창 비활성화 여부 */
  disabled?: boolean;
}

/**
 * SearchBar
 *
 * 디바운스가 적용된 검색 입력 컴포넌트입니다.
 * 클라이언트 컴포넌트이며, 상위에서 value/onChange로 제어합니다.
 *
 * 디바운스 동작:
 * - 사용자가 입력을 멈춘 후 debounceMs(기본 300ms)가 지나면 onSearch 호출
 * - 입력 도중에는 onChange만 호출하여 UI를 즉시 반영
 */
export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "코스명으로 검색...",
  debounceMs = 300,
  className,
  disabled = false,
}: SearchBarProps) {
  // 내부 입력 값: 즉각 반영을 위해 별도 상태 유지
  const [internalValue, setInternalValue] = useState(value);
  // 디바운스 타이머 참조
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부 value가 변경되면 내부 상태도 동기화 (부모 주도 리셋 시)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // 입력 변경 핸들러: onChange 즉시 호출 + 디바운스 onSearch
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange(newValue);

      // 기존 타이머 초기화
      if (timerRef.current) clearTimeout(timerRef.current);

      // 디바운스 후 onSearch 호출
      timerRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    },
    [onChange, onSearch, debounceMs]
  );

  // 검색어 초기화 핸들러
  const handleClear = useCallback(() => {
    setInternalValue("");
    onChange("");
    onSearch("");

    // 타이머도 취소
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onChange, onSearch]);

  // 엔터 키 입력 시 즉시 검색 실행
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (timerRef.current) clearTimeout(timerRef.current);
        onSearch(internalValue);
      }
    },
    [onSearch, internalValue]
  );

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={cn("relative flex items-center", className)}>
      {/* 검색 아이콘 (왼쪽) */}
      <Search
        className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0"
        aria-hidden="true"
      />

      {/* 검색 입력 필드 */}
      <Input
        type="search"
        role="searchbox"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="코스 검색"
        className={cn(
          "pl-9 pr-9 h-10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />

      {/* 초기화 버튼 (검색어가 있을 때만 표시) */}
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 flex items-center justify-center h-4 w-4 rounded-full
            text-muted-foreground hover:text-foreground transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="검색어 초기화"
          tabIndex={0}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
