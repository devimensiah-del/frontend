/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['storage.supabase.co'],
  },
}

module.exports = nextConfig
