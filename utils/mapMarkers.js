import humanize from 'underscore.string/humanize';

export const markerTypes = [
    'toilets',
    'water',
    'shelter',
    'photo',
    'transport',
    'parking',
    'information',
];

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
    information: 'information-variant',
};

export const mapIcon = (type) =>
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

export const mapLinkOSM = (location, osm) =>
    `https://www.openstreetmap.org/${
        osm
            ? Object.keys(osm).map((i) => `${i}/${osm[i]}`)[0]
            : `#map=19/${location[0]}/${location[1]}`
    }`;
export const mapLinkGoogle = (location) =>
    `https://www.google.com/maps/dir/?api=1&destination=${location[0]},${location[1]}`;
export const mapLinkApple = (location) =>
    `http://maps.apple.com/?daddr=${location[0]},${location[1]}`;

export const onEachFeature = (feature, featureLayer) => {
    featureLayer.bindPopup(
        () => {
            const props = feature.properties;
            const html = [];
            if (props.photo) {
                html.push(
                    `<div class='MuiCardMedia-root' style='width: 216px; height: 140px; border-radius: 4px; background-image: url("${props.photo.src}")'></div>`,
                );
            }
            if (props.name) {
                html.push(
                    `<div style="font-weight: bold; font-size: 14px; margin: 8px 0 0 0;">${props.name}</div>`,
                );
            }
            if (props.tags) {
                const tags = Object.keys(props.tags)
                    .map((i) => `<strong>${i}</strong>: ${props.tags[i]}`)
                    .join(', ');
                html.push(`<div>${tags}</div>`);
            }
            const location = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            const links = [
                `<a href="${mapLinkOSM(
                    location,
                    props.osm,
                )}"><span class="mdi mdi-map"></span></a>`,
                `<a href="${mapLinkGoogle(
                    location,
                )}"><span class="mdi mdi-google-maps"></span></a>`,
                `<a href="${mapLinkApple(location)}"><span class="mdi mdi-apple"></span></a>`,
            ];
            html.push(`<div class="map-popup-link-icons">${links.join('&nbsp;&nbsp;')}</div>`);
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
