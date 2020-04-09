/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

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

const photosDirPath = 'public/photos';
const indexFilePath = Path.join(photosDirPath, 'index.json');

// https://stackoverflow.com/a/51302466/5165
const download = (src, filePath) =>
    new Promise(resolve => {
        console.log('Fetch...');
        if (FS.existsSync(filePath) && !regenerate) {
            console.log(' > EXISTS');
            resolve(true);
        } else {
            console.log('DOWNLOADING...');
            fetch(src)
                .then(response => {
                    if (!response.ok) {
                        console.log(` > ERROR ${response.status}`);
                        resolve(false);
                    } else {
                        const fileStream = FS.createWriteStream(filePath);
                        response.body.pipe(fileStream);
                        response.body.on('error', () => {
                            console.log(` > FAILED!`);
                            resolve(false);
                        });
                        fileStream.on('finish', () => {
                            console.log(` > OK`);
                            if (src.indexOf('wikipedia') !== -1) {
                                setTimeout(() => resolve(true), 1000);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                })
                .catch(() => {
                    console.log(` > ERROR`);
                    resolve(false);
                });
        }
    });

const resize = (inFilePath, outFilePath, width, height) =>
    new Promise(resolve => {
        console.log(`Resize ${width}x${height}...`);
        if (FS.existsSync(outFilePath) && !regenerate) {
            console.log(' > EXISTS');
            resolve();
        } else {
            // https://sharp.pixelplumbing.com/api-resize
            Sharp(inFilePath)
                .resize({
                    width,
                    height,
                    fit: Sharp.fit.inside,
                })
                .toFormat('jpg')
                .toFile(outFilePath, err => {
                    console.log(` > ${err ? 'ERROR' : 'OK'}`);
                    resolve();
                });
        }
    });

const dmsToDecimal = ([d, m, s]) => (d + m / 60 + s / 3600).toFixed(6);

const extractExif = (filePath, obj) =>
    new Promise(resolve => {
        console.log('EXIF...');
        if (obj.exif !== undefined && !regenerate) {
            console.log(` > ${obj.exif}`);
            resolve();
        } else {
            /* eslint-disable no-new */
            new ExifImage(
                {
                    image: filePath,
                },
                (error, data) => {
                    if (error) {
                        obj.exif = false;
                    } else {
                        obj.exif = true;
                        if ('exif' in data && 'DateTimeOriginal' in data.exif) {
                            obj.year = moment(
                                data.exif.DateTimeOriginal,
                                'YYYY:MM:DD HH:mm:ss',
                            ).year();
                            console.log(` > ${obj.year}`);
                        }
                        if ('gps' in data && 'GPSLatitude' in data.gps) {
                            obj.location = [
                                dmsToDecimal(data.gps.GPSLatitude) *
                                    (data.gps.GPSLatitudeRef === 'N' ? 1 : -1),
                                dmsToDecimal(data.gps.GPSLongitude) *
                                    (data.gps.GPSLongitudeRef === 'E' ? 1 : -1),
                            ];
                            console.log(` > ${obj.location[0]},${obj.location[0]}`);
                        }
                    }
                    console.log(` > ${obj.exif}`);
                    resolve();
                },
            );
            /* eslint-enable no-new */
        }
    });

const run = async index => {
    const addSrc = async (src, page) => {
        console.log(src);
        const obj = index[src] === undefined ? {} : index[src];
        if (obj.pages === undefined) obj.pages = [];
        if (obj.pages.indexOf(page) === -1) {
            obj.pages.push(page);
        }
        obj.hash = crypto
            .createHash('md5')
            .update(src)
            .digest('hex');
        obj.ext = Path.extname(src).toLowerCase();
        const filePath = Path.join(photosDirPath, 'orig', obj.hash) + obj.ext;
        obj.ok = await download(src, filePath);
        if (obj.ok) {
            await resize(filePath, `${Path.join(photosDirPath, 'sm', obj.hash)}.jpg`, 640, 480);
            await resize(filePath, `${Path.join(photosDirPath, 'lg', obj.hash)}.jpg`, 1400, 800);
            await extractExif(filePath, obj);
        }
        index[src] = obj;
        return true;
    };

    console.log('Site photos:');

    for (const { src } of Object.values(JSON.parse(FS.readFileSync('utils/sitePhotos.json')))) {
        await addSrc(src, 'sitePhotos');
    }

    console.log('Loading YAML:');

    for (const category of ['attractions', 'campsites', 'parks', 'routes']) {
        for (const filePath of Glob.sync(`public/docs/${category}/**/*.yaml`)) {
            console.log(filePath);
            const doc = YAML.safeLoad(FS.readFileSync(filePath));
            if (doc.draft === 't') {
                console.log(' > DRAFT');
            } else {
                const photos = allPhotosInDocument(doc);
                for (const { src } of photos) {
                    await addSrc(src, filePath.replace('public/docs', ''));
                }
            }
        }
    }

    return index;
};

run(FS.existsSync(indexFilePath) ? JSON.parse(FS.readFileSync(indexFilePath)) : {}).then(index => {
    FS.writeFileSync(indexFilePath, JSON.stringify(index, null, 4));
});
