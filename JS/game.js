var game = (function() {
    var _playerScore = 0;
    var _gameTime = 60 * 1;
    var _answerLog = [];
    var _hasTimer = false;

    function _startGame() {
         document.getElementById('startButton').style.display = "none";
         var display = document.getElementById('time');

         if (_hasTimer)
            _startTimer(_gameTime, display);

         world.moveToNextCountry();
    }

    function _askQuestion(country) {
        var answerContainer = document.getElementById('pnlAnswerContainer');
        var answerForm = answerContainer.getElementsByTagName('form')[0];
        var answerLabel = answerForm.getElementsByTagName('label')[0];
        var answerInput = answerForm.getElementsByTagName('input')[0];

        answerForm.dataset.id = country.id;
        answerInput.value = '';
        answerLabel.textContent = "What's the capital of " + country.name + "?";
        answerContainer.style.display = 'block';
        answerInput.focus();
    }

    function _updateScore(isCorrect) {
        if (isCorrect != null)
            _playerScore += isCorrect ? 1 : -1;

        document.getElementById('txtScore').innerHTML = _playerScore;
        console.log('Answered', _answerLog);
        console.log('Unanswered', world.getCountries());
    }

    function _updateAnswerLog(country, guess, isCorrect) {
        _answerLog.push({
            country: world.spliceCountry(country.id),
            guess: guess,
            isCorrect: isCorrect
        });

        var table = document.getElementById('answerLog');

        table.appendChild(_createAnswerLogRow(country, guess));
    }

    function _createAnswerLogRow(country, guess) {
        var row = document.createElement('tr');
        row.appendChild(_createAnswerLogCell(_answerLog.length.toString()));
        row.appendChild(_createAnswerLogCell(country.name));
        row.appendChild(_createAnswerLogCell(country.capital));
        row.appendChild(_createAnswerLogCell(guess));
        return row;
    }

    function _createAnswerLogCell(text) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(text == "" ? "Skipped" : text));
        return td;
    }

    function _startTimer(duration, display) {
        var timer = duration, minutes, seconds;

        var myTimer = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(myTimer);
                _resetGame();
            }
        }, 1000);
    }

    function _resetGame() {
        var startButton = document.getElementById('startButton');
        startButton.style.display = "block";
        startButton.innerText = "Play again";

        document.getElementById('pnlAnswerContainer').style.display = "none";
        _playerScore = 0;
    }

    return {
        startGame: function() {
            _startGame();
        },
        askQuestion: function(country) {
            _askQuestion(country);
        },
        updateScore: function(isCorrect) {
            _updateScore(isCorrect);
        },
        updateAnswerLog: function(country, guess, isCorrect) {
            _updateAnswerLog(country, guess, isCorrect);
        }
    };
})();
