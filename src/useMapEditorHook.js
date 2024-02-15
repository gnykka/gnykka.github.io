import "leaflet-editable";
import * as L from "leaflet";
import { useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  GeofencesEditModes,
  GeofencesLayerTypes,
  GeofencesResolutionRange,
  HexBrushModes,
} from "../constants";
import {
  polygonFromLeafletElement,
  getPolygonFromH3Indexes,
  toggleHexAt,
  hasHexAt,
  getPolygonColor,
} from "../services/geofences.service";

const mapNodesToLeafletElements = (nodes) => {
  if (!nodes) return null;

  return Object.keys(nodes)
    .reduce((resNodes, key) => {
      const node = nodes[key] && nodes[key].leafletElement;

      if (node) resNodes[key] = node;

      return resNodes;
    }, {});
};

const isOnePointPolygon = (polygon) => {
  if (!polygon[0] || polygon[0].length !== 2) return false;

  const [point1, point2] = polygon[0];

  return point1[0] === point2[0] && point1[1] === point2[1];
};

const polygonModeMapEffect = ({
  leafletPolygons,
  selectedZone,
  updateZone,
}) => () => {
  const leafletPolygon = leafletPolygons ? leafletPolygons[selectedZone.key] : null;

  if (!leafletPolygon) return () => {};

  leafletPolygon.enableEdit();

  return () => {
    const polygon = polygonFromLeafletElement(leafletPolygon);

    leafletPolygon.disableEdit();

    // if this is a polygon of a simple duplicated point remove duplication
    if (isOnePointPolygon(polygon)) {
      polygon[0].pop();
    }

    updateZone(selectedZone.key, selectedZone.parent, { polygon });
  };
};

const polygonsEditModeMapEffect = ({
  zoneKeys,
  leafletPolygons,
  selectedLayer,
  updateZone,
}) => () => {
  zoneKeys.forEach((zoneKey) => {
    leafletPolygons[zoneKey].enableEdit();
  });

  return () => {
    zoneKeys.forEach((zoneKey) => {
      const leafletPolygon = leafletPolygons[zoneKey];
      const polygon = polygonFromLeafletElement(leafletPolygon);

      leafletPolygon.disableEdit();

      // if this is a polygon of a simple duplicated point remove duplication
      if (isOnePointPolygon(polygon)) {
        polygon[0].pop();
      }

      updateZone(zoneKey, selectedLayer.key, { polygon });
    });
  };
};

const polygonsCreateModeMapEffect = ({
  map,
  type,
  color,
  selectedLayer,
  addZone,
}) => () => {
  const defaultCursor = map._container.style.cursor;
  const isAllowedPointPolygon = type === GeofencesLayerTypes.parkingAllowedZone ||
    type === GeofencesLayerTypes.parkingIncentivizedZone;

  const onDrawingCommit = (e) => {
    const leafletPolygon = e.layer;
    const points = leafletPolygon.getLatLngs();
    const count = points[0].length || 0;

    // Enable point polygons only for PA and IP zones and disable two point lines.
    if (count === 1 && !isAllowedPointPolygon || count === 2) {
      leafletPolygon.remove();
      return;
    }

    const bounds = leafletPolygon.getBounds
      ? leafletPolygon.getBounds()
      : leafletPolygon.getLatLng().toBounds(0);

    if (!bounds.isValid()) return;

    const polygon = polygonFromLeafletElement(leafletPolygon);

    leafletPolygon.disableEdit();

    // if this is a polygon of a simple duplicated point remove duplication
    if (isOnePointPolygon(polygon)) {
      polygon[0].pop();
    }

    addZone(selectedLayer.key, { polygon });

    // Remove temporary polygon and use the zone's polygon instead.
    leafletPolygon.remove();
  };

  const onDrawingEnd = () => {
    map.editTools.startPolygon(null, { color });
  };

  const onDrawingClick = (e) => {
    // Enable drawing one point polygons: stop the drawing when clicked on the single existing point.
    // Only for parking_allowed and incentive_parking zone types
    if (!isAllowedPointPolygon) return;

    const points = e.layer.getLatLngs();

    if (points[0].length === 1) {
      onDrawingCommit(e);
    }
  };

  map.on("editable:drawing:commit", onDrawingCommit);
  map.on("editable:drawing:end", onDrawingEnd);
  map.on("editable:vertex:clicked", onDrawingClick);
  map.editTools.startPolygon(null, { color });

  return () => {
    map.editTools.commitDrawing();
    map.off("editable:drawing:commit", onDrawingCommit);
    map.off("editable:drawing:end", onDrawingEnd);
    map.off("editable:vertex:clicked", onDrawingClick);
    map.editTools.stopDrawing();
    map._container.style.cursor = defaultCursor;
  };
};

