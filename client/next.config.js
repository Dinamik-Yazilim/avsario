/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['@mdxeditor/editor', 'lucide-react'],
  reactStrictMode: true,
  // cleanDistDir: true,
  basePath: "",
  crossOrigin: "anonymous",
  // distDir: "dist",
  // compress: false,
  pageExtensions: ['ts', 'tsx', 'jsx', 'mdx'],
  images: {
    unoptimized: true,
    remotePatterns: [{ hostname: '**' },]
  },
  output: "standalone",
  httpAgentOptions: {
    keepAlive: false
  },
  poweredByHeader: false,

  // experimental: {
  //   mdxRs: true,
  //   typedRoutes: true,
  //   // https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
  //   optimizePackageImports: [
  //     '@fortawesome/fontawesome-free',
  //     '@next/mdx',
  //     'lucide-react',
  //     'tailwind-merge',
  //     'tailwindcss',
  //     'tailwindcss-animate',
  //     'typescript',
  //   ],
  // },
}

const withMDX = require('@next/mdx')()(nextConfig)

const withPWA = require('next-pwa')({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
  cacheOnFrontEndNav: true,
  // sourcemap: false,
  // cleanupOutdatedCaches: true,
})(withMDX)


module.exports = withPWA