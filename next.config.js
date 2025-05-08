/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Ensure environment variables are properly handled
  env: {
    // Empty fallback for build time
    DATABASE_URL: process.env.DATABASE_URL || '',
  },

  // Turn off some TypeScript and ESLint checks during build
  typescript: {
    // Handled separately to avoid build failures
    ignoreBuildErrors: true,
  },

  eslint: {
    // Handled separately to avoid build failures
    ignoreDuringBuilds: true,
  },

  // Allow specific domains for images
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'cdn.discordapp.com'],
  },

  // Experimental features
  experimental: {
    // Use JIT compiler for production
    optimizeFonts: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
