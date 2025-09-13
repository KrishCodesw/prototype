import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Cloudflare Images delivery domain pattern (customize as needed)
      { protocol: "https", hostname: "imagedelivery.net" },
    ],
  },
};

export default nextConfig;
