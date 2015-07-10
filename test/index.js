describe("Creating a marker", function() {
  var mapWithMarkers, marker;

  beforeEach(function() {
    mapWithMarkers = mapWithMarkers || new GMaps({
      el : '#markers',
      lat : -12.0533,
      lng: -77.0293,
      zoom: 14
    });
  });

  describe("With basic options", function() {
    beforeEach(function() {
      marker = mapWithMarkers.addMarker({
        lat : -12.0533,
        lng: -77.0293,
        title : 'New marker'
      });
    });

    it("should add the marker to the markers collection", function() {
      expect(mapWithMarkers.markers.length).toEqual(1);
      expect(mapWithMarkers.markers[0]).toEqual(marker);
    });

    it("should create a marker with defined position", function() {
      // Fix for floating-point bug
      expect(parseFloat(marker.getPosition().lat().toFixed(4))).toEqual(-12.0533);
      expect(parseFloat(marker.getPosition().lng().toFixed(4))).toEqual(-77.0293);
    });
  });

  describe("With events", function() {
    var callbacks;

    beforeEach(function() {
      callbacks = {
        onclick : function() {
          console.log(this.title);
        }
      };

      expect.spyOn(callbacks, 'onclick').andCallThrough();

      marker = mapWithMarkers.addMarker({
        lat : -12.0533,
        lng: -77.0193,
        title : 'New marker',
        click : callbacks.onclick
      });
    });

    it("should respond to click event", function() {
      google.maps.event.trigger(marker, 'click');

      expect(callbacks.onclick).toHaveBeenCalled();
    });
  });
});

describe("Removing markers", function() {
  var mapWithMarkers;

  beforeEach(function() {
    mapWithMarkers = mapWithMarkers || new GMaps({
      el : '#markers',
      lat : -12.0533,
      lng: -77.0293,
      zoom: 14
    });

    mapWithMarkers.removeMarkers();

    mapWithMarkers.addMarkers([{
      lat : -12.0523,
      lng: -77.0297,
      title : 'Marker #1'
    }, {
      lat : -12.0531,
      lng: -77.0289,
      title : 'Marker #2'
    }, {
      lat : -12.0537,
      lng: -77.0299,
      title : 'Marker #3'
    }, {
      lat : -12.0532,
      lng: -77.0278,
      title : 'Marker #4'
    }]);
  });

  it("should remove a marker from the markers collection", function() {
    mapWithMarkers.removeMarker(mapWithMarkers.markers[0]);

    expect(mapWithMarkers.markers.length).toEqual(3);
  });

  it("should remove an array of markers from the markers collection", function() {
    var markers = [mapWithMarkers.markers[0], mapWithMarkers.markers[2]];
    mapWithMarkers.removeMarkers(markers);

    expect(mapWithMarkers.markers.length).toEqual(2);
  });
});