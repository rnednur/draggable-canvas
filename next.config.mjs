/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Static export configuration (uncomment to enable)
  // output: 'export',
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
}

export default nextConfig
