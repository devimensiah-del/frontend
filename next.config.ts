import path from 'path';
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Note: 'standalone' output is only for Docker/self-hosting, not Vercel
  // Vercel handles deployment automatically without standalone mode
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
  // Force Next.js to treat this folder as the workspace root to avoid parent lockfiles
  outputFileTracingRoot: path.join(__dirname),
}

export default nextConfig
