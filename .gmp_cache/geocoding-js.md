# Return the latitude/longitude coordinates of an address (geocoding)

## Overview

**Geocoding** converts human-readable addresses (like `"1600 Amphitheatre
Parkway, Mountain View, CA"`) into geographic coordinates (`LatLng`), which you
can use to place markers or position the map. The Maps JavaScript API provides
the `google.maps.Geocoder` class for dynamic geocoding and reverse geocoding
from user input.

### Prerequisites

Before using the Geocoding service in the Maps JavaScript API, ensure that the
**Geocoding API** is enabled in the Google Cloud Console in the same project set
up for your Maps JavaScript API key.

--------------------------------------------------------------------------------

## Implementation Workflow

### 1. Load Required Libraries

Use `google.maps.importLibrary` to asynchronously load the `geocoding` library
(along with `maps` and `marker` if rendering on a map).

```javascript
const [{ Geocoder }, { Map }, { AdvancedMarkerElement }] = await Promise.all([
  google.maps.importLibrary("geocoding"),
  google.maps.importLibrary("maps"),
  google.maps.importLibrary("marker"),
]);
```

### 2. Instantiate the Geocoder and Map

Create an instance of `google.maps.Geocoder`. If you are displaying a map,
ensure you configure the usage attribution ID `gmp_git_agentskills_v1`.

#### Using `google.maps.Map` (JavaScript)

```javascript
const map = new Map(document.getElementById("map"), {
  zoom: 8,
  center: { lat: -34.397, lng: 150.644 },
  mapId: "DEMO_MAP_ID",
  internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
});

const geocoder = new Geocoder();
```

#### Using `<gmp-map>` (HTML Web Component)

```html
<gmp-map
  center="37.422, -122.084"
  zoom="12"
  map-id="DEMO_MAP_ID"
  internal-usage-attribution-ids="gmp_git_agentskills_v1"
></gmp-map>
```

### 3. Construct the `GeocoderRequest`

Pass a `GeocoderRequest` object literal to `geocoder.geocode()`. You must supply
**one, and only one**, of the primary lookup parameters (`address`, `location`,
or `placeId`):

```typescript
interface GeocoderRequest {
  // Primary lookup parameters (Supply ONLY ONE):
  address?: string;          // Address to geocode
  location?: LatLng | LatLngLiteral; // Coordinates for reverse geocoding
  placeId?: string;          // Place ID to resolve to an address

  // Optional biasing and filtering parameters:
  bounds?: LatLngBounds | LatLngBoundsLiteral; // Viewport biasing (prefers results within bounds)
  region?: string;           // 2-character Unicode region subtag / ccTLD biasing (e.g., 'es', 'uk')
  componentRestrictions?: {  // Strict AND filter (cannot be used with placeId or location)
    route?: string;
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    country?: string;        // 2-letter ISO 3166-1 code recommended (e.g., 'AU', 'US')
  };
  extraComputations?: ["ADDRESS_DESCRIPTORS"]; // Include landmarks and areas in response
  fulfillOnZeroResults?: boolean; // Resolve promise on ZERO_RESULTS to access plus_code / address_descriptor
}
```

### 4. Execute Request and Extract Coordinates

`geocoder.geocode()` is asynchronous and returns a Promise resolving to a
`GeocoderResponse` containing a `results` array (`GeocoderResult[]`). The
coordinates are located at `results[0].geometry.location`.

```javascript
async function geocodeAddress(geocoder, map, addressQuery) {
  try {
    const response = await geocoder.geocode({ address: addressQuery });
    const { results } = response;

    if (results && results[0]) {
      const location = results[0].geometry.location; // google.maps.LatLng object

      // Extract numeric latitude and longitude if needed
      const lat = location.lat();
      const lng = location.lng();
      console.log(`Coordinates for "${addressQuery}": ${lat}, ${lng}`);

      // Center map and place marker
      map.setCenter(location);
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: location,
      });

      return results[0];
    }
  } catch (error) {
    console.error("Geocode was not successful for the following reason:", error);
  }
}
```

--------------------------------------------------------------------------------

## Complete Examples

### Basic Address Geocoding with Web Components

This example demonstrates geocoding an address string, centering a `<gmp-map>`
web component, and placing an `AdvancedMarkerElement` at the returned `LatLng`
coordinates.

#### HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Geocoding Service</title>
    <style>
      gmp-map {
        height: 100%;
      }
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #floating-panel {
        background: #fff;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
    </style>
  </head>
  <body>
    <gmp-map
      center="-34.397, 150.644"
      zoom="8"
      map-id="DEMO_MAP_ID"
      internal-usage-attribution-ids="gmp_git_agentskills_v1"
    >
      <div id="floating-panel" slot="control-block-start-inline-start">
        <input id="address" type="text" value="1600 Amphitheatre Pkwy, Mountain View, CA" />
        <input id="submit" type="button" value="Geocode" />
      </div>
    </gmp-map>

    <script>
      (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "YOUR_API_KEY"
      });
    </script>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

