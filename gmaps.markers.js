'use strict';

var _forEach = require('lodash-compat/collection/forEach'),
    _map = require('lodash-compat/collection/map'),
    _extend = require('lodash-compat/object/extend'),
    _omit = require('lodash-compat/object/omit'),
    markersModule = {};

markersModule.createMarker = function(options) {
  if (options.lat === undefined && options.lng === undefined && options.position === undefined) {
    throw 'No latitude or longitude defined.';
  }

  var self = this,
      details = options.details,
      fences = options.fences,
      inside = options.inside,
      outside = options.outside,
      baseOptions = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      },
      markerOptions = _extend(baseOptions, options),
      optionsToDelete = ['lat', 'lng', 'fences', 'infoWindow', 'outside', 'inside'],
      infoWindowOptions = markerOptions.infoWindow,
      infoWindowEvents = [
        'closeclick', 'content_changed',
        'domready', 'position_changed', 'zindex_changed'
      ],
      markerEvents = [
        'animation_changed', 'clickable_changed', 'cursor_changed', 'draggable_changed',
        'flat_changed', 'icon_changed', 'position_changed', 'shadow_changed',
        'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed'
      ],
      markerMouseEvents = [
        'dblclick', 'drag', 'dragend', 'dragstart',
        'mousedown', 'mouseout', 'mouseover', 'mouseup'
      ],
      marker;

  markerOptions = _omit(markerOptions, optionsToDelete);

  marker = new google.maps.Marker(markerOptions);

  marker.fences = fences;

  if (infoWindowOptions) {
    marker.infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    _forEach(infoWindowEvents, function(infoWindowEventName) {
      var listener = infoWindowOptions[infoWindowEventName];

      if (typeof listener === 'function') {
        google.maps.event.addListener(marker, infoWindowEventName, listener);
      }
    });
  }

  _forEach(markerEvents, function(markerEventName) {
    var listener = markerOptions[markerEventName];

    if (typeof listener === 'function') {
      google.maps.event.addListener(marker, markerEventName, listener);
    }
  });

  _forEach(markerMouseEvents, function(markerMouseEventName) {
    var listener = markerOptions[markerMouseEventName];

    if (typeof listener === 'function') {
      google.maps.event.addListener(marker, markerMouseEventName, function(eventObject) {
        if (eventObject && !eventObject.pixel) {
          eventObject.pixel = self.map.getProjection().fromLatLngToPoint(eventObject.latLng);
        }

        listener.call(marker, eventObject);
      });
    }
  });

  google.maps.event.addListener(marker, 'click', function(eventObject) {
    this.details = details;

    if (eventObject && !eventObject.pixel) {
      eventObject.pixel = self.map.getProjection().fromLatLngToPoint(eventObject.latLng);
    }

    if (typeof markerOptions.click === 'function') {
      markerOptions.click.call(this, eventObject);
    }

    if (marker.infoWindow) {
      self.hideInfoWindows();

      marker.infoWindow.open(self.map, marker);
    }
  });

  google.maps.event.addListener(marker, 'rightclick', function(eventObject) {
    eventObject.marker = this;

    if (eventObject && !eventObject.pixel) {
      eventObject.pixel = self.map.getProjection().fromLatLngToPoint(eventObject.latLng);
    }

    if (options.rightclick) {
      options.rightclick.call(this, eventObject);
    }

    if (self.contextMenu.marker !== undefined) {
      self.buildContextMenu('marker', eventObject);
    }
  });

  if (marker.fences && self.checkMarkerGeofence) {
    google.maps.event.addListener(marker, 'dragend', function() {
      self.checkMarkerGeofence(marker, outside, inside);
    });
  }

  return marker;
};

markersModule.addMarker = function(options) {
  var marker;

  if (options.hasOwnProperty('gm_accessors_')) {
    // Native google.maps.Marker object
    marker = options;
  }
  else {
    if ((options.hasOwnProperty('lat') && options.hasOwnProperty('lng')) || options.position) {
      marker = this.createMarker(options);
    }
    else {
      throw 'No latitude or longitude defined.';
    }
  }

  marker.setMap(this.map);

  if (this.markerClusterer) {
    this.markerClusterer.addMarker(marker);
  }

  this.markers.push(marker);

  if (GMaps.trigger) {
    GMaps.trigger('marker_added', this, marker);
  }

  return marker;
};

markersModule.addMarkers = function(arrayOfMarkerOptions) {
  var self = this,
      addedMarkers = _map(arrayOfMarkerOptions, function(markerOption) {
        return self.addMarker(markerOption);
      });

  return addedMarkers;
};

markersModule.hideInfoWindows = function() {
  _forEach(this.markers, function(marker) {
    if (marker.infoWindow) {
      marker.infoWindow.close();
    }
  });
};

markersModule.removeMarker = function(marker) {
  for (var i = 0; i < this.markers.length; i++) {
    var markerInMap = this.markers[i];

    if (markerInMap === marker) {
      markerInMap.setMap(null);

      this.markers.splice(i, 1);

      if (this.markerClusterer) {
        this.markerClusterer.removeMarker(marker);
      }

      if (GMaps.trigger) {
        GMaps.trigger('marker_removed', this, marker);
      }

      break;
    }
  }

  return marker;
};

markersModule.removeMarkers = function(collection) {
  var newMarkersCollection = [],
      self = this;

  if (collection === undefined) {
    _forEach(this.markers, function(marker) {
      marker.setMap(null);

      if (self.markerClusterer) {
        self.markerClusterer.removeMarker(marker);
      }

      if (GMaps.trigger) {
        GMaps.trigger('marker_removed', self, marker);
      }
    });
  }
  else {
    _forEach(collection, function(markerInCollection) {
      var index = self.markers.indexOf(markerInCollection),
          marker = self.markers[index];

      if (index > -1 && marker) {
        marker.setMap(null);

        if (self.markerClusterer) {
          self.markerClusterer.removeMarker(marker);
        }

        if (GMaps.trigger) {
          GMaps.trigger('marker_removed', self, marker);
        }
      }
    });

    _forEach(this.markers, function(marker) {
      if (marker.getMap() !== null) {
        newMarkersCollection.push(marker);
      }
    });
  }

  this.markers = newMarkersCollection;

  return newMarkersCollection.slice(0);
};

if (window.GMaps) {
  GMaps.customEvents = GMaps.customEvents || [];
  GMaps.customEvents = GMaps.customEvents.concat(['marker_added', 'marker_removed']);

  _extend(GMaps.prototype, markersModule);
}

module.exports = markersModule;