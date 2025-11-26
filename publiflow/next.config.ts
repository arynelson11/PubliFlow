import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Imagens de alta qualidade
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me', // Gerador de avatares antigos (vamos substituir)
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Placeholders gerais
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Gerador de avatares modernos e consistentes
      },
      {
        protocol: 'https',
        hostname: 'thispersondoesnotexist.com', // Para imagens de IA super realistas
      },
    ],
  },
  trailingSlash: false,
};

export default nextConfig;