/* eslint-disable no-console */
const withOffline = require('next-offline');

const nextConfig = {
    env: {
        appName: process.env.APP_NAME,
        osmHost: process.env.OSM_HOST,
        tfApiKey: process.env.TF_API_KEY,
    },
    distDir: 'build',
    exportTrailingSlash: false,
};

module.exports = withOffline(nextConfig);
