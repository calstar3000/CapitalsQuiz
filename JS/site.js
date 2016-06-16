var map = null;

function initMap() {
    worldMap.initMap();
}

function startGame() {
    game.startGame();
}

function submitAnswer() {
    try {
        var answerForm = document.getElementById('formAnswer');
        var answerLabel = answerForm.getElementsByTagName('label')[0];
        var answerInput = answerForm.getElementsByTagName('input')[0];
        var guess = answerInput.value;
        var answerId = answerForm.dataset.id;
        var country = world.getCountryById(answerId);
        var isCorrect = false;

        if (guess.trim().toLowerCase() === country.capital.trim().toLowerCase()) {
            isCorrect = true;
        }

        game.updateAnswerLog(country, guess, isCorrect);
        game.updateScore(isCorrect);
        world.moveToNextCountry();
    } catch(e) {
        alert("Sorry, something went wrong.");
    }

    return false;
}
