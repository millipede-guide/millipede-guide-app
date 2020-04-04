/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

const FS = require('fs');
const Glob = require('glob');
const YAML = require('js-yaml');
const fetch = require('isomorphic-unfetch');
const Path = require('path');
const Sharp = require('sharp');
const { ExifImage } = require('exif');
const moment = require('moment');
const { allPhotosInDocument } = require('../utils/allPhotosInDocument');

const regenerate = process.argv.indexOf('-r') !== -1;

const indexFilePath = 'public/photos/index.json';

const index = JSON.parse(FS.readFileSync(indexFilePath));
let counter = Math.max(0, ...Object.values(index).map(i => parseInt(i.cache, 10))); // TODO

// https://stackoverflow.com/a/10073761/5165
const pad = number => (number <= 99999 ? `0000${number}`.slice(-5) : number);

console.log('Loading YAML:');

['attractions', 'campsites', 'parks', 'routes'].forEach(category => {
    Glob.sync(`public/docs/${category}/**/*.yaml`).forEach(fpath => {
        console.log(' ', fpath);
        const doc = YAML.safeLoad(FS.readFileSync(fpath));
        const photos = allPhotosInDocument(doc);
        // console.log(photos);
        photos.forEach(({ src }) => {
            if (index[src] === undefined) index[src] = {};
            index[src].cache =
                pad('cache' in index[src] ? parseInt(index[src].cache, 10) : (counter += 1)) +
                Path.extname(src).toLowerCase();
        });
    });
});

const cacheFilePath = url => Path.join('public/photos/orig/', index[url].cache);

const dmsToDecimal = ([d, m, s]) => (d + m / 60 + s / 3600).toFixed(6);

const extractExif = url =>
    new Promise(resolve => {
        // TODO: Also extract license info: https://wiki.creativecommons.org/wiki/XMP
        if (regenerate || index[url].exif === undefined) {
            /* eslint-disable no-new */
            new ExifImage(
                {
                    image: cacheFilePath(url),
                },
                (error, data) => {
                    if (error) {
                        index[url].exif = false;
                    } else {
                        if ('DateTimeOriginal' in data.exif) {
                            index[url].year = moment(
                                data.exif.DateTimeOriginal,
                                'YYYY:MM:DD HH:mm:ss',
                            ).year();
                        }
                        if ('GPSLatitude' in data.gps) {
                            index[url].location = [
                                dmsToDecimal(data.gps.GPSLatitude) *
                                    (data.gps.GPSLatitudeRef === 'N' ? 1 : -1),
                                dmsToDecimal(data.gps.GPSLongitude) *
                                    (data.gps.GPSLongitudeRef === 'E' ? 1 : -1),
                            ];
                            console.log(`LOCATION: ${JSON.stringify(index[url].location)}`);
                        }
                        index[url].exif = true;
                    }
                    resolve();
                },
            );
            /* eslint-enable no-new */
        } else {
            resolve();
        }
    });

const resizeFile = (url, dir, options) =>
    new Promise(resolve => {
        const path = cacheFilePath(url);
        const outFile = path.replace('orig', dir);
        if (regenerate || !FS.existsSync(outFile)) {
            // https://sharp.pixelplumbing.com/api-resize
            Sharp(path)
                .resize(options)
                .toFile(outFile, err => {
                    if (err) {
                        console.log(`ERROR! (${dir})`);
                    } else {
                        console.log(`RESIZED OK (${dir})`);
                    }
                    resolve();
                });
        } else {
            resolve();
        }
    });

// https://stackoverflow.com/a/51302466/5165
const downloadFile = async url => {
    const path = cacheFilePath(url);
    if (regenerate || !FS.existsSync(path)) {
        console.log(`DOWNLOADING: ${url}`);
        const res = await fetch(url);
        const fileStream = FS.createWriteStream(path);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on('error', err => {
                console.log(`ERROR: ${url}`);
                reject(err);
            });
            fileStream.on('finish', () => {
                console.log(`OK: ${url}`);
                resolve();
            });
        });
    } else {
        console.log(`EXISTS: ${url}`);
    }
};

const processFile = async url => {
    await downloadFile(url);
    await Promise.all([
        extractExif(url),
        resizeFile(url, 'sm', {
            width: 640,
            height: 480,
            fit: Sharp.fit.inside,
        }),
        resizeFile(url, 'lg', {
            width: 1400,
            height: 800,
            fit: Sharp.fit.inside,
        }),
    ]);
};

Promise.all(Object.keys(index).map(url => processFile(url))).then(() => {
    console.log('Done!');
    FS.writeFileSync(indexFilePath, JSON.stringify(index, null, 4));
});
