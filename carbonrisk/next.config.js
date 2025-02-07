import mdx from '@next/mdx';

const withMDX = mdx();

const nextConfig = withMDX({
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx'],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: false,
      },
    ];
  },
});

export default nextConfig;
