/**
 * CourseAdminTable 컴포넌트
 *
 * 관리자 대시보드에서 전체 코스 목록을 테이블로 표시합니다.
 * 완보 여부와 게시 상태를 인라인으로 수정할 수 있습니다.
 *
 * 사용 예시:
 * <CourseAdminTable
 *   courses={courses}
 *   onStatusChange={(id, field, value) => handleChange(id, field, value)}
 * />
 */

'use client';

import Link from 'next/link';

import type { AdminCourseRow } from '@/lib/types';
import { formatShortDate, formatDistance, categoryToSlug } from '@/lib/utils';

import { CompletedSelector } from '@/components/admin/CompletedSelector';
import { PublishedCheckbox } from '@/components/admin/PublishedCheckbox';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Spinner } from '@/components/ui/spinner';

// =====================================================
// Props 타입 정의
// =====================================================

interface CourseAdminTableProps {
  /** 표시할 코스 목록 */
  courses: AdminCourseRow[];
  /** 상태 변경 콜백 */
  onStatusChange: (
    pageId: string,
    field: 'completed' | 'published',
    value: boolean
  ) => void;
  /** 테이블 로딩 중 여부 */
  isLoading?: boolean;
  /** 진행 중인 요청 pageId 목록 */
  loadingPageIds?: Set<string>;
}

// =====================================================
// 카테고리별 배지 색상 매핑
// TrailCard의 패턴을 재사용합니다.
// =====================================================

const categoryColorMap: Record<string, string> = {
  해파랑길: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  남파랑길: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  서해랑길: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'DMZ 평화의 길': 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
};

/**
 * CourseAdminTable
 *
 * 코스 관리 테이블 컴포넌트입니다.
 * 완주일 내림차순으로 정렬하며, 빈 목록이면 안내 메시지를 표시합니다.
 */
export function CourseAdminTable({
  courses,
  onStatusChange,
  isLoading = false,
  loadingPageIds = new Set(),
}: CourseAdminTableProps) {
  // 완주일 내림차순 정렬
  const sortedCourses = [...courses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800">
      {/* 테이블 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          코스 목록
        </h2>
        {/* 총 코스 수 표시 */}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          총 {courses.length}개
        </span>
      </div>

      {/* 가로 스크롤 가능한 테이블 영역 */}
      <div className="overflow-x-auto">
        {isLoading ? (
          // 로딩 중 스켈레톤 UI
          <div className="flex flex-col gap-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : sortedCourses.length === 0 ? (
          // 빈 목록 안내 메시지
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-base">코스 데이터가 없습니다.</p>
            <p className="mt-1 text-sm">Notion에서 코스를 추가해 주세요.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            {/* 테이블 컬럼 헤더 */}
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  코스명
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  카테고리
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  완주일
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  거리
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  완보
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                  게시
                </th>
              </tr>
            </thead>

            {/* 테이블 바디 */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedCourses.map((course) => {
                // 카테고리 슬러그를 URL에 사용 (상세 페이지 링크)
                const categorySlug = categoryToSlug(course.category);
                // 카테고리 배지 색상
                const categoryColor =
                  categoryColorMap[course.category] ??
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

                return (
                  <tr
                    key={course.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                  >
                    {/* 코스명 (공개 상세 페이지 링크 포함) */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/${categorySlug}/${course.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 hover:underline dark:text-white dark:hover:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="공개 상세 페이지에서 열기"
                      >
                        {course.title}
                      </Link>
                    </td>

                    {/* 카테고리 배지 */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor}`}
                      >
                        {course.category}
                      </span>
                    </td>

                    {/* 완주일 */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      <time dateTime={course.date}>
                        {formatShortDate(course.date)}
                      </time>
                    </td>

                    {/* 거리 */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {formatDistance(course.distance)}
                    </td>

                    {/* 완보 상태 선택 */}
                    <td className="px-4 py-3">
                      <CompletedSelector
                        value={course.completed}
                        onChange={(value) =>
                          onStatusChange(course.id, 'completed', value)
                        }
                        disabled={loadingPageIds.has(course.id)}
                        loading={loadingPageIds.has(course.id)}
                      />
                    </td>

                    {/* 게시 상태 체크박스 */}
                    <td className="px-4 py-3">
                      <PublishedCheckbox
                        checked={course.published}
                        onChange={(value) =>
                          onStatusChange(course.id, 'published', value)
                        }
                        disabled={loadingPageIds.has(course.id)}
                        loading={loadingPageIds.has(course.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
