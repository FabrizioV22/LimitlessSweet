/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For local image stability and fast rendering
  },
};

module.exports = nextConfig;
