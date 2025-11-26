import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para liberar imagens de sites externos (Testemunhos, Mockups)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Garante que o Next.js lide corretamente com as URLs
  trailingSlash: false,
};

export default nextConfig;