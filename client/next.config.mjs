/** @type {import('next').NextConfig} */

const redirectsList = [
  {
    from: '/دليل-تحسين-محركات-البحث-في-يانديكس/',
    to: 'https://blog.scarabio.com/دليل-تحسين-محركات-البحث-في-يانديكس/',
  },
  {
    from: '/احسن-محرك-بحث-للصور/',
    to: 'https://blog.scarabio.com/احسن-محرك-بحث-للصور/',
  },
  {
    from: '/أفضل-محركات-بحث-الفيديو/',
    to: 'https://blog.scarabio.com/أفضل-محركات-بحث-الفيديو/',
  },
  {
    from: '/مميزات-محرك-البحث-بينج/',
    to: 'https://blog.scarabio.com/مميزات-محرك-البحث-بينج/',
  },
  {
    from: '/معرفة-ترتيب-موقعك-في-جوجل/',
    to: 'https://blog.scarabio.com/معرفة-ترتيب-موقعك-في-جوجل/',
  },
  {
    from: '/رفع-ترتيب-موقعك-على-جوجل/',
    to: 'https://blog.scarabio.com/رفع-ترتيب-موقعك-على-جوجل/',
  },
  {
    from: '/تحسين-محركات-البحث-في-المواقع-الجديدة/',
    to: 'https://blog.scarabio.com/تحسين-محركات-البحث-في-المواقع-الجديدة/',
  },
  {
    from: '/لماذا-لا-يظهر-موقعك-في-محركات-البحث/',
    to: 'https://blog.scarabio.com/لماذا-لا-يظهر-موقعك-في-محركات-البحث/',
  },
  {
    from: '/دليل-بدء-تحسين-محركات-البحث/',
    to: 'https://blog.scarabio.com/دليل-بدء-تحسين-محركات-البحث/',
  },
  {
    from: '/انواع-محركات-البحث-ومميزاتها/',
    to: 'https://blog.scarabio.com/انواع-محركات-البحث-ومميزاتها/',
  },
  {
    from: '/تحسين-محركات-بحث-لمستشفى-في-جدة/',
    to: 'https://blog.scarabio.com/تحسين-محركات-بحث-لمستشفى-في-جدة/',
  },
  {
    from: '/تحسين-محركات-بحث-لشركة-توظيف/',
    to: 'https://blog.scarabio.com/تحسين-محركات-بحث-لشركة-توظيف/',
  },
  {
    from: '/تحسين-محركات-بحث-لشركة-استشارات-مهن/',
    to: 'https://blog.scarabio.com/تحسين-محركات-بحث-لشركة-استشارات-مهن/',
  },
  {
    from: '/تحسين-محركات-البحث-للعزل-الحراري/',
    to: 'https://blog.scarabio.com/تحسين-محركات-البحث-للعزل-الحراري/',
  },
];

function encode(path) {
  return encodeURI(path);
}

const nextConfig = {
  async redirects() {
    return redirectsList.map(({ from, to }) => ({
      source: encode(from),
      destination: to,
      permanent: true,
    }));
  },
  trailingSlash: true,
};

export default nextConfig;
