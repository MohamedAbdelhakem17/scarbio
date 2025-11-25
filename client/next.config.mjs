/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path((?!contact-us|result).+)',
        has: [{ type: 'host', value: 'scarabio.com' }],
        destination: 'https://blog.scarabio.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