const hexModeMapOptions = ({
  theme,
  resolution,
  hexes,
  active,
  type,
  selectedZone,
  selectedLayer,
  updateZone,
  addZone,
  sidewalksEditMode,
}) => {
  let dragging = false;
  let brushMode = null;
  let moved = false;
  let changedHexes = { ...hexes };
  let polygons = [];

  const onClick = ({ latlng }) => {
    if (moved) return;

    const newHexes = toggleHexAt({ latlng, resolution, hexes });

    if (selectedZone) {
      updateZone(selectedZone.key, selectedZone.parent, { hexes: newHexes });
    } else {
      addZone(selectedLayer.key, {
        polygon: getPolygonFromH3Indexes(Object.keys(newHexes)),
        hexes: newHexes,
        selected: !!selectedLayer.key,
      });
    }
  };

  if (sidewalksEditMode !== GeofencesEditModes.hexBrush) {
    return { onClick };
  }

  const onMouseDown = ({ latlng }) => {
    const { exists } = hasHexAt({ latlng, resolution, hexes });

    dragging = true;
    moved = false;
    brushMode = exists ? HexBrushModes.remove : HexBrushModes.add;
  };

  const onMouseUp = ({ latlng, target }) => {
    dragging = false;

    if (moved) {
      changedHexes = toggleHexAt({
        latlng,
        resolution,
        hexes: changedHexes,
        force: brushMode === HexBrushModes.add,
      });

      // Remove all current hexes — they will be rerendered after update
      if (brushMode === HexBrushModes.add) {
        polygons.forEach(polygon => {
          target.removeLayer(polygon);
        });
      }
      polygons = [];
      updateZone(selectedZone.key, selectedZone.parent, { hexes: changedHexes });
    }
  };

  const onMouseMove = ({ originalEvent, latlng, target }) => {
    if (!dragging) return;

    originalEvent.stopPropagation();

    moved = true;

    const newHexes = toggleHexAt({
      latlng,
      resolution,
      hexes: changedHexes,
      force: brushMode === HexBrushModes.add,
    });

    // Manually add or remove polygons from the map to avoid full redraw after state changing.
    if (brushMode === HexBrushModes.add) {
      Object.keys(newHexes).forEach((h3Index) => {
        const exists = Object.keys(changedHexes).find(oldIndex => oldIndex === h3Index);

        if (!exists) {
          const polygon = L.polygon(newHexes[h3Index].polygon, {
            h3Index,
            color: getPolygonColor(theme, type),
            opacity: active ? 1 : 0.4,
          }).addTo(target);

          polygons.push(polygon);
        }
      });
    } else {
      Object.keys(changedHexes).forEach((h3Index) => {
        const exists = Object.keys(newHexes).find(oldIndex => oldIndex === h3Index);

        if (!exists) {
          const polygon = Object.values(target._layers)
            .find((layer) => layer.options.h3Index === h3Index);

          if (polygon) target.removeLayer(polygon);
        }
      });
    }

    changedHexes = newHexes;
  };

  return {
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
};

const useZoneMapEditor = ({
  theme,
  leafletPolygons,
  layers,
  selectedZone,
  updateZone,
  sidewalksEditMode,
}) => {
  const { key, parent, editMode, resolution } = selectedZone;
  const { type } = layers[parent];
  const { hexes, active } = layers[parent].zones[key];

  const mapOptions = {
    [GeofencesEditModes.polygonCreate]: {},
    [GeofencesEditModes.polygonEdit]: {},
    [GeofencesEditModes.hex]: hexModeMapOptions({
      theme,
      resolution,
      hexes,
      active,
      type,
      selectedZone,
      updateZone,
      sidewalksEditMode,
    }),
    [GeofencesEditModes.hexBrush]: hexModeMapOptions({
      theme,
      resolution,
      hexes,
      active,
      type,
      selectedZone,
      updateZone,
      sidewalksEditMode,
    }),
  }[editMode];

  const mapEffect = {
    [GeofencesEditModes.polygonEdit]: polygonModeMapEffect({
      leafletPolygons,
      selectedZone,
      updateZone,
    }),
  }[editMode];

  return { mapOptions, mapEffect };
};

const useLayerMapEditor = ({
  theme,
  map,
  leafletPolygons,
  layers,
  selectedLayer,
  sidewalksEditMode,
  addZone,
  updateZone,
}) => {
  const { key, editMode } = selectedLayer;
  const { type, zones } = layers[key] || {};
  const color = getPolygonColor(theme, type);
  const zoneKeys = Object.keys(zones || []).filter(zoneKey => !!leafletPolygons[zoneKey]);
  const resolution = sidewalksEditMode
    ? GeofencesResolutionRange.defaultSidewalks
    : GeofencesResolutionRange.default;

  const mapOptions = {
    [GeofencesEditModes.polygonEdit]: {},
    [GeofencesEditModes.polygonCreate]: {},
    [GeofencesEditModes.hexBrush]: {},
    [GeofencesEditModes.hex]: hexModeMapOptions({
      theme,
      resolution,
      hexes: [],
      selectedLayer,
      addZone,
    }),
  }[editMode || sidewalksEditMode];

  const mapEffect = {
    [GeofencesEditModes.polygonEdit]: polygonsEditModeMapEffect({
      zoneKeys,
      leafletPolygons,
      selectedLayer,
      updateZone,
    }),
    [GeofencesEditModes.polygonCreate]: polygonsCreateModeMapEffect({
      map,
      type,
      color,
      selectedLayer,
      addZone,
    }),
  }[editMode || sidewalksEditMode];

  return { mapOptions, mapEffect };
};

export const useMapEditor = ({
  layers = {},
  selectedZone = {},
  selectedLayer = {},
  sidewalksEditMode,
  addZone,
  updateZone,
}) => {
  const theme = useTheme();
  const mapRef = useRef(null);
  const rootRef = useRef(null);
  const layersRef = useRef({});
  const polygonsRef = useRef({});
  const groupPolygonsRef = useRef({});

  // Elements are empty on the first render and ready on the second one.
  const isMapReady = mapRef.current && mapRef.current.leafletElement;
  const isRootReady = rootRef.current && rootRef.current.leafletElement;

  const map = isMapReady ? mapRef.current.leafletElement : null;
  const mapContainer = isMapReady ? mapRef.current.container : null;
  const leafletRoot = isRootReady ? rootRef.current.leafletElement : null;
  const leafletLayers = mapNodesToLeafletElements(layersRef.current);
  const leafletPolygons = mapNodesToLeafletElements(polygonsRef.current);
  const leafletGroups = mapNodesToLeafletElements(groupPolygonsRef.current);

  const key = selectedZone.key || selectedLayer.key;
  const editMode = selectedZone.editMode || selectedLayer.editMode;

  let mapEditorOptions = {};

  if (key && editMode && selectedZone.key) {
    mapEditorOptions = useZoneMapEditor({
      theme,
      leafletPolygons,
      layers,
      selectedZone,
      updateZone,
      sidewalksEditMode,
    });
  }

  if (key && editMode && selectedLayer.key || layers && !key && sidewalksEditMode) {
    mapEditorOptions = useLayerMapEditor({
      theme,
      map,
      leafletPolygons,
      layers,
      selectedLayer,
      sidewalksEditMode,
      addZone,
      updateZone,
    });
  }

  const {
    mapOptions = {},
    mapEffect = () => {},
  } = mapEditorOptions;

  useEffect(mapEffect, [editMode]);

  return {
    mapRef,
    rootRef,
    layersRef,
    polygonsRef,
    groupPolygonsRef,
    isMapReady,
    isRootReady,
    map,
    mapContainer,
    leafletRoot,
    leafletLayers,
    leafletPolygons,
    leafletGroups,
    mapOptions,
  };
};
