/** @type {import('next').NextConfig} */

const EXCLUDED_PATHS = ['/', '/contact', '/result'];

const excludedRegex = new RegExp(
  `^(${EXCLUDED_PATHS.map(path => path.replace(/\//g, '\\/')).join('|')})$`
);

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'scarabio.com' },
        ],
        permanent: true,
        destination: ({ params }) => {
          const path = '/' + (params.path || '');
          if (excludedRegex.test(path)) {
            return null;
          }
          return `https://blog.scarabio.com/${params.path || ''}`;
        },
      },
    ];
  },
};

export default nextConfig;
