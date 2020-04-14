import Paper from '@material-ui/core/Paper';
import { useRef, useEffect } from 'react';
import { ContentBox } from './Typography';

export default ({ center, features, category }) => {
    const mapRef = useRef(null);

    const mapIcon = type =>
          window.L.divIcon({
              className: 'mapicon-parent',
              html: `<div class="mapicon mapicon-${type} mdi mdi-map-marker"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
          });

    const pointToLayer = (feature, latlng) => {
        const t = feature.properties.type;
        return window.L.featureGroup([
            window.L.marker(latlng, {
                icon: mapIcon(t),
                title: t,
                alt: t,
                riseOnHover: true,
            }),
        ]);
    };

    const onEachFeature = (feature, featureLayer) => {
        featureLayer.bindPopup(
            () => {
                const props = feature.properties;
                const html = [];
                if ('name' in props && props.name) {
                    html.push(`<div><strong>${props.name}</strong></div>`);
                }
                if ('photo' in props && props.photo) {
                    html.push(
                        `<div class='MuiCardMedia-root' style='width: 216px; height: 140px; background-image: url("${props.photo.src}")'></div>`,
                    );
                }
                // TODO: This is not a Nextjs link:
                return `<a href="/${category}/${feature.properties.id}">${html.join('')}</a>`;
            },
            {
                autoPan: true,
                closeButton: true,
                closeOnEscapeKey: true,
                closeOnClick: true,
            },
        );
    };

    const setDynamicStyle = zoom => {
        let scale = zoom / 18;
        if (scale < 0.6) scale = 0.6;
        document.getElementById('mapDynamicStyle').innerHTML = `.mapicon { transform: scale(${
            scale > 1 ? 1 : scale
        }); }`;
    };

    useEffect(() => {
        if (features) {
            if (typeof window === 'object' && typeof window.L === 'object') {
                if (mapRef.current === null) {
                    const osmBaseLayer = window.L.tileLayer(
                        'https://tile.millipede-guide.com/{z}/{x}/{y}.png',
                        {
                            attribution:
                            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                        },
                    );

                    const lGeo = window.L.layerGroup();

                    const lMap = window.L.map('mapContainer', {
                        center,
                        zoom: 4,
                        scrollWheelZoom: true,
                        fullscreenControl: true,
                        fullscreenControlOptions: {
                            position: 'topleft',
                            forceSeparateButton: true,
                            forcePseudoFullscreen: true,
                        },
                        layers: [osmBaseLayer, lGeo],
                    });

                    lMap.on('enterFullscreen', () => {
                        window.setTimeout(() => lMap.invalidateSize(), 100);
                    });
                    
                    lMap.on('exitFullscreen', () => {
                        window.setTimeout(() => lMap.invalidateSize(), 100);
                    });

                    setDynamicStyle(4);

                    lMap.on('zoomend', () => setDynamicStyle(lMap.getZoom()));

                    mapRef.current = { lMap, lGeo };
                }

                mapRef.current.lGeo.clearLayers();

                if (features.length > 0) {
                    const geo = window.L.geoJSON(
                        {
                            type: 'FeatureCollection',
                            features,
                        },
                        {
                            pointToLayer,
                            onEachFeature,
                        },
                    ).addTo(mapRef.current.lGeo);

                    mapRef.current.lMap.fitBounds(geo.getBounds(), {
                        animate: false,
                        padding: [10, 10],
                    });
                }
            }
        }
    }, [features]);

    return (
        <ContentBox>
            <Paper elevation={1}>
                <div id="mapContainer" style={{ height: '25vh' }} />
            </Paper>
            <style id="mapDynamicStyle" />
        </ContentBox>
    );
};
