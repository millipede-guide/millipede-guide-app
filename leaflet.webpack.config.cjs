const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: './public/leaflet.mjs',
    output: {
        filename: 'leaflet.js',
        path: path.resolve(__dirname, 'public'),
    },
};
