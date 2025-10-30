import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* Allow CORS all origins */ 
  allowedDevOrigins: ['*', 'http://localhost:3000','192.168.71.1'],
};

export default nextConfig;
