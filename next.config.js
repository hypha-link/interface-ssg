/**
 * @type {import('next').NextConfig}
 */

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

// const withPlugins = require('next-compose-plugins');

const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.tsx',
});

//Plugins go inside array, & configurations after
module.exports = withNextra(nextConfig);
