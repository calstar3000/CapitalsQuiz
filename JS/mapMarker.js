var mapMarker = (function() {
    var _geocoder = null;

    function _setGeocoder() {
        _geocoder = new google.maps.Geocoder();
    }

    function _highlightCountry(countryCode) {
        // remove any existing layers
        layer.setMap(null);

        // create the new layer
        layer = new google.maps.FusionTablesLayer({
            query: {
                select: 'geometry',
                from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
                where: "ISO_2DIGIT = '" + countryCode + "'"
            },
        });

        // overlay the layer on the map
        layer.setMap(map);
    }

    function _addMarker(country) {
        new google.maps.Marker({
            position: new google.maps.LatLng(country.lat, country.lng),
            map: map,
        });
    }

    function _addLabel(country) {
        new MapLabel({
            position: new google.maps.LatLng(
                country.coords.lat,
                country.coords.lng),
            text: country.name,
            fontSize: 24,
            map: map
        });
    }

    function _geocodeAddress(country) {
        _geocoder.geocode(
            { 'address': country.name },
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.fitBounds(results[0].geometry.viewport);
                } else {
                    // fallback
                    map.setCenter({ lat: country.lat, lng: country.lng });
                    map.setZoom(6);
                    console.log("Geocoding failed for: " + country.name);
                }
            });
    }

    return {
        setGeocoder: function() {
            _setGeocoder();
        },
        highlightCountry: function(country) {
            _highlightCountry(country);
        },
        addMarker: function(country) {
            _addMarker(country);
        },
        addLabel: function(country) {
            _addLabel(country);
        },
        geocodeAddress: function(country) {
            _geocodeAddress(country);
        }
    };
})();
