/** @type {import('next').NextConfig} */
import redirectsList from './src/lib/constants/redirect-list.constant';

const nextConfig = {
  async redirects() {
    return redirectsList.map(item => {
      const cleanedSource = item.from
        .replace('https://scarabio.com', '')
        .replace('http://scarabio.com', '');

      return {
        source: cleanedSource.startsWith('/')
          ? cleanedSource
          : `/${cleanedSource}`,
        destination: item.to,
        permanent: true,
      };
    });
  },
};

export default nextConfig;
