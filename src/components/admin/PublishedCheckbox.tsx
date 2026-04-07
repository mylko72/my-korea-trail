/**
 * PublishedCheckbox 컴포넌트
 *
 * 코스의 게시/미게시 상태를 체크박스로 관리하는 컴포넌트입니다.
 * shadcn/ui Checkbox + Label을 기반으로 구성됩니다.
 *
 * 사용 예시:
 * <PublishedCheckbox
 *   checked={true}
 *   onChange={(v) => handleChange(v)}
 *   loading={isSaving}
 * />
 */

'use client';

import { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

// =====================================================
// Props 타입 정의
// =====================================================

interface PublishedCheckboxProps {
  /** 현재 게시 여부 (true=게시됨, false=미게시) */
  checked: boolean;
  /** 값 변경 콜백 */
  onChange: (checked: boolean) => void;
  /** 로딩 중 여부 (true이면 비활성화) */
  loading?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * PublishedCheckbox
 *
 * 게시/미게시 상태를 체크박스로 제어하는 컴포넌트입니다.
 * 체크 시 "게시됨" (초록), 미체크 시 "미게시" (회색) 텍스트를 표시합니다.
 */
export function PublishedCheckbox({
  checked,
  onChange,
  loading = false,
  disabled = false,
}: PublishedCheckboxProps) {
  // 접근성을 위한 고유 ID 생성
  const checkboxId = useId();

  const handleCheckedChange = (checkedState: boolean | 'indeterminate') => {
    if (checkedState !== 'indeterminate') {
      onChange(checkedState);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 로딩 중이면 Checkbox 대신 스피너 표시 */}
      {loading || disabled ? (
        <Spinner size="sm" />
      ) : (
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={loading || disabled}
          aria-label="게시 상태 변경"
        />
      )}

      {/* 상태 레이블 */}
      <Label
        htmlFor={checkboxId}
        className={cn(
          'cursor-pointer text-sm font-medium select-none',
          (loading || disabled) && 'cursor-not-allowed opacity-50',
          checked
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-500 dark:text-gray-400'
        )}
      >
        {checked ? '게시됨' : '미게시'}
      </Label>
    </div>
  );
}
