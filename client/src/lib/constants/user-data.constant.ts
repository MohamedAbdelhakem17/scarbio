const SOCIAL_MEDIA_LINKS = [
  // {
  //   label: 'Tiktok',
  //   href: '#',
  //   footer: '/assets/icons/tiktok.svg',
  //   contact: '/assets/icons/ic_baseline-tiktok.svg',
  // },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ScarabioTool',
    footer: '/assets/icons/facebook.svg',
    contact: '/assets/icons/ic_baseline-facebook.svg',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/scarabio.tool/',
    footer: '/assets/icons/instagram.svg',
    contact: '/assets/icons/mdi_instagram.svg',
  },
  {
    label: 'Linkedin',
    href: 'https://www.linkedin.com/company/scarabio/',
    footer: '/assets/icons/linkedin.svg',
    contact: '/assets/icons/mdi_linkedin.svg',
  },
] as const;

const USER_DATA = {
  email: 'info@scarabio.com',
  // phone: '+201020125408',
} as const;

export { SOCIAL_MEDIA_LINKS, USER_DATA };
