/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bulgaria/config', '@bulgaria/types', '@bulgaria/utils'],
  images: {
    domains: ['nyc3.digitaloceanspaces.com'], // Add your CDN domain
  },
};

module.exports = nextConfig;
