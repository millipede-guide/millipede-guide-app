module.exports.allPhotosInDocument = doc => {
    return [].concat(
        doc.photos,
        ...[]
            .concat(...[doc.car_parking, doc.water, doc.toilets].filter(Boolean))
            .map(i => i.photos)
            .filter(Boolean),
    );
};
