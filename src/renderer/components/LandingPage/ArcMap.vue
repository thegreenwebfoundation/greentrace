<template>
  <div id="container">
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import GreenTraceService from "../../../lib/greentrace-service";
import debugLib from "debug";
const debug = debugLib("tgwf:greenTrace:arcmap");
import googleTraceGeoJSON from "../../../../test/data/traceGeoJSON.json";

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 1,
  bearing: 0,
  pitch: 30
};

const MAPSETTINGS = {
  container: "map",
  style: "mapbox://styles/mapbox/dark-v9",
  interactive: true,
  center: [-74.5, 40],
  zoom: INITIAL_VIEW_STATE.zoom,
  bearing: INITIAL_VIEW_STATE.bearing,
  pitch: INITIAL_VIEW_STATE.pitch
};

// Set your mapbox token here
mapboxgl.accessToken = process.env.MapboxAccessToken; // eslint-disable-line

export default {
  data() {
    return {
      traces: []
    };
  },
  methods: {
    makeGeoJSONFeature(ipsWithCoords) {
      let ipObj = {};
      ipsWithCoords.forEach(ip => {
        const key = Object.keys(ip)[0];
        const val = Object.values(ip)[0];
        ipObj[key] = val;
      });
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: ipsWithCoords.map(ip => {
            const ipVal = Object.values(ip)[0];
            return [ipVal.ll[0], ipVal.ll[1]];
          })
        },
        properties: ipObj
      };
    },
    makeGeoJSONFeatureCollection(geoJSONFeature) {
      return {
        type: "FeatureCollection",
        features: [geoJSONFeature]
      };
    },
    makeMapLayer(data, domain, colour) {
      const id = Math.floor(Math.random() * 10000000);
      const defaultColour = "#ed6498";
      let lineColour = defaultColour;
      if (colour) {
        lineColour = colour;
      }

      return {
        id: `${domain}-${id}`,
        type: "line",
        source: {
          type: "geojson",
          data: data
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": lineColour,
          "line-width": 5,
          "line-opacity": 0.8
        }
      };
    },
    async makeTraceGeoJSON(domain) {
      debug(`makeTraceLayer: fetching hops for ${domain}`);
      const hopCoords = await GreenTraceService.fetchHopsFordomain(domain);

      debug({ hopCoords });
      // Create a GeoJSON source with an empty lineString.
      const geoJSONFeature = this.makeGeoJSONFeature(hopCoords);
      const geoJSONFeatureCollection = this.makeGeoJSONFeatureCollection(
        geoJSONFeature
      );

      return geoJSONFeatureCollection;
    },
    async makeTraceLayer(domain, colour) {
      const traceGeoJSON = await this.makeTraceGeoJSON(domain);
      const mapLayer = this.makeMapLayer(traceGeoJSON, domain, colour);
      return mapLayer;
    }
  },

  async mounted() {
    // debug(`fetching hops for ${domain}`);
    // const hopCoords = await GreenTraceService.fetchHopsFordomain(domain);

    // debug({ MAPSETTINGS });
    // debug({ hopCoords });

    // Create a GeoJSON source with an empty lineString.
    // const geoJSONFeature = this.makeGeoJSONFeature(hopCoords);
    // const geoJSONFeatureCollection = this.makeGeoJSONFeatureCollection(
    //   geoJSONFeature
    // );
    // debug(geoJSONFeatureCollection);

    const map = new mapboxgl.Map(MAPSETTINGS);
    // debug({ mapLayer });
    // debug({ secondMapLayer });
    // debug(JSON.stringify(mapLayer));
    // debug(JSON.stringify(secondMapLayer));

    map.on("load", async () => {
      // const firstGeoJSONString = JSON.stringify(googleTraceGeoJSON);
      // const tracegeoJSON = await this.makeTraceGeoJSON("google.com");
      // const secondGeoJSONString = JSON.stringify(tracegeoJSON);

      // debug(JSON.stringify(tracegeoJSON));
      // debug({ firstGeoJSONString });
      // debug({ secondGeoJSONString });
      const mapLayer = await this.makeTraceLayer("gov.scot", "#00EEEE");
      const secondMapLayer = await this.makeTraceLayer("www.gov.pl", "#0000EE");
      const thirdMapLayer = await this.makeTraceLayer("www.gov.se", "#FFFFEE");
      map.addLayer(mapLayer);
      map.addLayer(secondMapLayer);
      map.addLayer(thirdMapLayer);
    });
  }
};
</script>

<style>
canvas#deck-canvas {
  /* width: 300px; */
  /* height: 300px; */
  outline: solid red 1px;
}
#map {
  height: 90vh;
}
#container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
#container > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
button {
  position: absolute;
  margin: 20px;
}

#pause::after {
  content: "Pause";
}

#pause.pause::after {
  content: "Play";
}
</style>