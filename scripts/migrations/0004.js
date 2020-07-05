export default (doc) => {
    const { copyright } = doc;
    const { license } = doc;
    delete doc.copyright;
    delete doc.license;
    doc.copyright = copyright;
    doc.license = license;
    return doc;
};
