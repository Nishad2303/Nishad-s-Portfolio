/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: false,
  },
  outputFileTracingIncludes: {
    '/api/certificates/*': ['./certificate/**/*'],
    '/api/achievements/*': ['./Achievements/**/*'],
    '/api/research-recognition/*': ['./Achievements/research & recoqnistion/**/*'],
    '/api/projects/*': ['./Projects/photos/**/*'],
  },
};

export default nextConfig;
