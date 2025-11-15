/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bulgaria/config', '@bulgaria/types', '@bulgaria/utils'],
  images: {
    domains: ['example.com'], // Add your image CDN domains here
  },
};

module.exports = nextConfig;
