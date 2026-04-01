/**
 * 홈 페이지 클라이언트 컴포넌트 (HomePageClient)
 *
 * 서버 컴포넌트(page.tsx)에서 받은 게시글 데이터를 기반으로
 * 검색 상태 관리 및 인터랙티브 UI를 담당합니다.
 *
 * 클라이언트 컴포넌트로 분리한 이유:
 * - 검색어 상태(searchQuery)를 useState로 관리하기 위해
 * - 서버 컴포넌트(page.tsx)에서 Notion API 데이터를 props로 전달받음
 */

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SearchBar } from "@/components/trail/SearchBar";
import { PostGrid } from "@/components/trail/PostGrid";
import type { TrailPost } from "@/lib/types";

// =====================================================
// 카테고리 구간 데이터
// 각 항목은 카테고리명, 슬러그, 설명, 총 거리(km)로 구성됩니다.
// =====================================================

const categories = [
  {
    name: "해파랑길",
    slug: "hae-parang-gil",
    description: "강원도 고성에서 부산까지 이어지는 동해안 절경 코스",
    totalDistance: 770,
    color: "from-blue-500/10 to-cyan-500/10",
    borderColor: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  {
    name: "남파랑길",
    slug: "nam-parang-gil",
    description: "부산에서 해남까지 다도해와 리아스식 해안을 따라가는 코스",
    totalDistance: 1470,
    color: "from-teal-500/10 to-green-500/10",
    borderColor: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    name: "서해랑길",
    slug: "seo-hae-rang-gil",
    description: "해남에서 인천까지 서해 갯벌과 낙조를 감상하는 코스",
    totalDistance: 1800,
    color: "from-orange-500/10 to-amber-500/10",
    borderColor: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  {
    name: "DMZ 평화의 길",
    slug: "dmz-peace-trail",
    description: "인천에서 고성까지 비무장지대를 따라 걷는 역사의 길",
    totalDistance: 500,
    color: "from-slate-500/10 to-zinc-500/10",
    borderColor: "hover:border-slate-300 dark:hover:border-slate-700",
  },
];

// =====================================================
// Props 타입 정의
// =====================================================

interface HomePageClientProps {
  /** 서버에서 가져온 최신 게시글 목록 (최대 6개) */
  latestPosts: TrailPost[];
  /** 서버에서 가져온 전체 게시글 목록 (검색용) */
  allPosts: TrailPost[];
}

/**
 * 게시글 검색 함수
 * 제목, 카테고리, 설명에서 검색어를 찾습니다.
 */
function searchPosts(posts: TrailPost[], query: string): TrailPost[] {
  const trimmed = query.trim();
  if (!trimmed) return posts;

  const lowerQuery = trimmed.toLowerCase();

  return posts.filter((post) => {
    const title = post.title.toLowerCase();
    const category = post.category.toLowerCase();
    const description = (post.description ?? "").toLowerCase();

    return (
      title.includes(lowerQuery) ||
      category.includes(lowerQuery) ||
      description.includes(lowerQuery)
    );
  });
}

/**
 * HomePageClient 컴포넌트
 *
 * 서버에서 받은 게시글 데이터로 검색/필터링 인터랙션을 처리합니다.
 */
export default function HomePageClient({
  latestPosts,
  allPosts,
}: HomePageClientProps) {
  // 검색어 상태 (F006)
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 검색어 기반 필터링 결과
  // 검색어가 없으면 최신 6개, 있으면 전체 데이터에서 검색
  const searchResults = searchQuery.trim()
    ? searchPosts(allPosts, searchQuery)
    : latestPosts;

  // 검색 실행 콜백 (SearchBar의 onSearch prop)
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // 검색어 변경 콜백 (SearchBar의 onChange prop)
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="flex flex-col">

      {/* =========================================================
          Hero 섹션
          프로젝트의 첫인상을 결정하는 영역입니다.
          ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">

          {/* 브랜드 배지 */}
          <div className="mb-6 inline-flex items-center gap-2">
            <Footprints className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              코리아 둘레길 기록 블로그
            </span>
          </div>

          {/* 메인 제목 */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            한 발 한 발,
            <br />
            대한민국을 걷다
          </h1>

          {/* 소개 문구 */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            코리아 둘레길 4,500km를 걸으며 기록한
            <br className="hidden md:block" />
            여정과 사진, 그리고 이야기를 담았습니다.
          </p>

          {/* CTA 버튼 */}
          <Button size="lg" asChild>
            <Link href="/hae-parang-gil">
              기록 보러가기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 배경 장식용 원형 블러 효과 (스크린리더 무시) */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
      </section>

      {/* =========================================================
          카테고리 섹션
          4개 구간 카드를 그리드로 배치합니다.
          ========================================================= */}
      <section className="py-20 md:py-28" aria-labelledby="categories-title">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
                구간별 기록
              </span>
            </div>
            <h2 id="categories-title" className="text-3xl md:text-4xl font-bold mb-4">
              4개 구간을 걷다
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              동해안, 남해안, 서해안, DMZ — 각 구간의 이야기를 확인하세요.
            </p>
          </div>

          {/* 반응형 그리드: 모바일 1열 -> 태블릿 2열 -> 데스크톱 4열 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/${category.slug}`}>
                <Card
                  className={`group h-full cursor-pointer bg-gradient-to-br ${category.color} ${category.borderColor} hover:shadow-md transition-all duration-200`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        총 {category.totalDistance.toLocaleString()}km
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          최신 기록 섹션 (F002, F006)
          검색바와 PostGrid로 구성됩니다.
          검색어가 없으면 최신 6개, 있으면 검색 결과를 표시합니다.
          ========================================================= */}
      <section
        className="py-20 bg-muted/20 border-t border-border"
        aria-labelledby="recent-posts-title"
      >
        <div className="container mx-auto px-4">
          {/* 섹션 헤더 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2
                id="recent-posts-title"
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {searchQuery.trim() ? "검색 결과" : "최근 기록"}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery.trim()
                  ? `"${searchQuery}" 검색 결과 ${searchResults.length}개`
                  : `최근 완주한 코스 ${latestPosts.length}개`}
              </p>
            </div>

            {/* 검색바 (F006) */}
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              placeholder="코스명, 지역, 카테고리 검색..."
              className="w-full md:w-80"
            />
          </div>

          {/* 게시글 그리드 (F002) */}
          <PostGrid
            posts={searchResults}
            emptyMessage={
              searchQuery.trim()
                ? "검색 결과가 없습니다."
                : "아직 기록된 코스가 없습니다."
            }
            emptyDescription={
              searchQuery.trim()
                ? "다른 검색어를 입력해 보세요."
                : "곧 새로운 기록이 추가될 예정입니다."
            }
          />

          {/* 전체 보기 버튼 (검색어 없을 때만 표시) */}
          {!searchQuery.trim() && (
            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/hae-parang-gil">
                  전체 기록 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          소개 섹션
          코리아 둘레길 정보를 간략하게 소개합니다.
          ========================================================= */}
      <section className="py-20 bg-muted/30 border-t border-border" aria-labelledby="about-title">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="about-title" className="text-3xl font-bold mb-6">
              코리아 둘레길이란?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              코리아 둘레길은 대한민국 해안선과 비무장지대, 내륙 산간을 연결하는
              총 4,500km의 장거리 도보 여행길입니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              동해안길, 남해안길, 서해안길, DMZ평화의길의 4개 권역으로
              구성되며, 우리나라의 자연과 역사, 문화를 온몸으로 느낄 수 있는 길입니다.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
