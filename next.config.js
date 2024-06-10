/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopping-phinf.pstatic.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "www.themoviedb.org",
        port: "",
        pathname: "/t/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/dn/**",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/dn/**",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
        port: "",
        pathname: "/static/**",
      },
    ],
  },
};

module.exports = nextConfig;
