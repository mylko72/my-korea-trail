/**
 * 관리자 대시보드 페이지
 *
 * Phase 9: 실제 Notion API 연동
 * - useEffect에서 GET /api/admin/courses 호출
 * - handleStatusChange에서 낙관적 업데이트 + PATCH 요청
 * - Sonner 토스트로 성공/실패 알림
 *
 * - 상단 요약 카드: 전체 코스 수, 게시된 코스 수, 완보 코스 수
 * - 코스 관리 테이블: 완보/게시 상태 인라인 수정 가능
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import type { AdminCourseRow } from '@/lib/types';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminSummaryCard } from '@/components/admin/AdminSummaryCard';
import { CourseAdminTable } from '@/components/admin/CourseAdminTable';

export default function AdminPage() {
  // =====================================================
  // 상태 관리
  // =====================================================

  // 코스 목록
  const [courses, setCourses] = useState<AdminCourseRow[]>([]);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 진행 중인 요청 추적 (Set<pageId>)
  const [loadingPageIds, setLoadingPageIds] = useState<Set<string>>(new Set());

  // =====================================================
  // 초기 데이터 로드
  // =====================================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/admin/courses');

        if (!response.ok) {
          throw new Error('코스 목록 조회 실패');
        }

        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : '알 수 없는 오류 발생';
        setError(message);
        toast.error(`로드 실패: ${message}`);
        console.error('[Admin] fetchCourses 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // =====================================================
  // 코스 상태 변경 핸들러 (낙관적 업데이트)
  // =====================================================

  const handleStatusChange = useCallback(
    async (pageId: string, field: 'completed' | 'published', value: boolean) => {
      // 1. 기존 상태 저장 (실패 시 롤백용)
      const previousCourses = courses;

      // 2. 낙관적 업데이트: UI 즉시 변경
      setCourses((prev) =>
        prev.map((course) =>
          course.id === pageId ? { ...course, [field]: value } : course
        )
      );

      // 3. 로딩 상태 추가
      setLoadingPageIds((prev) => new Set([...prev, pageId]));

      try {
        // 4. API 호출 (PATCH /api/admin/courses/[pageId])
        const response = await fetch(`/api/admin/courses/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, value }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '상태 업데이트 실패');
        }

        // 5. 성공: 토스트 알림
        toast.success('저장되었습니다');
      } catch (err) {
        // 6. 실패: UI 롤백
        setCourses(previousCourses);

        // 에러 알림
        const message = err instanceof Error ? err.message : '알 수 없는 오류';
        toast.error(`저장 실패: ${message}`);
        console.error('[Admin] handleStatusChange 에러:', err);
      } finally {
        // 7. 로딩 상태 제거
        setLoadingPageIds((prev) => {
          const next = new Set(prev);
          next.delete(pageId);
          return next;
        });
      }
    },
    [courses]
  );

  // =====================================================
  // 요약 통계 계산
  // =====================================================

  const totalCount = courses.length;
  const publishedCount = courses.filter((c) => c.published).length;
  const completedCount = courses.filter((c) => c.completed).length;

  // =====================================================
  // 렌더링
  // =====================================================

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 페이지 제목 */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            대시보드
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            코스의 완보 여부 및 게시 상태를 관리합니다.
          </p>
        </div>

        {/* 에러 상태 표시 */}
        {error && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* 요약 카드 (3개) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminSummaryCard
            label="전체 코스"
            count={totalCount}
            isLoading={isLoading}
          />
          <AdminSummaryCard
            label="게시된 코스"
            count={publishedCount}
            isLoading={isLoading}
          />
          <AdminSummaryCard
            label="완보 코스"
            count={completedCount}
            isLoading={isLoading}
          />
        </div>

        {/* 코스 관리 테이블 */}
        <CourseAdminTable
          courses={courses}
          onStatusChange={handleStatusChange}
          isLoading={isLoading}
          loadingPageIds={loadingPageIds}
        />
      </div>
    </AdminLayout>
  );
}
