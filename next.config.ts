import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  devIndicators: {
    appIsrStatus: false, // Hides the "N" Static Route indicator
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;
