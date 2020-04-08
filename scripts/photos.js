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
const crypto = require('crypto');
const { allPhotosInDocument } = require('../utils/allPhotosInDocument');

const regenerate = process.argv.indexOf('-r') !== -1;

const indexFilePath = 'public/photos/index.json';

const index = {};

const addSrc = (src, page) => {
    if (index[src] === undefined) index[src] = {};
    if (index[src].pages === undefined) index[src].pages = [];
    index[src].pages.push(page);
    index[src].hash = crypto
        .createHash('md5')
        .update(src)
        .digest('hex');
    index[src].ext = Path.extname(src).toLowerCase();
};

const sitePhotos = JSON.parse(FS.readFileSync('utils/sitePhotos.json'));

Object.values(sitePhotos).forEach(({ src }) => addSrc(src, 'site'));

console.log('Loading YAML:');

['attractions', 'campsites', 'parks', 'routes'].forEach(category => {
    Glob.sync(`public/docs/${category}/**/*.yaml`).forEach(fpath => {
        console.log(' ', fpath);
        const doc = YAML.safeLoad(FS.readFileSync(fpath));
        const photos = allPhotosInDocument(doc);
        // console.log(photos);
        photos.forEach(({ src }) => addSrc(src, fpath.replace('public/docs', '')));
    });
});

const cacheFilePath = url => Path.join('public/photos/orig', index[url].hash) + index[url].ext;

const resizedFilePath = (url, dir) => `${Path.join('public/photos', dir, index[url].hash)}.jpg`;

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
                        if ('exif' in data && 'DateTimeOriginal' in data.exif) {
                            index[url].year = moment(
                                data.exif.DateTimeOriginal,
                                'YYYY:MM:DD HH:mm:ss',
                            ).year();
                        }
                        if ('gps' in data && 'GPSLatitude' in data.gps) {
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
        const outFile = resizedFilePath(url, dir);
        if (regenerate || !FS.existsSync(outFile)) {
            // https://sharp.pixelplumbing.com/api-resize
            Sharp(path)
                .resize(options)
                .toFormat('jpg')
                .toFile(outFile, err => {
                    if (err) {
                        console.log(`RESIZE FAILED! (${dir}): ${url}`);
                        console.log('  ', err);
                    } else {
                        console.log(`RESIZE OK (${dir}): ${url}`);
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
        const response = await fetch(url);
        if (response.ok) {
            let ok = false;
            const fileStream = FS.createWriteStream(path);
            await new Promise((resolve, reject) => {
                response.body.pipe(fileStream);
                response.body.on('error', err => {
                    console.log(`DOWNLOAD FAILED! ${url}`);
                    reject(err);
                });
                fileStream.on('finish', () => {
                    console.log(`DOWNLOAD OK: ${url}`);
                    ok = true;
                    resolve();
                });
            });
            return ok;
        } else {
            console.log(`DOWNLOAD ERROR! (${response.status}) ${url}`);
            return false;
        }
    } else {
        console.log(`EXISTS: ${url}`);
        return true;
    }
};

const processFile = async url => {
    if (await downloadFile(url)) {
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
    }
};

Promise.all(Object.keys(index).map(url => processFile(url))).then(() => {
    console.log('Done!');
    FS.writeFileSync(indexFilePath, JSON.stringify(index, null, 4));
});
