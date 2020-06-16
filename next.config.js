const withOffline = require('next-offline');

const nextConfig = {
    env: {
        appName: process.env.APP_NAME,
        appShortName: process.env.APP_SHORT_NAME,
        osmHost: process.env.OSM_HOST,
        tfApiKey: process.env.TF_API_KEY,
        githubUrl: process.env.GH_PROJECT_URL,
        githubDocsUrl: process.env.GH_DOCS_URL,
    },
    exportTrailingSlash: false,
};

module.exports = withOffline(nextConfig);
