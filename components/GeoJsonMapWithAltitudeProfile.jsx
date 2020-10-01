/* global process */

import { useRef, useState, useEffect } from 'react';
import humanize from 'underscore.string/humanize';
import { ContentBox } from './Typography';
import GeoJsonMap from './GeoJsonMap';
import GeoJsonAltitudeProfile from './GeoJsonAltitudeProfile';
import { markerIcons, pointToLayer, onEachFeature } from '../utils/mapMarkers';
import photosIndex from '../public/photos/index.json';
import docToGeoJson from '../utils/docToGeoJson';

const geoTemplate = {
    type: 'FeatureCollection',
    features: [],
};

export default function GeoJsonMapWithAltitudeProfile({
    doc,
    category,
    fileName,
    showAltitudeProfile,
}) {
    const [geo, setGeo] = useState(null);
    const lMap = useRef();

    const setDynamicStyle = (zoom) => {
        let scale = zoom / 18;
        if (scale < 0.6) scale = 0.6;
        document.getElementById('mapDynamicStyle').innerHTML = `.mapicon { transform: scale(${
            scale > 1 ? 1 : scale
        }); }`;
    };

    useEffect(() => {
        if (doc && lMap.current && typeof window === 'object' && typeof window.L === 'object') {
            const geoMarkers = docToGeoJson(category, doc, { ...geoTemplate }, photosIndex);
            const featureLayers = lMap.current.currentFeatureLayers;

            Object.keys(markerIcons).forEach((t) => {
                const markerFeatures = geoMarkers.features.filter(
                    (f) => f.geometry.type === 'Point' && f.properties && f.properties.type === t,
                );

                if (markerFeatures.length > 0) {
                    const id = `<span class="mdi mdi-${markerIcons[t]}"></span> ${humanize(t)}`;
                    if (!featureLayers[id]) {
                        featureLayers[id] = window.L.layerGroup().addTo(lMap.current);
                        if (lMap.current.currentLayersControl) {
                            lMap.current.currentLayersControl.addOverlay(featureLayers[id], id);
                        }
                    }
                    featureLayers[id].clearLayers();
                    featureLayers[id].addLayer(
                        window.L.geoJSON(
                            {
                                ...geoTemplate,
                                features: markerFeatures,
                            },
                            {
                                pointToLayer,
                                onEachFeature: (f, l) => onEachFeature(f, l, photosIndex),
                            },
                        ),
                    );
                }
            });

            lMap.current.fitBounds(window.L.geoJSON(geo || geoMarkers).getBounds(), {
                animate: false,
                padding: [20, 20],
            });

            setDynamicStyle(lMap.current.getZoom());

            lMap.current.on('zoomend', () => setDynamicStyle(lMap.current.getZoom()));
        }
    }, [doc, lMap.current]);

    useEffect(() => {
        if (typeof window === 'object' && typeof window.L === 'object') {
            window
                .fetch(`${process.env.ASSET_PREFIX}/content/${category}/${fileName}.geo.json`)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((obj) => {
                            setGeo(obj);
                        });
                    }
                });
        }
    }, []);

    return (
        <ContentBox>
            <GeoJsonMap
                geo={geo}
                callback={(lMapCurrent) => {
                    lMap.current = lMapCurrent;
                }}
            />
            <style id="mapDynamicStyle" />
            {showAltitudeProfile && <GeoJsonAltitudeProfile mapRef={lMap} geo={geo} />}
        </ContentBox>
    );
}
