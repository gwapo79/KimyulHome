import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xn--2i4bq4i58b81e.com', // 서초지율.com
      },
      {
        protocol: 'https',
        hostname: 'www.xn--2i4bq4i58b81e.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co'
      }
    ],
  },
};

export default nextConfig;
