/**
 * Phase 3 개발용 Mock 데이터
 *
 * 실제 Notion API 연동 전 UI 개발 및 테스트에 사용하는 샘플 데이터입니다.
 * Phase 5에서 실제 Notion API로 전환 시 이 파일의 import를 변경하면 됩니다.
 *
 * 포함 필드: completed, content2, images, rate 포함
 * 포함 카테고리: 해파랑길, 남파랑길, 서해랑길, DMZ 평화의 길 (각 최소 2개)
 */

import type { TrailPost, TrailCategory } from "@/lib/types";

// =====================================================
// Mock 데이터: 코리아 둘레길 코스 샘플
// =====================================================

/** 개발용 샘플 게시글 배열 (총 11개: 해파랑길 3 + 남파랑길 3 + 서해랑길 3 + DMZ 평화의 길 2) */
export const MOCK_POSTS: TrailPost[] = [
  // ---- 해파랑길 (3개) ----
  {
    id: "mock-east-001",
    title: "강릉~삼척 구간",
    category: "해파랑길",
    slug: "gangneung-samcheok",
    date: "2025-09-14",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    description:
      "강릉 경포대에서 삼척 해수욕장까지 이어지는 해안 절경 구간입니다. 기암절벽과 맑은 바다가 어우러진 최고의 트레킹 코스.",
    distance: 33.5,
    duration: 480,
    difficulty: "보통",
    startLocation: { lat: 37.7965, lng: 128.9222, name: "경포대" },
    endLocation: { lat: 37.4494, lng: 129.1651, name: "삼척해수욕장" },
    published: true,
    completed: true,
    content2:
      "해안 절벽의 아름다움이 정말 인상적이었던 코스였습니다. 9월의 날씨도 쾌적해서 최적의 트레킹 조건에서 걸을 수 있었습니다. 다음에 다시 가고 싶은 구간입니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    ],
    rate: 4.5,
  },
  {
    id: "mock-east-002",
    title: "울진~영덕 구간",
    category: "해파랑길",
    slug: "uljin-yeongdeok",
    date: "2025-10-03",
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    description:
      "백두대간 동쪽 끝자락의 울진 왕피천 계곡에서 영덕 블루로드까지 잇는 구간. 청정 해안과 솔숲이 인상적입니다.",
    distance: 41.2,
    duration: 570,
    difficulty: "어려움",
    startLocation: { lat: 36.9933, lng: 129.4025, name: "울진 죽변항" },
    endLocation: { lat: 36.4154, lng: 129.3657, name: "영덕 강구항" },
    published: true,
    completed: false,
    content2: "어려운 난이도라고 생각했는데 실제로는 더 힘들었어요. 날씨가 좋지 않아서 중간에 포기했지만, 언젠가 다시 도전해보고 싶습니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    rate: 4,
  },
  {
    id: "mock-east-003",
    title: "고성~속초 구간",
    category: "해파랑길",
    slug: "goseong-sokcho",
    date: "2025-08-22",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description:
      "설악산 울산바위를 배경으로 고성 통일전망대에서 속초 영랑호까지 걷는 구간입니다. 산과 바다를 동시에 즐길 수 있습니다.",
    distance: 28.7,
    duration: 390,
    difficulty: "쉬움",
    startLocation: { lat: 38.4741, lng: 128.4679, name: "고성 통일전망대" },
    endLocation: { lat: 38.2049, lng: 128.5896, name: "속초 영랑호" },
    published: true,
    completed: true,
    content2:
      "설악산 전망이 정말 멋있던 구간입니다. 쉬운 난이도라고 해서 가볍게 생각했는데, 풍경이 그 어떤 도움도 필요 없을 정도로 아름다웠습니다. 만족도 100점입니다.",
    images: [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    ],
    rate: 5,
  },

  // ---- 남파랑길 (3개) ----
  {
    id: "mock-south-001",
    title: "여수~광양 구간",
    category: "남파랑길",
    slug: "yeosu-gwangyang",
    date: "2025-04-12",
    coverImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80",
    description:
      "여수 돌산도에서 광양 망덕포구까지 이어지는 남도 해안 구간. 벚꽃 시즌에 걸으면 더욱 아름다운 코스입니다.",
    distance: 24.8,
    duration: 330,
    difficulty: "쉬움",
    startLocation: { lat: 34.7415, lng: 127.7378, name: "여수 돌산도" },
    endLocation: { lat: 34.9308, lng: 127.6979, name: "광양 망덕포구" },
    published: true,
    completed: true,
    content2:
      "봄 시즌에 걸어서 정말 좋았습니다. 벚꽃이 한창이어서 길이 정말 아름다웠어요. 난이도도 쉬워서 가족들과 함께 걸었는데 모두 만족했습니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    ],
    rate: 3.5,
  },
  {
    id: "mock-south-002",
    title: "통영~거제 구간",
    category: "남파랑길",
    slug: "tongyeong-geoje",
    date: "2025-05-18",
    coverImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    description:
      "한려수도 절경을 품은 통영 미륵도에서 거제 해금강까지 걷는 남파랑길 최고 인기 구간.",
    distance: 38.4,
    duration: 510,
    difficulty: "보통",
    startLocation: { lat: 34.8527, lng: 128.4232, name: "통영 미륵도" },
    endLocation: { lat: 34.7951, lng: 128.6895, name: "거제 해금강" },
    published: true,
    completed: true,
    content2:
      "한려수도의 절경이 정말 대단했습니다. 거제 해금강의 풍경은 사진으로는 담을 수 없을 정도로 아름다웠어요. 남파랑길의 진짜 매력을 느낄 수 있는 구간이라고 생각합니다.",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    ],
    rate: 4.5,
  },
  {
    id: "mock-south-003",
    title: "부산~창원 구간",
    category: "남파랑길",
    slug: "busan-changwon",
    date: "2025-06-07",
    coverImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    description:
      "부산 다대포 해수욕장을 출발해 창원 마산합포구까지 이어지는 구간. 낙조가 아름다운 서쪽 코스입니다.",
    distance: 45.1,
    duration: 600,
    difficulty: "어려움",
    startLocation: { lat: 35.0482, lng: 128.9642, name: "부산 다대포" },
    endLocation: { lat: 35.1895, lng: 128.5744, name: "창원 마산합포" },
    published: true,
    completed: false,
    content2: "거리가 생각보다 길어서 마지막 부분에 힘이 빠졌습니다. 다음에 더 좋은 컨디션으로 다시 도전하고 싶습니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    rate: 3,
  },

  // ---- 서해랑길 (3개) ----
  {
    id: "mock-west-001",
    title: "태안~서산 구간",
    category: "서해랑길",
    slug: "taean-seosan",
    date: "2025-03-08",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    description:
      "태안해안국립공원의 십리포 해수욕장에서 서산 간월도까지 이어지는 서해안 갯벌 탐방 코스.",
    distance: 22.3,
    duration: 300,
    difficulty: "쉬움",
    startLocation: { lat: 36.7418, lng: 126.2971, name: "태안 십리포" },
    endLocation: { lat: 36.5827, lng: 126.4853, name: "서산 간월도" },
    published: true,
    completed: true,
    content2:
      "갯벌 생태계를 직접 체험할 수 있어서 정말 좋았습니다. 간월도의 신기로운 풍경도 인상적이었고, 아이들이 많이 배울 수 있는 코스였습니다.",
    images: [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    ],
    rate: 4,
  },
  {
    id: "mock-west-002",
    title: "군산~부안 구간",
    category: "서해랑길",
    slug: "gunsan-buan",
    date: "2025-11-15",
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    description:
      "금강 하구 군산 내항에서 변산반도 부안까지 걷는 구간. 서해 낙조와 새만금 방조제가 압권입니다.",
    distance: 36.7,
    duration: 495,
    difficulty: "보통",
    startLocation: { lat: 35.9845, lng: 126.7114, name: "군산 내항" },
    endLocation: { lat: 35.7318, lng: 126.7296, name: "부안 격포항" },
    published: true,
    completed: true,
    content2:
      "서해 낙조가 정말 아름다웠던 코스입니다. 새만금 방조제를 포함한 이 지역의 역사도 함께 느낄 수 있어서 문화적으로도 풍부한 경험이었습니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    ],
    rate: 3.5,
  },
  {
    id: "mock-west-003",
    title: "해남~완도 구간",
    category: "서해랑길",
    slug: "haenam-wando",
    date: "2025-02-20",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    description:
      "땅끝마을 해남에서 다도해의 관문 완도까지 이어지는 구간. 제주도가 보이는 맑은 날이 최적입니다.",
    distance: 29.5,
    duration: 405,
    difficulty: "보통",
    startLocation: { lat: 34.5584, lng: 126.5992, name: "해남 땅끝마을" },
    endLocation: { lat: 34.3144, lng: 126.7541, name: "완도항" },
    published: true,
    completed: false,
    content2: "땅끝마을의 역사적 의미를 느낄 수 있는 좋은 구간이었으나, 체력 문제로 끝까지 가지 못했습니다. 언젠가 다시 도전하겠습니다.",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    ],
    rate: 4,
  },

  // ---- DMZ 평화의 길 (2개) ----
  {
    id: "mock-dmz-001",
    title: "고성 통일전망대 구간",
    category: "DMZ 평화의 길",
    slug: "goseong-unification-observatory",
    date: "2025-07-04",
    coverImage: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&q=80",
    description:
      "동해 최북단 고성 통일전망대에서 금강산이 보이는 능선을 따라 걷는 DMZ 평화의 길 동부 구간.",
    distance: 12.4,
    duration: 210,
    difficulty: "보통",
    startLocation: { lat: 38.6128, lng: 128.3712, name: "고성 통일전망대" },
    endLocation: { lat: 38.5041, lng: 128.3248, name: "고성 화진포" },
    published: true,
    completed: true,
    content2:
      "분단의 현장을 직접 눈으로 보며 평화의 의미를 깊이 있게 생각할 수 있었던 의미 있는 트레킹이었습니다. 금강산을 볼 수 있다는 것만으로도 감동입니다.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    ],
    rate: 4.5,
  },
  {
    id: "mock-dmz-002",
    title: "철원 노동당사 구간",
    category: "DMZ 평화의 길",
    slug: "cheorwon-labor-party",
    date: "2025-07-19",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    description:
      "한국전쟁의 상흔이 고스란히 남은 철원 평야를 걸으며 분단의 역사를 느낄 수 있는 내륙 DMZ 구간.",
    distance: 15.8,
    duration: 255,
    difficulty: "쉬움",
    startLocation: { lat: 38.2183, lng: 127.2421, name: "철원 노동당사" },
    endLocation: { lat: 38.1671, lng: 127.3085, name: "철원 두루미 평화타운" },
    published: true,
    completed: true,
    content2:
      "역사의 현장을 걸으며 평화의 소중함을 다시 한 번 느낄 수 있었습니다. 철원 평야의 드넓은 풍경도 인상적이었고, 두루미 평화타운의 미래 지향적 메시지도 좋았습니다.",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    rate: 5,
  },
];

