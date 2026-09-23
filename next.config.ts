import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      // 301 — legacy PHP URLs migrated to SEO-friendly routes
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/sobre.php", destination: "/sobre", permanent: true },
      { source: "/servicos.php", destination: "/servicos", permanent: true },
      { source: "/contato.php", destination: "/contato", permanent: true },
      { source: "/404.php", destination: "/404", permanent: true },
      { source: "/fgts.php", destination: "/fgts", permanent: true },
      { source: "/blog.php", destination: "/blog", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
