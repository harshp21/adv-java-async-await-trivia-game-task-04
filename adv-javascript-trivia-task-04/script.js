async function fetchTriviaQuestionsAndAnswer() {
    try {
        const triviaApiResponse = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple');
        const triviaResponseJson = await triviaApiResponse.json();
        const trviaQuestionsAndAnswer = triviaResponseJson.results;
        return trviaQuestionsAndAnswer;
    } catch (err) {
        console.error(err);
    }
}

//Creating a dom element with properties elem, class,name and id. 
function createDomElement(elem, elemClass = '', elemName = '', elemId = '') {
    let element = document.createElement(elem);
    (elemClass !== '') && element.setAttribute('class', elemClass);
    (elemName !== '') && element.setAttribute('name', elemName);
    (elemId !== '') && element.setAttribute('id', elemId);
    return element;
}

//Create Home Page template
function createHomePageTemplate() {
    let homePageContainer = createDomElement('div', 'home-page-container');
    let homePageContent = createDomElement('div', 'home-page-content');

    let homePageTitleContainer = createDomElement('div', 'home-page-title-container');
    homePageTitleContainer.innerHTML = 'Trivia game';

    let homePagePlayBtn = getPlayButton();
    homePagePlayBtn.setAttribute('onclick', 'clearPageAndStartGame("home-page-container")');

    let homePageHighScoreBtn = createDomElement('div', 'home-page-highscore-btn', 'HighScore', 'highscore-btn');
    homePageHighScoreBtn.innerHTML = 'HighScore';
    homePageHighScoreBtn.setAttribute('onclick', 'clearPageAndShowHighScore("home-page-container")');

    homePageContent.append(homePageTitleContainer, homePagePlayBtn, homePageHighScoreBtn);
    homePageContainer.append(homePageContent);
    document.body.append(homePageContainer);
}

//Start Game on press of play btn
async function startGame() {
    let results = await fetchTriviaQuestionsAndAnswer();
    localStorage.setItem('results', JSON.stringify(results));
    createGamePageTemplate(results);
}

//Create Play btn
function getPlayButton() {
    let playBtn = createDomElement('div', 'play-btn', 'Play', 'play-btn');
    playBtn.innerHTML = 'Play';
    return playBtn;
}

//Clear the contents of the page
function clearPage(className) {
    document.querySelector(`.${className}`).remove();
}

//Create Game Page template
function createGamePageTemplate(results) {
    let gamePageContainer = createDomElement('div', 'game-page-container');
    gamePageContainer.append(getQnaContent(results));
    document.body.append(gamePageContainer);
}

//Initial Values
let score = 0;
let questionNo = 0;
let progress = 0;
localStorage.setItem('userData', JSON.stringify([]));

//Create Q&A Contents
function getQnaContent(results) {
    let res = results[questionNo];
    let qnaContainer = createDomElement('div', 'qna-container');

    let questionsCountContainer = createDomElement('div', 'questions-count-container');
    questionsCountContainer.innerHTML = `Questions ${questionNo + 1}/${results.length}`;

    let scoreContainer = createDomElement('div', 'score-container');
    scoreContainer.innerHTML = `Score : ${score}`;

    let questionContainer = createDomElement('div', 'question-container');
    questionContainer.innerHTML = res.question;

    let progessBarContainer = createDomElement('div', 'progress-bar-container');
    let progressBarValue = createDomElement('div', 'progress-bar-value', 'progress-bar-value', 'progress-bar-value');
    progressBarValue.style.width = `${progress}%`;
    progress = progress + 10;

    progessBarContainer.append(progressBarValue);
    qnaContainer.append(questionsCountContainer, scoreContainer, progessBarContainer, questionContainer, getMultipleChoiceOptions(res.incorrect_answers, res.correct_answer));

    return qnaContainer;
}

//Validate Answer and move to next question
function checkAnswerAndGetNextQuestion(ans) {
    let results = JSON.parse(localStorage.getItem('results'));
    let res = results[questionNo];
    questionNo++;
    if (res.correct_answer === ans) {
        score++;
    }
    clearAndDisplayNextQuestions(results);
}

//Clear curent question and display next question
function clearAndDisplayNextQuestions(results) {
    let gamePage = 'game-page-container';
    clearPage(gamePage);
    if (checkQuestionsAvaibale(results)) {
        createGamePageTemplate(results)
    } else {
        createResultsPageTemplate();
    }
}

//check question available
function checkQuestionsAvaibale(results) {
    return questionNo < results.length;
}

