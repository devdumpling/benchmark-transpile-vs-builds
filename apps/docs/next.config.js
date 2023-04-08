/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    mdxRs: true,
    typedRoutes: true,
  },
};

const withNextra = require("nextra")({
  ...nextConfig,
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra();
