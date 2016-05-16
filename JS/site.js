var xml = null;
var map = null;
var playerScore = 0;
var countries = null;
var gameTime = 60 * 1;

function initMap() {
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

    loadJSON('/JS/mapStyles.json', function(response) {
        map.setOptions({ styles: JSON.parse(response).mapStyles });
    });

    mapDiv.style.width = window.outerWidth + 'px';
    mapDiv.style.height = window.outerHeight + 'px';

    xml = new KmlMapParser({
        map: map,
        kml: '/Data/world-capitals.kml',
        afterParseFn: mapLoaded
    });
}

function mapLoaded() {
    countries = xml.docSet.docs[0].folders[0].placemarks;
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
     startTimer(gameTime, display);
     moveToNextCountry();
}

function moveToNextCountry() {
    var country = getNextCountry();

    map.setCenter({ lat: country.lat, lng: country.lng });
    map.setZoom(6);

    window.setTimeout(function() {
        askQuestion(country);
    }, 1000);
}

function updateScore() {
    document.getElementById('txtScore').innerHTML = playerScore;
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

        if (guess.trim().toLowerCase() === country.capital.trim().toLowerCase()) {
            answerValidation.textContent = 'You got it right!';
            playerScore += 1;
        } else {
            answerValidation.textContent = 'You got it wrong! The answer was ' + country.capital;
            playerScore -= 1;
        }

        updateScore();
        moveToNextCountry();
    } catch(e) {
        alert("Sorry, something went wrong.");
    }

    return false;
}

function skipQuestion() {
    moveToNextCountry();
}

function getNextCountry() {
    var countryCount = countries.length;
    var countryId = getRandomInt(0, countryCount);

    return getCountryById(countryId);
}

function getCountryById(id) {
    var country = countries[id];

    return {
        id: id,
        lat: country.points[0].position.lat(),
        lng: country.points[0].position.lng(),
        name: country.name.trim(),
        capital: country.description.split(',')[1].trim()
    };
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

function loadJSON(filePath, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filePath, true);
    
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200")
            callback(xobj.responseText);
    };

    xobj.send(null);
}
