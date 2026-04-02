import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion 이미지 호스트
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
      },
      // 개발/Mock 데이터용 Unsplash 이미지 호스트
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // 사용자 커스텀 이미지 호스트 (Notion CoverImage URL 필드 사용)
      {
        protocol: "https",
        hostname: "www.durunubi.kr",
      },
      {
        protocol: "https",
        hostname: "durunubi.kr",
      },
    ],
  },
};

export default nextConfig;
