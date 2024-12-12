/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Enables the new app directory structure
  },
  async redirects() {
    return [
      {
        source: "/", // Redirect root URL
        destination: "/about", // Redirect to /about
        permanent: false, // Use true for permanent redirects (useful in production)
      },
    ];
  },
};

export default nextConfig;
