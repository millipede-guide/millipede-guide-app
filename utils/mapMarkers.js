import humanize from 'underscore.string/humanize';

export const markerTypes = ['toilets', 'water', 'shelter', 'photo', 'transport', 'parking'];

export const markerIcons = {
    parks: 'pine-tree',
    campsites: 'tent',
    routes: 'flag-variant',
    attractions: 'binoculars',
    parking: 'parking',
    photo: 'camera',
    shelter: 'home-variant',
    toilets: 'human-male-female',
    transport: 'bus',
    water: 'water-pump',
};

export const mapIcon = type =>
    window.L.divIcon({
        className: 'mapicon-parent',
        html: `<div class="mapicon mapicon-${type} mdi mdi-${markerIcons[type]}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });

export const pointToLayer = (feature, latlng) => {
    const t = feature.properties.type;
    return window.L.marker(latlng, {
        icon: mapIcon(t),
        title: humanize(t),
        alt: humanize(t),
        zIndexOffset: 1000 + (markerTypes.length - markerTypes.indexOf(t)) * 10,
        riseOnHover: true,
    });
};

export const onEachFeature = (feature, featureLayer) => {
    featureLayer.bindPopup(
        () => {
            const props = feature.properties;
            const html = [];
            if ('photo' in props && props.photo) {
                html.push(
                    `<div class='MuiCardMedia-root' style='width: 216px; height: 140px; border-radius: 4px; background-image: url("${props.photo.src}")'></div>`,
                );
            }
            if ('name' in props && props.name) {
                html.push(
                    `<div style="font-weight: bold; font-size: 14px; margin: 8px 0 0 0;">${props.name}</div>`,
                );
            }
            if (props.href) {
                // TODO: This is not a Nextjs link:
                return `<div style='text-align: center;'><a href="${
                    props.href
                }" style="color: black; text-decoration: none;">${html.join('')}</a></div>`;
            }
            return `<div style='text-align: center;'>${html.join('')}</div>`;
        },
        {
            autoPan: true,
            autoPanPadding: [40, 10],
            closeButton: false,
            closeOnEscapeKey: true,
            closeOnClick: true,
            minWidth: 220,
            maxWidth: 220,
        },
    );
};
