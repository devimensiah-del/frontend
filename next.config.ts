import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker and Vercel deployment
  eslint: {
    // Don't block production builds on ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't block production builds on TypeScript errors
    // Note: Only use in production if you're confident in your code
    ignoreBuildErrors: false, // Keep type checking enabled
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
