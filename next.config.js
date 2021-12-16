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
      '/app': { page: '/app' },
    }
  },
}