module.exports.allPhotosInDocument = (doc) => {
    return [
        ...(doc.photos || []),
        ...[].concat(
            ...['infrastructure', 'natural'].map((key) =>
                [].concat(
                    ...[]
                        .concat(...Object.values(doc[key] || {}))
                        .map((i) => i.photos)
                        .filter(Boolean),
                ),
            ),
        ),
    ];
};
