/* eslint-disable no-console */
const fs = require('fs');
const withOffline = require('next-offline');

const nextConfig = {
    exportTrailingSlash: true,
    exportPathMap() {
        const paths = {
            '/': { page: '/' },
            '/log/': {
                page: '/log',
            },
            '/export/': {
                page: '/export',
            },
            '/about/': {
                page: '/about',
            },
            '/privacy/': {
                page: '/privacy',
            },
        };

        ['parks', 'campsites', 'routes', 'attractions'].forEach((category) => {
            paths[`/${category}/all`] = { page: `/${category}/all` };

            JSON.parse(
                fs.readFileSync(`public/export/${category}/index.geo.json`),
            ).features.forEach((item) => {
                paths[`/${category}/${item.properties.id}`] = {
                    page: `/${category}/[id]`,
                    query: {
                        id: item.properties.id,
                    },
                };
            });
        });

        console.log(paths);

        return paths;
    },
};

module.exports = withOffline(nextConfig);
