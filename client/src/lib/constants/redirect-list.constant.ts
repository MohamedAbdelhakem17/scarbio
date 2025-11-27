const redirectsList = [
  {
    from: 'https://scarabio.com/%d8%af%d9%84%d9%8a%d9%84-%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%81%d9%8a-%d9%8a%d8%a7%d9%86%d8%af%d9%83%d8%b3/',
    to: 'https://blog.scarabio.com/%d8%af%d9%84%d9%8a%d9%84-%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%81%d9%8a-%d9%8a%d8%a7%d9%86%d8%af%d9%83%d8%b3/',
  },
  {
    from: 'https://scarabio.com/%d8%a7%d8%ad%d8%b3%d9%86-%d9%85%d8%ad%d8%b1%d9%83-%d8%a8%d8%ad%d8%ab-%d9%84%d9%84%d8%b5%d9%88%d8%b1/',
    to: 'https://blog.scarabio.com/%d8%a7%d8%ad%d8%b3%d9%86-%d9%85%d8%ad%d8%b1%d9%83-%d8%a8%d8%ad%d8%ab-%d9%84%d9%84%d8%b5%d9%88%d8%b1/',
  },
  {
    from: 'https://scarabio.com/%d8%a3%d9%81%d8%b6%d9%84-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a8%d8%ad%d8%ab-%d8%a7%d9%84%d9%81%d9%8a%d8%af%d9%8a%d9%88/',
    to: 'https://blog.scarabio.com/%d8%a3%d9%81%d8%b6%d9%84-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a8%d8%ad%d8%ab-%d8%a7%d9%84%d9%81%d9%8a%d8%af%d9%8a%d9%88/',
  },
  {
    from: 'https://scarabio.com/%d9%85%d9%85%d9%8a%d8%b2%d8%a7%d8%aa-%d9%85%d8%ad%d8%b1%d9%83-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d8%a8%d9%8a%d9%86%d8%ac/',
    to: 'https://blog.scarabio.com/%d9%85%d9%85%d9%8a%d8%b2%d8%a7%d8%aa-%d9%85%d8%ad%d8%b1%d9%83-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d8%a8%d9%8a%d9%86%d8%ac/',
  },
  {
    from: 'https://scarabio.com/%d9%85%d8%b9%d8%b1%d9%81%d8%a9-%d8%aa%d8%b1%d8%aa%d9%8a%d8%a8-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d9%81%d9%8a-%d8%ac%d9%88%d8%ac%d9%84/',
    to: 'https://blog.scarabio.com/%d9%85%d8%b9%d8%b1%d9%81%d8%a9-%d8%aa%d8%b1%d8%aa%d9%8a%d8%a8-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d9%81%d9%8a-%d8%ac%d9%88%d8%ac%d9%84/',
  },
  {
    from: 'https://scarabio.com/%d8%b1%d9%81%d8%b9-%d8%aa%d8%b1%d8%aa%d9%8a%d8%a8-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d8%b9%d9%84%d9%89-%d8%ac%d9%88%d8%ac%d9%84/',
    to: 'https://blog.scarabio.com/%d8%b1%d9%81%d8%b9-%d8%aa%d8%b1%d8%aa%d9%8a%d8%a8-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d8%b9%d9%84%d9%89-%d8%ac%d9%88%d8%ac%d9%84/',
  },
  {
    from: 'https://scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%81%d9%8a-%d8%a7%d9%84%d9%85%d9%88%d8%a7%d9%82%d8%b9-%d8%a7%d9%84%d8%ac%d8%af%d9%8a%d8%af%d8%a9/',
    to: 'https://blog.scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%81%d9%8a-%d8%a7%d9%84%d9%85%d9%88%d8%a7%d9%82%d8%b9-%d8%a7%d9%84%d8%ac%d8%af%d9%8a%d8%af%d8%a9/',
  },
  {
    from: 'https://scarabio.com/%d9%84%d9%85%d8%a7%d8%b0%d8%a7-%d9%84%d8%a7-%d9%8a%d8%b8%d9%87%d8%b1-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d9%81%d9%8a-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab/',
    to: 'https://blog.scarabio.com/%d9%84%d9%85%d8%a7%d8%b0%d8%a7-%d9%84%d8%a7-%d9%8a%d8%b8%d9%87%d8%b1-%d9%85%d9%88%d9%82%d8%b9%d9%83-%d9%81%d9%8a-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab/',
  },
  {
    from: 'https://scarabio.com/%d8%af%d9%84%d9%8a%d9%84-%d8%a8%d8%af%d8%a1-%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab/',
    to: 'https://blog.scarabio.com/%d8%af%d9%84%d9%8a%d9%84-%d8%a8%d8%af%d8%a1-%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab/',
  },
  {
    from: 'https://scarabio.com/%d8%a7%d9%86%d9%88%d8%a7%d8%b9-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%88%d9%85%d9%85%d9%8a%d8%b2%d8%a7%d8%aa%d9%87%d8%a7/',
    to: 'https://blog.scarabio.com/%d8%a7%d9%86%d9%88%d8%a7%d8%b9-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%88%d9%85%d9%85%d9%8a%d8%b2%d8%a7%d8%aa%d9%87%d8%a7/',
  },
  {
    from: 'https://scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d9%85%d8%b3%d8%aa%d8%b4%d9%81%d9%89-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9/',
    to: 'https://blog.scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d9%85%d8%b3%d8%aa%d8%b4%d9%81%d9%89-%d9%81%d9%8a-%d8%ac%d8%af%d8%a9/',
  },
  {
    from: 'https://scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d8%b4%d8%b1%d9%83%d8%a9-%d8%aa%d9%88%d8%b8%d9%8a%d9%81/',
    to: 'https://blog.scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d8%b4%d8%b1%d9%83%d8%a9-%d8%aa%d9%88%d8%b8%d9%8a%d9%81/',
  },
  {
    from: 'https://scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d8%b4%d8%b1%d9%83%d8%a9-%d8%a7%d8%b3%d8%aa%d8%b4%d8%a7%d8%b1%d8%a7%d8%aa-%d9%85%d9%87%d9%86/',
    to: 'https://blog.scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d8%b4%d8%b1%d9%83%d8%a9-%d8%a7%d8%b3%d8%aa%d8%b4%d8%a7%d8%b1%d8%a7%d8%aa-%d9%85%d9%87%d9%86/',
  },
  {
    from: 'https://scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d9%84%d8%b9%d8%b2%d9%84-%d8%a7%d9%84%d8%ad%d8%b1%d8%a7%d8%b1%d9%8a/',
    to: 'https://blog.scarabio.com/%d8%aa%d8%ad%d8%b3%d9%8a%d9%86-%d9%85%d8%ad%d8%b1%d9%83%d8%a7%d8%aa-%d8%a7%d9%84%d8%a8%d8%ad%d8%ab-%d9%84%d9%84%d8%b9%d8%b2%d9%84-%d8%a7%d9%84%d8%ad%d8%b1%d8%a7%d8%b1%d9%8a/',
  },
] as const;

export default redirectsList;
