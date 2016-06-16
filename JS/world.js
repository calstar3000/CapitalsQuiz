var world = (function() {
    var _xml = null;
    var _countries = [];

    function _setXml(xml) {
        _xml = xml;
    }

    function _populateCountries() {
        var marks = _xml.getElementsByTagName("Placemark"),
            mark = null,
            country = null,
            capitalCoords = null,
            countryCoords = null;

        for (var markIndex = 0, markCount = marks.length; markIndex < markCount; markIndex++) {
            mark = marks[markIndex];
            capitalCoords = _getCoords(mark.getElementsByTagName("coordinates")[0].textContent);
            countryCoords = _getCoords(mark.getElementsByTagName("Data")[2].getElementsByTagName("value")[0].textContent);
            country = {
                id: markIndex,
                lat: capitalCoords.lat,
                lng: capitalCoords.lng,
                name: mark.getElementsByTagName("name")[0].textContent,
                capital: mark.getElementsByTagName("description")[0].textContent,
                iso3: mark.getElementsByTagName("Data")[0].getElementsByTagName("value")[0].textContent,
                iso2: mark.getElementsByTagName("Data")[1].getElementsByTagName("value")[0].textContent,
                coords: countryCoords
            };

            _countries.push(country);
        }
    }

    function _getCoords(coordText) {
        return {
            lat: parseFloat(coordText.split(",")[1]),
            lng: parseFloat(coordText.split(",")[0])
        };
    }

    function _moveToNextCountry() {
        var country = _getNextCountry();

        mapMarker.addMarker(country);
        mapMarker.addLabel(country);
        mapMarker.geocodeAddress(country);

        window.setTimeout(function() {
            game.askQuestion(country);
        }, 1000);
    }

    function _getNextCountry() {
        return _countries[utilities.getRandomInt(0, _countries.length)];
    }

    function _spliceCountry(id) {
        var country = _countries[id];
        _countries.splice(id, 1);
        return country;
    }

    function _getCountryById(id) {
        var country = null;
        for (var i = 0, count = _countries.length; i < count; i++) {
            country = _countries[i];
            if (_countries[i].id == id) {
                return country;
            }
        }
    }

    function _getCountries() {
        return _countries;
    }

    return {
        setXml: function(xml) {
            _setXml(xml);
        },
        populateCountries: function() {
            _populateCountries();
        },
        moveToNextCountry: function() {
            _moveToNextCountry();
        },
        getNextCountry: function() {
            _getNextCountry();
        },
        spliceCountry: function(id) {
            return _spliceCountry(id);
        },
        getCountryById: function(id) {
            return _getCountryById(id);
        },
        getCountries: function() {
            return _getCountries();
        }
    };
})();
