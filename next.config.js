/**
 * @type {import('next').NextConfig}
 */

const withPlugins = require('next-compose-plugins');
const withExportImages = require('next-export-optimize-images');

const nextConfig = {
	trailingSlash: true,
	reactStrictMode: true,
	images: {
		domains: ['robohash.org', 'ipfs.io'],
	},
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
};

const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.tsx',
});

//Plugins go inside array, & configurations after
module.exports = withPlugins([withNextra, withExportImages],
  nextConfig
);