// =====================================================
// 필터링 유틸리티 함수
// Phase 5에서 Notion API로 전환 시 동일한 시그니처를 유지합니다.
// =====================================================

/**
 * 카테고리별로 게시글을 필터링합니다.
 *
 * @param posts - 필터링할 게시글 배열
 * @param category - 대상 카테고리
 * @returns 해당 카테고리의 게시글 배열
 *
 * @example
 * const haeParangPosts = filterPostsByCategory(MOCK_POSTS, "해파랑길");
 */
export function filterPostsByCategory(
  posts: TrailPost[],
  category: TrailCategory
): TrailPost[] {
  return posts.filter((post) => post.category === category);
}

/**
 * 날짜 범위로 게시글을 필터링합니다.
 * from, to 중 하나만 전달해도 동작합니다.
 *
 * @param posts - 필터링할 게시글 배열
 * @param from - 시작 날짜 (ISO 8601, 포함, 예: "2025-01-01")
 * @param to - 종료 날짜 (ISO 8601, 포함, 예: "2025-12-31")
 * @returns 해당 날짜 범위에 속하는 게시글 배열
 *
 * @example
 * const springPosts = filterByDateRange(MOCK_POSTS, "2025-03-01", "2025-05-31");
 */
export function filterByDateRange(
  posts: TrailPost[],
  from?: string,
  to?: string
): TrailPost[] {
  return posts.filter((post) => {
    const postDate = new Date(post.date);

    // from 조건: post 날짜가 from 이상이어야 함
    if (from) {
      const fromDate = new Date(from);
      if (postDate < fromDate) return false;
    }

    // to 조건: post 날짜가 to 이하이어야 함
    if (to) {
      // to 날짜의 끝(23:59:59)까지 포함하기 위해 다음날 자정 기준으로 비교
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      if (postDate >= toDate) return false;
    }

    return true;
  });
}

