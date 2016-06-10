var map = null;

function initMap() {
    worldMap.initMap();
}

function startGame() {
    game.startGame();
}

function submitAnswer() {
    try {
        var answerValidation = document.getElementById('answerValidation');
        var answerForm = document.getElementById('formAnswer');
        var answerLabel = answerForm.getElementsByTagName('label')[0];
        var answerInput = answerForm.getElementsByTagName('input')[0];
        var guess = answerInput.value;
        var answerId = answerForm.dataset.id;
        var country = world.getCountryById(answerId);
        var isCorrect = false;

        if (guess.trim().toLowerCase() === country.capital.trim().toLowerCase()) {
            answerValidation.textContent = 'Correct!';
            isCorrect = true;
        } else {
            answerValidation.textContent = 'Incorrect! The answer was ' + country.capital;
        }

        game.updateAnswerLog(country, guess, isCorrect);
        game.updateScore(isCorrect);
        world.moveToNextCountry();
    } catch(e) {
        alert("Sorry, something went wrong.");
    }

    return false;
}

function skipQuestion() {
    var answerValidation = document.getElementById('answerValidation');
    var answerForm = document.getElementById('formAnswer');
    var answerId = answerForm.dataset.id;
    var country = world.getCountryById(answerId);

    answerValidation.textContent = 'The answer was ' + country.capital;

    game.updateAnswerLog(country, "", null);
    game.updateScore(null);
    world.moveToNextCountry();
}
