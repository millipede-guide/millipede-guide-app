import fetch from 'isomorphic-unfetch';

const FS = typeof window === 'undefined' ? require('fs') : null;

const getPath = (dir, id, ext) =>
    `${dir}/${id
        .split('~')
        .reverse()
        .join('/')}.${ext}`;

export default async (dir, id, ext) => {
    const filePath = getPath(dir, id, ext);
    let content = '';
    if (FS) {
        content = FS.readFileSync(`public${filePath}`, 'utf8');
        if (ext === 'json' || ext === 'geo.json') {
            content = JSON.parse(content);
        }
    } else {
        const response = await fetch(filePath);
        if (ext === 'json' || ext === 'geo.json') {
            content = await response.json();
        } else {
            content = await response.text();
        }
    }
    return { content, path: filePath };
};
