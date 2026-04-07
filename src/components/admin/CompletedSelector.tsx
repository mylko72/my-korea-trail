/**
 * CompletedSelector 컴포넌트
 *
 * 코스의 완보/미완 상태를 선택하는 드롭다운 컴포넌트입니다.
 * shadcn/ui Select를 기반으로 구성되며, 로딩 중에는 비활성화됩니다.
 *
 * 사용 예시:
 * <CompletedSelector
 *   value={true}
 *   onChange={(v) => handleChange(v)}
 *   loading={isSaving}
 * />
 */

'use client';

import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// =====================================================
// Props 타입 정의
// =====================================================

interface CompletedSelectorProps {
  /** 현재 완보 여부 (true=완보, false=미완) */
  value: boolean;
  /** 값 변경 콜백 */
  onChange: (value: boolean) => void;
  /** 로딩 중 여부 (true이면 비활성화 + 스피너 표시) */
  loading?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * CompletedSelector
 *
 * 완보/미완 상태를 선택할 수 있는 드롭다운 컴포넌트입니다.
 * 로딩 중에는 Select가 비활성화되고 스피너가 표시됩니다.
 */
export function CompletedSelector({
  value,
  onChange,
  loading = false,
  disabled = false,
}: CompletedSelectorProps) {
  // Select 값은 문자열이므로 boolean을 "true"/"false"로 변환
  const stringValue = String(value);

  const handleValueChange = (newValue: string) => {
    onChange(newValue === 'true');
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={stringValue}
        onValueChange={handleValueChange}
        disabled={loading || disabled}
      >
        <SelectTrigger
          size="sm"
          className="w-24"
          aria-label="완보 상태 선택"
        >
          {/* 로딩 중일 때는 스피너를 표시 */}
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {/* 완보 옵션 */}
          <SelectItem value="true">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              완보
            </span>
          </SelectItem>
          {/* 미완 옵션 */}
          <SelectItem value="false">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-gray-400" />
              미완
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
