const withOffline = require('next-offline');

const nextConfig = {
    env: {
        appName: process.env.APP_NAME || 'Millipede Guide',
        appShortName: process.env.APP_SHORT_NAME || 'Millipede',
        twitter: process.env.TWITTER || '@millipedeguide',
        osmHost: process.env.OSM_HOST || 'a.tile.openstreetmap.org',
        tfApiKey: process.env.TF_API_KEY || '',
        githubRepository:
            process.env.GITHUB_REPOSITORY || 'millipede-guide/millipede-guide-content',
    },
    exportTrailingSlash: false,
};

module.exports = withOffline(nextConfig);
