/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  transpilePackages: ["example"],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
};
