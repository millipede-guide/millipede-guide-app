/* eslint-disable no-console */

const withOffline = require('next-offline');

let assetPrefix = '';

if (process.env.NODE_ENV === 'production') {
    if (!process.env.CNAME) {
        if (process.env.GITHUB_REPOSITORY) {
            assetPrefix = `/${process.env.GITHUB_REPOSITORY.split('/', 2)[1]}`;
        }
    }
}

console.log('assetPrefix: ', assetPrefix);

const nextConfig = {
    assetPrefix,
    env: {
        appName: process.env.APP_NAME || process.env.GITHUB_ACTOR || 'Draft',
        appShortName: process.env.APP_SHORT_NAME || process.env.GITHUB_ACTOR || 'Draft',
        twitter: process.env.TWITTER || '',
        osmHost: process.env.OSM_HOST || 'a.tile.openstreetmap.org',
        tfApiKey: process.env.TF_API_KEY || '',
        assetPrefix,
        githubRepository: process.env.GITHUB_REPOSITORY,
    },
    exportTrailingSlash: false,
    generateBuildId: async () => 'v1',
};

module.exports = withOffline(nextConfig);
