/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.20.10.3"],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;

