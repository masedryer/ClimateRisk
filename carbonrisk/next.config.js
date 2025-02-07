/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')();

const nextConfig = withMDX({
  experimental: {
    appDir: true, // Enables the new app directory structure
  },
  pageExtensions: ['js', 'jsx', 'mdx'], // Enables MDX support
  async redirects() {
    return [
      {
        source: "/", // Redirect root URL
        destination: "/about", // Redirect to /about
        permanent: false, // Use true for permanent redirects in production
      },
    ];
  },
});

export default nextConfig;
