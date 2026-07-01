/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.20.10.3"],
  experimental: {
    // Enable multi-core parallel compiling during local development for faster page renders
    workerThreads: process.env.NODE_ENV === "development" ? undefined : false,
    cpus: process.env.NODE_ENV === "development" ? undefined : 1,
  },
};

export default nextConfig;

