import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.financialexpressdigital.com",
      },
      {
        protocol: "https",
        hostname: "www.livemint.com",
      },
      {
        protocol: "https",
        hostname: "img.etimg.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.ottplay.com",
      },
      {
        protocol: "https",
        hostname: "images.hindustantimes.com",
      },
      {
        protocol: "https",
        hostname: "images.financialexpress.com",
      },
      {
        protocol: "https",
        hostname: "images.livemint.com",
      },
      {
        protocol: "https",
        hostname: "images.indianexpress.com",
      },
      {
        protocol: "https",
        hostname: "img.etimg.com",
      },
      {
        protocol: "https",
        hostname: "c.ndtvimg.com",
      },
      {
        protocol: "https",
        hostname: "mxp-media.ilnmedia.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn1.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;
