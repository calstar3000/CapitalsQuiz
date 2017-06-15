var map = null;

function initMap() {
    worldMap.initMap();
}

function toggleRevisionSheet() {
    game.toggleRevisionSheet();
}

function toggleScorecard() {
    game.toggleScorecard();
}

function closePanels() {
    game.closePanels();
}

function startGame() {
    game.startGame();
}

function submitAnswer(guess, answerIndex) {
    try {
        var answerForm = document.getElementById('formAnswer');
        var answerLabel = answerForm.getElementsByTagName('label')[0];
        var answerId = answerForm.dataset.id;
        var country = world.getCountryById(answerId);
        var isCorrect = false;

        if (guess.trim().toLowerCase() === country.capital.trim().toLowerCase()) {
            isCorrect = true;
        }

        if (answerIndex != 0) {
            var button = document.getElementById('answer' + answerIndex.toString());
            if (isCorrect) {
                button.style.border = '1px solid green';
            } else {
                button.style.border = '1px solid red';
            }
        }

        game.updateAnswerLog(country, guess, isCorrect);
        game.updateScore(isCorrect);
        world.moveToNextCountry();
    } catch(e) {
        alert("Sorry, something went wrong.");
    }

    return false;
}
