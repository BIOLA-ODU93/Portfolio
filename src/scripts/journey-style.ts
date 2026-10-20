/**
 * Map style for the journey — a quiet, dark map in the site palette.
 * Uses the OpenMapTiles schema. PROTOTYPE: tiles and fonts come from
 * OpenFreeMap; for production these will be self-hosted (see README).
 */
import type { StyleSpecification } from 'maplibre-gl';

const TILES = 'https://tiles.openfreemap.org/planet';
const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';

const c = {
  land: '#16110d',
  water: '#0b0806',
  park: '#161a10',
  minor: '#241d17',
  major: '#352b22',
  motorway: '#45382c',
  building: '#30271f',
  border: 'rgba(168, 159, 136, 0.35)',
  label: '#a3958a',
  labelStrong: '#a89f88',
};

const width = (base: number) =>
  ['interpolate', ['exponential', 1.6], ['zoom'], 6, base * 0.15, 10, base * 0.5, 14, base * 2.2, 17, base * 9] as any;

const label = (id: string, filter: any, minzoom: number, size: number, color: string): any => ({
  id, type: 'symbol', source: 'omt', 'source-layer': 'place', minzoom, filter,
  layout: {
    'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']],
    'text-font': ['Noto Sans Regular'],
    'text-size': size,
    'text-transform': 'uppercase',
    'text-letter-spacing': 0.18,
  },
  paint: { 'text-color': color, 'text-halo-color': c.land, 'text-halo-width': 1.2 },
});

export const journeyStyle: StyleSpecification = {
  version: 8,
  projection: { type: 'globe' },
  glyphs: GLYPHS,
  sources: { omt: { type: 'vector', url: TILES, attribution: '© OpenStreetMap contributors · OpenFreeMap' } },
  // a dark haze where the tilted map meets the sky
  sky: { 'sky-color': '#11100d', 'horizon-color': '#251d16', 'sky-horizon-blend': 0.8, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 5, 0.2, 7, 0] } as any,
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': c.land } },
    { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': c.water } },
    {
      id: 'park', type: 'fill', source: 'omt', 'source-layer': 'landcover', minzoom: 9,
      filter: ['in', ['get', 'class'], ['literal', ['grass', 'wood', 'forest']]],
      paint: { 'fill-color': c.park, 'fill-opacity': 0.7 },
    },
    {
      id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', minzoom: 8,
      paint: { 'line-color': c.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 3] },
    },
    {
      id: 'border', type: 'line', source: 'omt', 'source-layer': 'boundary',
      filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': c.border, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 8, 1.2], 'line-dasharray': [3, 2] },
    },
    {
      id: 'roads-minor', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 11,
      filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'tertiary', 'street']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.minor, 'line-width': width(0.8) },
    },
    {
      id: 'roads-major', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 6,
      filter: ['in', ['get', 'class'], ['literal', ['primary', 'secondary', 'trunk']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.major, 'line-width': width(1.3) },
    },
    {
      id: 'roads-motorway', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 5,
      filter: ['==', ['get', 'class'], 'motorway'],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.motorway, 'line-width': width(1.8) },
    },
    {
      id: 'runway', type: 'line', source: 'omt', 'source-layer': 'aeroway', minzoom: 10,
      filter: ['==', ['get', 'class'], 'runway'],
      paint: { 'line-color': c.motorway, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 14] },
    },
    {
      id: 'buildings', type: 'fill-extrusion', source: 'omt', 'source-layer': 'building', minzoom: 13,
      paint: {
        'fill-extrusion-color': c.building,
        'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0, 14, 0.9],
      },
    },
    // Labels stay quiet: only the two countries of the story, cities when regional, areas up close
    label('countries', ['all', ['==', ['get', 'class'], 'country'], ['in', ['coalesce', ['get', 'name:en'], ['get', 'name']], ['literal', ['Nigeria', 'Ireland', 'Éire / Ireland']]]], 0, 14, c.labelStrong),
    label('cities', ['==', ['get', 'class'], 'city'], 5.5, 12, c.label),
    label('areas', ['in', ['get', 'class'], ['literal', ['town', 'suburb', 'quarter', 'neighbourhood']]], 10.5, 11, c.label),
  ],
};
