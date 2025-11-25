/** @type {import('next').NextConfig} */

const EXCLUDED_PATHS = ['/', '/contact-us', '/result'];

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'scarabio.com',
          },
        ],
        missing: EXCLUDED_PATHS.map((path) => ({
          type: 'path',
          value: path,
        })),
        destination: 'https://blog.scarabio.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

