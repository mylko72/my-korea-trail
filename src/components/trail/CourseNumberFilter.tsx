"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrailPost, TrailCategory } from "@/lib/types";

interface CourseNumberFilterProps {
  currentCategory: TrailCategory;
  categorySlug: string;
  posts: TrailPost[];
}

// 각 둘레길별 코스 수
const COURSE_COUNT: Record<TrailCategory, number> = {
  해파랑길: 50,
  남파랑길: 90,
  서해랑길: 103,
  "DMZ 평화의 길": 34,
};

// title에서 코스 번호 추출 (예: "해파랑길 1코스" → 1)
function extractCourseNumber(title: string): number | null {
  const match = title.match(/(\d+)코스/);
  return match ? parseInt(match[1], 10) : null;
}

export function CourseNumberFilter({
  currentCategory,
  categorySlug,
  posts,
}: CourseNumberFilterProps) {
  // 전체 코스 목록 표시 여부
  const [isExpanded, setIsExpanded] = useState(false);

  // 실제 콘텐츠 높이 (부드러운 애니메이션용)
  const [contentHeight, setContentHeight] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  // 등록된 코스 번호 → slug 매핑
  const registeredCourses = useMemo(() => {
    const map = new Map<number, string>();
    for (const post of posts) {
      const num = extractCourseNumber(post.title);
      if (num !== null) {
        map.set(num, post.slug);
      }
    }
    return map;
  }, [posts]);

  const totalCourses = COURSE_COUNT[currentCategory];
  const courseNumbers = Array.from({ length: totalCourses }, (_, i) => i + 1);

  // 콘텐츠 높이 측정 (확장 시 사용)
  useEffect(() => {
    if (navRef.current) {
      setContentHeight(navRef.current.scrollHeight);
    }
  }, [courseNumbers, posts]);

  return (
    <div className="space-y-2">
      {/* 코스 버튼 목록 */}
      <nav
        ref={navRef}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : "36px",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
        className="flex flex-wrap gap-2"
        aria-label="코스 필터"
        role="group"
      >
        {courseNumbers.map((courseNum) => {
          const slug = registeredCourses.get(courseNum);
          const isRegistered = slug !== undefined;

          if (isRegistered) {
            return (
              <Link
                key={courseNum}
                href={`/${categorySlug}/${slug}`}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "border-border text-foreground hover:bg-accent hover:border-foreground/50 bg-transparent"
                )}
              >
                {courseNum}코스
              </Link>
            );
          }

          // 미등록 코스: disabled
          return (
            <button
              key={courseNum}
              type="button"
              disabled
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium",
                "border-border text-muted-foreground bg-transparent cursor-not-allowed opacity-40"
              )}
              aria-disabled="true"
            >
              {courseNum}코스
            </button>
          );
        })}
      </nav>

      {/* 더보기 / 닫기 버튼 */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
            닫기
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
            더보기
          </>
        )}
      </button>
    </div>
  );
}
