module.exports.allPhotosInDocument = doc => {
    return [].concat(
        doc.photos || [],
        ...[]
            .concat(
                ...[
                    doc.parking,
                    doc.water,
                    doc.toilets,
                    doc.shelter,
                    doc.park_office,
                    doc.visitor_centre,
                ].filter(Boolean),
            )
            .map(i => i.photos)
            .filter(Boolean),
    );
};