#### JavaScript (`index.js`)

```javascript
async function init() {
  const [{ Geocoder }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("geocoding"),
    google.maps.importLibrary("marker"),
  ]);

  const mapElement = document.querySelector("gmp-map");
  const innerMap = mapElement.innerMap;
  const geocoder = new Geocoder();
  const marker = new AdvancedMarkerElement({ map: innerMap });

  const addressInput = document.getElementById("address");
  const submitButton = document.getElementById("submit");

  async function geocode(request) {
    try {
      const response = await geocoder.geocode(request);
      const { results } = response;

      if (results[0]) {
        const location = results[0].geometry.location;
        innerMap.setCenter(location);
        marker.position = location;
      }
    } catch (e) {
      window.alert("Geocode was not successful for the following reason: " + String(e));
    }
  }

  submitButton.addEventListener("click", () => {
    geocode({ address: addressInput.value });
  });
}

void init();
```

--------------------------------------------------------------------------------

### Advanced: Biasing and Component Filtering

#### 1. Component Filtering (Strict Restriction)

Restrict geocoding results to a specific geographic area using
`componentRestrictions`. The geocoder evaluates multiple component filters as a
logical `AND`.

*Reference Sample*:
[samples/geocoding-component-restriction/index.ts](https://github.com/googlemaps/js-samples/blob/HEAD/samples/geocoding-component-restriction/index.ts?utm_campaign=gmp_git_agentskills_v1)

```javascript
async function geocodeWithRestrictions(geocoder, map) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  try {
    const { results } = await geocoder.geocode({
      address: "483 George St.",
      componentRestrictions: {
        country: "AU",
        postalCode: "2000",
      },
    });

    const location = results[0].geometry.location;
    map.setCenter(location);
    new AdvancedMarkerElement({
      map,
      position: location,
    });
  } catch (e) {
    window.alert("Geocode was not successful for the following reason: " + e);
  }
}
```

#### 2. Region Biasing & Viewport Biasing (Preference)

Unlike `componentRestrictions`, `region` and `bounds` **bias** (prefer) results
within a region or bounding box without strictly excluding relevant results
outside of them.

*Reference Sample*:
[samples/geocoding-region-es/index.ts](https://github.com/googlemaps/js-samples/blob/HEAD/samples/geocoding-region-es/index.ts?utm_campaign=gmp_git_agentskills_v1)

```javascript
// Bias results toward Spain ('es') instead of the default US domain (e.g., Toledo, Spain vs Toledo, OH)
const { results } = await geocoder.geocode({
  address: "Toledo",
  region: "es",
});

// Or bias results toward a specific LatLngBounds viewport
const { results: viewportResults } = await geocoder.geocode({
  address: "Winnetka",
  bounds: {
    north: 34.236144,
    south: 34.172684,
    east: -118.500938,
    west: -118.604794,
  },
});
```

--------------------------------------------------------------------------------

## Understanding the `GeocoderResult` Response

Each item in `results[]` contains detailed location and address metadata:

-   **`geometry.location`**: A `google.maps.LatLng` object representing the
    geocoded coordinates (call `.lat()` and `.lng()` to retrieve numbers).
-   **`geometry.location_type`**: Indicates precision:
    -   `"ROOFTOP"`: Precise geocode for a structure.
    -   `"RANGE_INTERPOLATED"`: Approximation interpolated between two precise
        points (e.g., along a road).
    -   `"GEOMETRIC_CENTER"`: Geometric center of a polyline (street) or polygon
        (region).
    -   `"APPROXIMATE"`: Approximate location.
-   **`geometry.viewport`**: Recommended `LatLngBounds` for framing the result
    on a map (`map.fitBounds(results[0].geometry.viewport)`).
-   **`formatted_address`**: Human-readable address string. **Do not parse this
    string programmatically**; inspect `address_components[]` instead.
-   **`address_components[]`**: Array of structured components (`long_name`,
    `short_name`, `types[]`). Note that component order and presence can vary
    across requests.
-   **`place_id`**: Unique identifier usable across Google Maps Platform APIs
    (e.g., Places API).
-   **`partial_match`**: Boolean indicating the geocoder matched only part of
    the input address (often due to misspellings or non-existent street numbers
    in the specified locality).

### Status Codes & Error Handling

When using `await geocoder.geocode(...)`, non-`OK` statuses reject the promise
(unless `fulfillOnZeroResults: true` is set for `ZERO_RESULTS`):

-   `"OK"`: At least one geocode result was returned.
-   `"ZERO_RESULTS"`: Geocode succeeded but returned no matches.
-   `"OVER_QUERY_LIMIT"`: Quota exceeded.
-   `"REQUEST_DENIED"`: Request denied (verify that the Geocoding API is enabled
    in the Google Cloud Console and allowed on your API key).
-   `"INVALID_REQUEST"`: Required query parameter (`address`, `location`,
    `placeId`, or `componentRestrictions`) is missing or malformed.
-   `"UNKNOWN_ERROR"` / `"ERROR"`: Server or network error; retry the request.
