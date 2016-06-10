var worldMap = (function() {
    function _initMap() {
        mapMarker.setGeocoder();

        var mapDiv = document.getElementById('map');

        map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8,
          disableDefaultUI: true,
          draggable: false,
          draggableCursor: false,
          disableDoubleClickZoom: true,
          scrollwheel: false
        });

        _setMapStyles();

        mapDiv.style.width = window.outerWidth + 'px';
        mapDiv.style.height = window.outerHeight + 'px';

        utilities.loadFile(
            '/Data/world-capitals.kml',
            'application/xml',
            function(response) {
                world.setXml(response.responseXML);
                _mapLoaded();
            });
    }

    function _setMapStyles() {
        utilities.loadFile(
            '/JS/mapStyles.json',
             'application/json',
             function(response) {
                 map.setOptions({
                     styles: JSON.parse(response.responseText).mapStyles
                 });
             });
    }

    function _mapLoaded() {
        world.populateCountries();
        utilities.addScriptAsync('/JS/maplabel.js');
    }

    return {
        initMap: function() {
            _initMap();
        },
    };
})();
