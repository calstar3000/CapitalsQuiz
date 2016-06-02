var xml = null;
var kml = null;
var map = null;
var geocoder = null;
var layer = null;
var playerScore = 0;
var countries = [];
var answerLog = [];
var gameTime = 60 * 1;
var hasTimer = false;

function initMap() {
    geocoder = new google.maps.Geocoder();
    //layer = new google.maps.FusionTablesLayer(null);
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

    setMapStyles();

    mapDiv.style.width = window.outerWidth + 'px';
    mapDiv.style.height = window.outerHeight + 'px';

    loadFile('/Data/world-capitals.kml', "application/xml", function(response) {
        xml = response.responseXML;
        mapLoaded();
    });

    /*
    xml = new KmlMapParser({
        map: map,
        kml: '/Data/world-capitals.kml',
        //kml: '/Data/world-capitals-test.kml',
        afterParseFn: mapLoaded
    });
    */
}

function setMapStyles() {
    loadFile('/JS/mapStyles.json', "application/json", function(response) {
        map.setOptions({ styles: JSON.parse(response.responseText).mapStyles });
    });
}

function mapLoaded() {
    countries = getCountries();
    addScriptAsync('/JS/maplabel.js'); //, mapLabelLoaded);
}

function getCountries() {
    var marks = xml.getElementsByTagName("Placemark"),
        mark = null,
        country = null,
        capitalCoords = null,
        countryCoords = null;

    for (var markIndex = 0, markCount = marks.length; markIndex < markCount; markIndex++) {
        mark = marks[markIndex];
        capitalCoords = getCoords(mark.getElementsByTagName("coordinates")[0].textContent);
        countryCoords = getCoords(mark.getElementsByTagName("Data")[2].getElementsByTagName("value")[0].textContent);
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

        countries.push(country);
    }

    return countries;
}

function getCoords(coordText) {
    return {
        lat: parseFloat(coordText.split(",")[1]),
        lng: parseFloat(coordText.split(",")[0])
    };
}

function addScriptAsync(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
     if (callback) {
         script.addEventListener('load', function (e) {
             callback(null, e);
         }, false);
     }
    document.head.appendChild(script);
}

function reset() {
    var startButton = document.getElementById('startButton');
    startButton.style.display = "block";
    startButton.innerText = "Play again";

    document.getElementById('pnlAnswerContainer').style.display = "none";
    playerScore = 0;
}

function startGame() {
     document.getElementById('startButton').style.display = "none";
     var display = document.getElementById('time');

     if (hasTimer)
        startTimer(gameTime, display);

     moveToNextCountry();
}

function moveToNextCountry() {
    var country = getNextCountry();

    addMarker(country);
    addLabel(country);
    geocodeAddress(country);

    window.setTimeout(function() {
        askQuestion(country);
    }, 1000);
}

function highlightCountry(countryCode) {
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

function addMarker(country) {
    new google.maps.Marker({
        position: new google.maps.LatLng(country.lat, country.lng),
        map: map,
    });
}

function addLabel(country) {
    new MapLabel({
        position: new google.maps.LatLng({ lat: country.coords.lat, lng: country.coords.lng }),
        text: country.name,
        fontSize: 24,
        map: map
    });
}

function geocodeAddress(country) {
    geocoder.geocode({ 'address': country.name }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.fitBounds(results[0].geometry.viewport);
        } else {
            // fallback
            map.setCenter({ lat: country.lat, lng: country.lng });
            map.setZoom(6);
            console.log("Geocoding failed for country: " + country.name);
        }
    });
}

function updateScore(isCorrect) {
    if (isCorrect != null)
        playerScore += isCorrect ? 1 : -1;

    document.getElementById('txtScore').innerHTML = playerScore;
    console.log("Answered", answerLog);
    console.log("Unanswered", countries);
}

function updateAnswerLog(country, guess, isCorrect) {
    var answerCountry = countries.splice(country.id, 1);

    var answerEntry = {
        country: answerCountry,
        guess: guess,
        isCorrect: isCorrect
    };

    answerLog.push(answerEntry);
}

function askQuestion(country) {
    var answerValidation = document.getElementById('answerValidation');
    var answerContainer = document.getElementById('pnlAnswerContainer');
    var answerForm = answerContainer.getElementsByTagName('form')[0];
    var answerLabel = answerForm.getElementsByTagName('label')[0];
    var answerInput = answerForm.getElementsByTagName('input')[0];

    answerValidation.textContent = "";
    answerForm.dataset.id = country.id;
    answerInput.value = "";
    answerLabel.textContent = "What's the capital of " + country.name + "?";
    answerContainer.style.display = 'block';
    answerInput.focus();
}

function submitAnswer() {
    try {
        var answerValidation = document.getElementById('answerValidation');
        var answerForm = document.getElementById('formAnswer');
        var answerLabel = answerForm.getElementsByTagName('label')[0];
        var answerInput = answerForm.getElementsByTagName('input')[0];
        var guess = answerInput.value;
        var answerId = answerForm.dataset.id;
        var country = getCountryById(answerId);
        var isCorrect = false;

        if (guess.trim().toLowerCase() === country.capital.trim().toLowerCase()) {
            answerValidation.textContent = 'Correct!';
            isCorrect = true;
        } else {
            answerValidation.textContent = 'Incorrect! The answer was ' + country.capital;
        }

        updateAnswerLog(country, guess, isCorrect);
        updateScore(isCorrect);
        moveToNextCountry();
    } catch(e) {
        alert("Sorry, something went wrong.");
    }

    return false;
}

function skipQuestion() {
    var answerValidation = document.getElementById('answerValidation');
    var answerForm = document.getElementById('formAnswer');
    var answerId = answerForm.dataset.id;
    var country = getCountryById(answerId);

    answerValidation.textContent = 'The answer was ' + country.capital;

    updateAnswerLog(country, "", null);
    updateScore(null);
    moveToNextCountry();
}

function getNextCountry() {
    return countries[getRandomInt(0, countries.length)];
}

function getCountryById(id) {
    var country = null;
    for (var i = 0, count = countries.length; i < count; i++) {
        country = countries[i];
        if (countries[i].id == id) {
            return country;
        }
    }
}

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    var myTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(myTimer);
            reset();
        }
    }, 1000);
}

function loadFile(filePath, mimeType, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType(mimeType);
    xobj.open('GET', filePath, true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200")
            callback(xobj);
    };

    xobj.send(null);
}
