module.exports.allPhotosInDocument = doc => {
    return [].concat(
        doc.photos || [],
        ...[]
            .concat(...[doc.parking, doc.water, doc.toilets].filter(Boolean))
            .map(i => i.photos)
            .filter(Boolean),
    );
};
