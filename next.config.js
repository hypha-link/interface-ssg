module.exports = {
  reactStrictMode: true,
}

module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
    }
  },
}

module.exports = {
  images: {
    domains: ['robohash.org', 'ipfs.io'],
  },
  webpack(config) {
    config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack']
    });

    return config;
  },
}