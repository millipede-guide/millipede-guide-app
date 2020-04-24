import fetch from 'isomorphic-unfetch';

const FileSystem = typeof window === 'undefined' ? require('fs') : null;

export default async (filePath) => {
    let content = '';
    if (FileSystem) {
        content = FileSystem.readFileSync(`public${filePath}`, 'utf8');
    } else {
        const response = await fetch(filePath);
        content = await response.text();
    }
    return content;
};
