/* eslint-disable no-console */
const fs = require('fs');

module.exports = {
    exportTrailingSlash: true,
    exportPathMap() {
        const paths = {
            '/': { page: '/' },
            '/about/': {
                page: '/about',
            },
            '/export/': {
                page: '/export',
            },
        };

        ['parks', 'campsites', 'routes', 'attractions'].forEach(category => {
            paths[`/${category}/all`] = { page: `/${category}/all` };

            JSON.parse(fs.readFileSync(`public/export/${category}/index.json`)).forEach(item => {
                paths[`/${category}/${item.id}`] = {
                    page: `/${category}/[id]`,
                    query: {
                        id: item.id,
                    },
                };
            });
        });

        console.log(paths);

        return paths;
    },
};
