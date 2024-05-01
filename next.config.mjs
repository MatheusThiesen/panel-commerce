/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "alpar2.sfo3.digitaloceanspaces.com",
      "alpar.sfo3.digitaloceanspaces.com",
      "dashboard.alpardobrasil.com.br",
      "alpardobrasil.com.br",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
