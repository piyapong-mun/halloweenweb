import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*', 'http://localhost:3000','192.168.71.1'],
  eslint: {
    // ✅ Disable ESLint during builds (Docker / CI / Production)
    
    ignoreDuringBuilds: true,
    
  },
};

export default nextConfig;

