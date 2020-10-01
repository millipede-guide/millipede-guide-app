import { useEffect, useState } from 'react';
import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import prettyMetric from 'pretty-metric';
import AltitudeProfileContainer from './AltitudeProfileContainer';

Chart.defaults.global.elements.line.borderColor = '#558b2f88';
// Chart.defaults.global.elements.line.backgroundColor = '#558b2f55';
Chart.defaults.global.elements.line.backgroundColor = '#00000011';
Chart.defaults.global.animation.duration = 0;

export default function GeoJsonAltitudeProfile({ mapRef, geo }) {
    const [stats, setStats] = useState({});

    useEffect(() => {
        if (geo !== null && typeof geo === 'object' && geo.type === 'FeatureCollection') {
            if (typeof window === 'object' && typeof window.L === 'object') {
                const altitudeMarker = window.L.marker([0, 0], {
                    icon: window.L.divIcon({
                        className: 'mapicon-altitude',
                        iconSize: [6, 6],
                        iconAnchor: [3, 3],
                    }),
                });

                const lineString = geo.features.filter(
                    (f) => f.type === 'Feature' && f.geometry && f.geometry.type === 'LineString',
                )[0];

                if (lineString !== undefined) {
                    let dist = 0;
                    let prevPoint = null;
                    let prevAlt = null;
                    let asc = 0;
                    let desc = 0;
                    let gain = 0;
                    let loss = 0;

                    const altitudeProfile = lineString.geometry.coordinates
                        .map(([lng, lat, alt]) => {
                            const ll = window.L.latLng(lat, lng, alt);
                            if (prevPoint) {
                                const step = prevPoint.distanceTo(ll);
                                if (step < 20) return null;
                                dist += step;
                                if (alt > prevAlt) {
                                    gain += alt - prevAlt;
                                    asc += step;
                                } else {
                                    loss += prevAlt - alt;
                                    desc += step;
                                }
                            }
                            prevAlt = alt;
                            prevPoint = ll;
                            return {
                                x: Math.round(dist),
                                y: alt,
                                latlng: ll,
                            };
                        })
                        .filter((i) => i !== null);

                    const altMax = altitudeProfile.reduce(
                        (val, obj) => (obj.y > val ? obj.y : val),
                        0,
                    );
                    const altMin = altitudeProfile.reduce(
                        (val, obj) => (obj.y < val ? obj.y : val),
                        altMax,
                    );

                    const median = (ary) =>
                        ary.length === 0 ? -1 : ary[Math.floor((ary.length - 1) / 2)];

                    const altMaxIndex = median(
                        altitudeProfile
                            .map((obj, i) => (obj.y === altMax ? i : null))
                            .filter((i) => i !== null),
                    );
                    const altMinIndex = median(
                        altitudeProfile
                            .map((obj, i) => (obj.y === altMin ? i : null))
                            .filter((i) => i !== null),
                    );

                    const rounder = (val) => {
                        if (val > 10000) return Math.round(val / 1000) * 1000;
                        if (val > 1000) return Math.round(val / 100) * 100;
                        if (val > 100) return Math.round(val / 10) * 10;
                        return val;
                    };

                    setStats({
                        dist: prettyMetric(rounder(dist)).humanize(),
                        asc: prettyMetric(rounder(asc)).humanize(),
                        gain: prettyMetric(rounder(gain)).humanize(),
                        desc: prettyMetric(rounder(desc)).humanize(),
                        loss: prettyMetric(rounder(loss)).humanize(),
                    });

                    const altitudeProfileContainer = document.getElementById('altitudeProfile');

                    /* eslint-disable no-new */
                    new Chart(altitudeProfileContainer, {
                        type: 'scatter',
                        data: {
                            datasets: [
                                {
                                    data: altitudeProfile,
                                    showLine: true,
                                    radius: 0,
                                },
                            ],
                        },
                        options: {
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                            },
                            events: ['click'],
                            tooltips: {
                                mode: 'nearest',
                                intersect: false,
                                axis: 'x',
                                displayColors: false,
                                callbacks: {
                                    label: (item) => {
                                        const { x, y, latlng } = altitudeProfile[item.index];
                                        const label = `${prettyMetric(
                                            x,
                                        ).humanize()} (altitude ${y}m)`;
                                        if (mapRef.current) {
                                            mapRef.current.panTo(latlng, {
                                                animate: true,
                                                duration: 1,
                                            });
                                            altitudeMarker.addTo(mapRef.current);
                                            altitudeMarker.unbindTooltip();
                                            altitudeMarker.setLatLng(latlng);
                                            altitudeMarker.bindTooltip(label, {
                                                permanent: true,
                                                offset: [0, 0],
                                            });
                                        }
                                        return label;
                                    },
                                },
                            },
                            scales: {
                                yAxes: [
                                    {
                                        display: false,
                                        ticks: {
                                            min: altMin - 20,
                                            max: altMax + 10,
                                        },
                                    },
                                ],
                                xAxes: [
                                    {
                                        gridLines: {
                                            display: false,
                                            drawTicks: false,
                                        },
                                        ticks: {
                                            display: false,
                                            beginAtZero: true,
                                            min: 0,
                                            max: dist,
                                        },
                                    },
                                ],
                            },
                            plugins: {
                                datalabels: {
                                    clip: false,
                                    clamp: true,
                                    offset: (context) => {
                                        return context.dataIndex === altMaxIndex ? 0 : 5;
                                    },
                                    align: (context) => {
                                        const i = context.dataIndex;
                                        const l = context.dataset.data.length;
                                        const a = 270;
                                        if (i >= l * 0.9) return a - 45;
                                        if (i <= l * 0.1) return a + 45;
                                        return a;
                                    },
                                    font: {
                                        weight: 600,
                                    },
                                    display: (context) =>
                                        (context.dataIndex === altMinIndex ||
                                            context.dataIndex === altMaxIndex) &&
                                        altMinIndex !== altMaxIndex,
                                    formatter: (p) => `${rounder(p.y)}m`,
                                },
                            },
                            layout: {
                                padding: {
                                    top: 20,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                },
                            },
                        },
                    });
                    /* eslint-enable no-new */
                }
            }
        }
    }, [geo]);

    return <AltitudeProfileContainer stats={stats} />;
}
