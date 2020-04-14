module.exports.getFeaturePhoto = photos => {
    if (photos && photos.length > 0) {
        const featured = photos.filter(i => i.feature);
        if (featured.length > 0) {
            return featured[0];
        }
        return photos[0];
    }
    return null;
};
