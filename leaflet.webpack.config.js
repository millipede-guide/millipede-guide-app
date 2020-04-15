const path = require('path');

module.exports = {
    mode: 'production',
    target: 'web',
    entry: './leaflet.js',
    output: {
        filename: 'leaflet.js',
        path: path.resolve(__dirname, 'public'),
    },
};
