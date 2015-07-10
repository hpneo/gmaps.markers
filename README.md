# gmaps.markers

gmaps.js module to work with markers.

## Install

For using with bundlers (as Browserify or Webpack):

`npm install gmaps.markers --save`

Before `require()` this module you need to `require('gmaps.core')`.

For using directly in the browser, download the `gmaps.markers.js` (or `gmaps.markers.min.js`) in `dist`.

## Usage

You need to register a `<script>` tag with the Google Maps JavaScript API, then import gmaps.core.

Every Google Maps map needs a container (`<div id="map"></div>` in this demo), which needs to have width and height, and be visible (without `display: none`, for example):

```
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <script src="http://maps.google.com/maps/api/js?sensor=true"></script>
  <script src="gmaps.core.js"></script>
  <script src="gmaps.markers.js"></script>
  <style type="text/css">
    #map {
      width: 400px;
      height: 400px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = new GMaps({
      el : '#map',
      lat: -12.0433,
      lng: -77.0283,
      zoom: 12
    });

    var marker = mapWithMarkers.addMarker({
      lat : -12.0533,
      lng: -77.0293,
      title : 'New marker'
    });
  </script>
</body>
</html>
```

For more examples you can check the tests in this repo.

## Documentation

### `createMarker(options)`

Creates a marker and returns it, but doesn't add it to the map.

The `options` object should contain:

* `position` (google.maps.LatLng): The position of the marker in the map, in latitude and longitude. You can use `lat` and `lng` instead.
* `lat` (number): The latitude of the position of the marker in the map.
* `lng` (number): The longitude of the position of the marker in the map.
* `fences` (array): An array of fences associated to this marker (check gmaps.geofences module).
* `outside` (function): A callback called every time a marker is outside of anyone of its fences, after the `dragend` event is triggered.
* `inside` (function): A callback called every time a marker is inside of anyone of its fences, after the `dragend` event is triggered.
* `infoWindow` (object): An object with all [the options for `google.maps.InfoWindow`](https://developers.google.com/maps/documentation/javascript/reference#InfoWindowOptions). Also, accepts all the InfoWindow's events.

Also, accepts an `events` property inside `options`, which contains callbacks for the following events in the layer:

* `click`
* `dblclick`
* `rightclick`
* `drag`
* `dragend`
* `dragstart`,
* `mousedown`
* `mouseout`
* `mouseover`
* `mouseup`
* `animation_changed`
* `clickable_changed`
* `cursor_changed`
* `draggable_changed`,
* `flat_changed`
* `icon_changed`
* `position_changed`
* `shadow_changed`,
* `shape_changed`
* `title_changed`
* `visible_changed`
* `zindex_changed`

### `addMarker(options)`

Creates a marker, adds it to the map and returns it.

### `addMarkers(arrayOfMarkerOptions)`

Adds a collection of markers to the map, using an array of the same options as in `addMarker`.

### `hideInfoWindows()`

Hides all the `google.maps.InfoWindow` objects that are associated to markers in the map.

### `removeMarker(marker)`

Removes a marker from the map and the `markers` property. The `marker` parameter must be a marker created with `addMarker()` or one of the elements inside the `markers` property.

### `removeMarkers(collection)`

Removes a collection of markers from the map and the `markers` property. If not `collection` is passed, remove all the markers in the map.

---

### Events

The following methods trigger custom events. You need to add the `gmaps.events` module before using this module to work with those events:

| Method | Event |
| ------ | ----- |
| `addMarker` | `marker_added` |
| `removeMarker` | `marker_removed` |
| `removeMarkers` | `marker_removed` |

## Changelog

For pre 0.5.0 versions, check [gmaps.js changelog](https://github.com/hpneo/gmaps#changelog)

### 0.5.0

* Node module format (CommonJS)

## License

MIT License. Copyright 2015 Gustavo Leon. http://github.com/hpneo

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.