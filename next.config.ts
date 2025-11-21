import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
      {
        source: '/get-response',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/get-response`,
      },
      {
        source: '/upload',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/upload`,
      },
      {
        source: '/images/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/images/:path*`,
      },
      {
        source: '/audio/:path*',
        destination: `${process.env.NEXT_PUBLIC_STT_URL || 'http://localhost:3001'}/audio/:path*`,
      },
    ];
  },
};

export default nextConfig;
