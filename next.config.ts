import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind v4 is handled via postcss.config.mjs + @tailwindcss/postcss.
  // Turbopack in Next.js 16 reads the PostCSS config automatically — no extra setup needed.
  turbopack: {},
  // webpack alias for pdfjs-dist (used only during `next build`, not Turbopack dev)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;
