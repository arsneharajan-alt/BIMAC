/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // The page was renamed; keep the crawled URL alive.
      {
        source: "/custom-development",
        destination: "/custom-automation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
