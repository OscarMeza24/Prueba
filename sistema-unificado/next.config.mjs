/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Elimina appDir que está obsoleto
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