/**
 * 검색어로 게시글을 검색합니다.
 * 제목, 카테고리, 설명 필드를 대상으로 대소문자 구분 없이 검색합니다.
 *
 * @param posts - 검색 대상 게시글 배열
 * @param query - 검색어 (빈 문자열이면 전체 반환)
 * @returns 검색어와 일치하는 게시글 배열
 *
 * @example
 * const results = searchPosts(MOCK_POSTS, "강릉");
 */
export function searchPosts(posts: TrailPost[], query: string): TrailPost[] {
  // 검색어가 없거나 공백만 있으면 전체 반환
  const trimmed = query.trim();
  if (!trimmed) return posts;

  const lowerQuery = trimmed.toLowerCase();

  return posts.filter((post) => {
    // 제목 검색
    if (post.title.toLowerCase().includes(lowerQuery)) return true;
    // 카테고리 검색
    if (post.category.toLowerCase().includes(lowerQuery)) return true;
    // 설명 검색 (옵셔널 필드)
    if (post.description?.toLowerCase().includes(lowerQuery)) return true;
    // 슬러그 검색 (영문 검색어 대응)
    if (post.slug.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}

// =====================================================
// 편의 함수: 카테고리 + 날짜 + 검색어 복합 필터
// =====================================================

/**
 * 카테고리, 날짜 범위, 검색어를 동시에 적용하는 복합 필터 함수입니다.
 * 각 조건은 AND 방식으로 결합됩니다.
 *
 * @param posts - 필터링할 게시글 배열
 * @param options - 필터 옵션 객체
 * @param options.category - 카테고리 필터 (없으면 전체)
 * @param options.from - 시작 날짜 필터
 * @param options.to - 종료 날짜 필터
 * @param options.query - 검색어 필터
 * @returns 모든 조건을 만족하는 게시글 배열
 */
export function filterPosts(
  posts: TrailPost[],
  options: {
    category?: TrailCategory;
    from?: string;
    to?: string;
    query?: string;
  }
): TrailPost[] {
  let result = posts;

  if (options.category) {
    result = filterPostsByCategory(result, options.category);
  }

  if (options.from || options.to) {
    result = filterByDateRange(result, options.from, options.to);
  }

  if (options.query) {
    result = searchPosts(result, options.query);
  }

  return result;
}