//get the options by adding the answer randomly in options.
function getMultipleChoiceOptions(answers, correctAnswer) {
    let noOfOptions = 4;
    let correctAnsIndex = Math.floor(Math.random() * noOfOptions);
    answers.splice(correctAnsIndex, 0, correctAnswer);

    let answerContainer = createDomElement('ol', 'answer-container');

    answers.forEach((ans) => {
        let answerContent = createDomElement('li', 'answers-content');
        answerContent.innerHTML = ans;
        answerContent.setAttribute('onclick', `checkAnswerAndGetNextQuestion('${ans}')`);
        answerContainer.appendChild(answerContent);
    })

    return answerContainer;
}

//Create result page template
function createResultsPageTemplate() {
    let resultsPageContainer = createDomElement('div', 'results-page-container');

    let scoreContainer = createDomElement('div', 'score-container');
    scoreContainer.innerHTML = `Your score : ${score}`;

    let saveUserNameContainer = createDomElement('div', 'save-username-container', 'save-username-container', 'save-username-container');

    let inputNameContainer = createDomElement('div', 'input-name-container');

    let inputUserName = createDomElement('input', 'input-user-name', 'user-name', 'input-user-name');
    inputUserName.setAttribute('placeholder', 'Username');

    inputNameContainer.append(inputUserName);

    let saveBtnContainer = createDomElement('div', 'save-btn', 'save-btn', 'save-btn');
    saveBtnContainer.innerHTML = 'Save';
    saveBtnContainer.setAttribute('onclick', 'saveUserNameWithScore()')

    saveUserNameContainer.append(inputNameContainer, saveBtnContainer);

    let playBtnContainer = createDomElement('div', 'play-btn-container');

    let resultsPagePlayBtn = getPlayButton();
    resultsPagePlayBtn.setAttribute('onclick', 'clearPageAndStartGame("results-page-container")');

    let homePageBtn = createDomElement('div', 'home-page-btn-container');
    homePageBtn.setAttribute('onclick', 'clearPageAndDisplayHomePage("results-page-container")');
    homePageBtn.innerHTML = 'Go Home';

    playBtnContainer.append(resultsPagePlayBtn, homePageBtn);

    resultsPageContainer.append(scoreContainer, saveUserNameContainer, playBtnContainer);
    document.body.append(resultsPageContainer);
}

//Create high Score Page template
function createHighScorePageTemplate() {
    let highScorePageContainer = createDomElement('div', 'high-score-page-container');

    let highScoreContainer = createDomElement('div', 'highscore-container');

    let highScoreTitle = createDomElement('div', 'highscore-title');
    highScoreTitle.innerHTML = 'Highscore';

    let homePageBtn = createDomElement('div', 'go-home-btn-container');
    homePageBtn.innerHTML = 'Go Home';
    homePageBtn.setAttribute('onclick', 'clearPageAndDisplayHomePage("high-score-page-container")');

    highScoreContainer.append(highScoreTitle, getHighScoreForUsers(), homePageBtn);

    highScorePageContainer.append(highScoreContainer);
    document.body.append(highScorePageContainer);
}

//Save user name with score in local storage.
function saveUserNameWithScore() {
    let username = document.getElementById('input-user-name').value;
    if (username === '') {
        alert('You need to enter the username in order to save the score');
    } else {
        let userscore = score;
        let userData = JSON.parse(localStorage.getItem('userData'));
        userData.push({
            'username': username,
            'score': userscore,
        })
        localStorage.setItem('userData', JSON.stringify(userData));
        document.getElementById('save-username-container').style.display = 'none';
    }
}

//Get high score for users 
function getHighScoreForUsers() {
    let userData = JSON.parse(localStorage.getItem('userData'));
    let highscoreContainer = createDomElement('div', 'high-score-container');
    if (userData.length === 0) {
        let highScoreContent = createDomElement('div', 'highScore-content');
        highScoreContent.innerHTML = 'play & save score to feature on highscore';
        highscoreContainer.append(highScoreContent);
        return highscoreContainer;
    } else {
        userData.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        userData.forEach((user) => {
            let highScoreContent = createDomElement('div', 'highScore-content');
            highScoreContent.innerHTML = `${user.username} - ${user.score}`;
            highscoreContainer.append(highScoreContent);
        })
        return highscoreContainer;
    }
}

//Clear pag and display home Page.
function clearPageAndDisplayHomePage(page) {
    clearPage(page);
    createHomePageTemplate();
}

//Clear page and start game.
function clearPageAndStartGame(page) {
    resetValues();
    clearPage(page);
    startGame();
}

//Clear page and show highscore
function clearPageAndShowHighScore(page) {
    clearPage(page);
    createHighScorePageTemplate();
}

//reset values for new game
function resetValues() {
    questionNo = 0;
    score = 0;
    progress = 0;
}

//display home page
createHomePageTemplate();