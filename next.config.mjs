/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => `build-${Date.now()}`, // mỗi lần build tạo build ID mới
};

export default nextConfig;

