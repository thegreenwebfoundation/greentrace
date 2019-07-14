<template>
  <div id="container">
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 1,
  bearing: 0,
  pitch: 30
};
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

// Set your mapbox token here
mapboxgl.accessToken = process.env.MapboxAccessToken; // eslint-disable-line

import GreenTrace from "@tgwf/greentrace-cli";

const hops = [
  {
    range: [3113989632, 3113989887],
    country: "DE",
    region: "BE",
    eu: "1",
    timezone: "Europe/Berlin",
    city: "Berlin",
    ll: [52.5009, 13.4356],
    metro: 0,
    area: 200
  },
  {
    range: [1040472064, 1040473087],
    country: "",
    region: "",
    eu: "0",
    timezone: "Europe/Vaduz",
    city: "",
    ll: [47, 8],
    metro: 0,
    area: 200
  },
  {
    range: [3249715456, 3249715711],
    country: "DE",
    region: "",
    eu: "1",
    timezone: "",
    city: "",
    ll: [51.2993, 9.491],
    metro: 0,
    area: 200
  },
  {
    range: [3093905408, 3093906431],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [1211391168, 1211391199],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [1211391104, 1211391167],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [3093946112, 3093946367],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [3093946112, 3093946367],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [3093946112, 3093946367],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [3093905408, 3093906431],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [1093750784, 1093752831],
    country: "US",
    region: "",
    eu: "0",
    timezone: "",
    city: "",
    ll: [37.751, -97.822],
    metro: 0,
    area: 1000
  },
  {
    range: [1109508096, 1109516287],
    country: "US",
    region: "CA",
    eu: "0",
    timezone: "America/Los_Angeles",
    city: "Brea",
    ll: [33.9291, -117.8845],
    metro: 803,
    area: 1000
  },
  {
    range: [1109508096, 1109516287],
    country: "US",
    region: "CA",
    eu: "0",
    timezone: "America/Los_Angeles",
    city: "Brea",
    ll: [33.9291, -117.8845],
    metro: 803,
    area: 1000
  }
];

const hopCoords = hops.map(hop => {
  return [hop.ll[1], hop.ll[0]];
});

let newLine = hopCoords.concat([-74.5, 40]);

console.log({ hopCoords });

function makeMap() {}
export default {
  data() {
    return {};
  },
  async mounted() {
    const newHops = await GreenTrace.trace("www.japan.go.jp");

    console.log({ newHops });

    let newTGWFHopCoords = newHops.map(hop => {
      console.log({ hop });
      const hopVal = Object.values(hop)[0];
      return [hopVal.ll[1], hopVal.ll[0]];
    });
    console.log({ newTGWFHopCoords });
    console.log({ hopCoords });

    // const map = makeMap();
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v9",

      interactive: true,
      center: [-74.5, 40],
      // center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      bearing: INITIAL_VIEW_STATE.bearing,
      pitch: INITIAL_VIEW_STATE.pitch
    });
    map.on("load", () => {
      console.log("LOADED");
    });
    // const deck = makeDeck(map);

    // Create a GeoJSON source with an empty lineString.
    var geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: hopCoords
          }
        }
      ]
    };
    // Create a GeoJSON source with an empty lineString.

    const geoJSONFeature = GreenTrace.toGeoJSON(newHops);

    const geojson2 = {
      type: "FeatureCollection",
      features: [geoJSONFeature]
    };
    console.log(geojson);
    console.log(geojson2);

    map.on("load", function() {
      // add the line which will be modified in the animation
      map.addLayer({
        id: "line-animation",
        type: "line",
        source: {
          type: "geojson",
          data: geojson
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#ed6498",
          "line-width": 5,
          "line-opacity": 0.8
        }
      });
      map.addLayer({
        id: "line-animation2",
        type: "line",
        source: {
          type: "geojson",
          data: geojson2
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "blue",
          "line-width": 5,
          "line-opacity": 0.8
        }
      });
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