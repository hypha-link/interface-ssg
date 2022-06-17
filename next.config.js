const withPlugins = require("next-compose-plugins");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});

//Plugins go inside array, & configurations after
module.exports = withPlugins([withNextra], {
  trailingSlash: true,
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/app': { page: '/app' },
      '/network': { page: '/network' },
      '/roadmap': { page: '/roadmap' },
    };
  },
  images: {
    domains: ["robohash.org", "ipfs.io"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
});
