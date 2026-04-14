(function () {
  var VERB_BANK = window.VERB_BANK || [];
  var TOTAL_ROUNDS = 3;
  var TENSE_LABELS = {
    present: "prítomný",
    past: "minulý",
    future: "budúci"
  };

  var startScreen = document.getElementById("startScreen");
  var gameScreen = document.getElementById("gameScreen");
  var resultScreen = document.getElementById("resultScreen");

  var bankSizeValue = document.getElementById("bankSizeValue");
  var roundValue = document.getElementById("roundValue");
  var answerValue = document.getElementById("answerValue");
  var verbDisplay = document.getElementById("verbDisplay");
  var promptHint = document.getElementById("promptHint");
  var roundSummary = document.getElementById("roundSummary");
  var nextButton = document.getElementById("nextButton");

  var score1Value = document.getElementById("score1Value");
  var score2Value = document.getElementById("score2Value");
  var time1Value = document.getElementById("time1Value");
  var time2Value = document.getElementById("time2Value");
  var feedback1 = document.getElementById("feedback1");
  var feedback2 = document.getElementById("feedback2");

  var finalScore1 = document.getElementById("finalScore1");
  var finalScore2 = document.getElementById("finalScore2");
  var finalTime1 = document.getElementById("finalTime1");
  var finalTime2 = document.getElementById("finalTime2");
  var winnerTitle = document.getElementById("winnerTitle");
  var winnerText = document.getElementById("winnerText");
  var historyList = document.getElementById("historyList");

  var startButton = document.getElementById("startButton");
  var restartButton = document.getElementById("restartButton");
  var playAgainButton = document.getElementById("playAgainButton");

  var answerContainers = {
    1: document.getElementById("answers1"),
    2: document.getElementById("answers2")
  };

  var feedbackMap = {
    1: feedback1,
    2: feedback2
  };

  var scoreMap = {
    1: score1Value,
    2: score2Value
  };

  var timeMap = {
    1: time1Value,
    2: time2Value
  };

  var state = createInitialState();

  bankSizeValue.textContent = String(VERB_BANK.length);

  function createInitialState() {
    return {
      roundIndex: 0,
      deck: [],
      currentCard: null,
      roundStartedAt: 0,
      players: {
        1: { score: 0, totalTime: 0, answer: null, reactionTime: null },
        2: { score: 0, totalTime: 0, answer: null, reactionTime: null }
      },
      history: []
    };
  }

  function cloneArray(array) {
    return array.slice(0);
  }

  function shuffle(array) {
    var copy = cloneArray(array);
    var index;
    var swapIndex;
    var temp;

    for (index = copy.length - 1; index > 0; index -= 1) {
      swapIndex = Math.floor(Math.random() * (index + 1));
      temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }

    return copy;
  }

  function formatSeconds(milliseconds) {
    return (milliseconds / 1000).toFixed(2) + " s";
  }

  function formatPoints(points) {
    if (points === 1) {
      return points + " bod";
    }

    if (points >= 2 && points <= 4) {
      return points + " body";
    }

    return points + " bodov";
  }

  function resetPlayerRoundState() {
    state.players[1].answer = null;
    state.players[1].reactionTime = null;
    state.players[2].answer = null;
    state.players[2].reactionTime = null;
  }

  function getNow() {
    if (window.performance && typeof window.performance.now === "function") {
      return window.performance.now();
    }

    return Date.now();
  }

  function startGame() {
    if (!VERB_BANK.length) {
      bankSizeValue.textContent = "chyba";
      return;
    }

    state = createInitialState();
    state.deck = shuffle(VERB_BANK).slice(0, TOTAL_ROUNDS);

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    updateScoreboard();
    goToRound(0);
  }

  function goToRound(roundIndex) {
    state.roundIndex = roundIndex;
    state.currentCard = state.deck[roundIndex];
    state.roundStartedAt = getNow();
    resetPlayerRoundState();

    roundValue.textContent = (roundIndex + 1) + " / " + TOTAL_ROUNDS;
    answerValue.textContent = "Čakáme na odpovede";
    verbDisplay.textContent = state.currentCard.text;
    promptHint.textContent = "Obaja hráči vyberú odpoveď na svojej polovici.";
    roundSummary.textContent = "Kolo beží. Ťuknite na odpoveď čo najrýchlejšie.";
    nextButton.classList.add("hidden");

    setupPlayerBoard(1);
    setupPlayerBoard(2);
  }

  function setupPlayerBoard(player) {
    var buttons = answerContainers[player].querySelectorAll(".answer-button");
    var i;

    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].disabled = false;
      buttons[i].classList.remove("selected", "disabled", "reveal-correct", "reveal-wrong");
    }

    setFeedback(player, "Vyber odpoveď.", "neutral");
  }

  function setFeedback(player, message, tone) {
    var element = feedbackMap[player];
    element.textContent = message;
    element.className = "player-feedback " + tone;
  }

  function updateScoreboard() {
    scoreMap[1].textContent = String(state.players[1].score);
    scoreMap[2].textContent = String(state.players[2].score);
    timeMap[1].textContent = formatSeconds(state.players[1].totalTime);
    timeMap[2].textContent = formatSeconds(state.players[2].totalTime);
  }

  function disableOtherButtons(player, chosenAnswer) {
    var buttons = answerContainers[player].querySelectorAll(".answer-button");
    var i;
    var matchesChoice;

    for (i = 0; i < buttons.length; i += 1) {
      matchesChoice = buttons[i].getAttribute("data-answer") === chosenAnswer;
      buttons[i].disabled = true;
      buttons[i].classList.add(matchesChoice ? "selected" : "disabled");
    }
  }

  function revealPlayerButtons(player, isCorrect) {
    var buttons = answerContainers[player].querySelectorAll(".answer-button");
    var i;
    var answer;

    for (i = 0; i < buttons.length; i += 1) {
      answer = buttons[i].getAttribute("data-answer");

      if (answer === state.currentCard.tense) {
        buttons[i].classList.add("reveal-correct");
      } else if (answer === state.players[player].answer && !isCorrect) {
        buttons[i].classList.add("reveal-wrong");
      }
    }
  }

  function handleAnswer(player, answer) {
    var waitingFor;

    if (state.players[player].answer) {
      return;
    }

    state.players[player].answer = answer;
    state.players[player].reactionTime = getNow() - state.roundStartedAt;
    disableOtherButtons(player, answer);

    setFeedback(
      player,
      "Zvolené: " + TENSE_LABELS[answer] + " (" + formatSeconds(state.players[player].reactionTime) + ")",
      "locked"
    );

    waitingFor = player === 1 ? 2 : 1;
    promptHint.textContent = state.players[waitingFor].answer
      ? "Obe odpovede sú pripravené."
      : "Hráč " + player + " už odpovedal. Čakáme na hráča " + waitingFor + ".";

    if (state.players[1].answer && state.players[2].answer) {
      finalizeRound();
    }
  }

  function finalizeRound() {
    var correctTense = state.currentCard.tense;
    var playerOneCorrect = state.players[1].answer === correctTense;
    var playerTwoCorrect = state.players[2].answer === correctTense;
    var roundWinner = 0;
    var summaryText = "";

    if (playerOneCorrect) {
      state.players[1].score += 1;
    }
    if (playerTwoCorrect) {
      state.players[2].score += 1;
    }

    state.players[1].totalTime += state.players[1].reactionTime;
    state.players[2].totalTime += state.players[2].reactionTime;

    updateScoreboard();
    revealPlayerButtons(1, playerOneCorrect);
    revealPlayerButtons(2, playerTwoCorrect);

    setFeedback(
      1,
      playerOneCorrect
        ? "Správne! " + state.currentCard.text + " je " + TENSE_LABELS[correctTense] + " čas."
        : "Nie celkom. Správne je " + TENSE_LABELS[correctTense] + " čas.",
      playerOneCorrect ? "correct" : "incorrect"
    );

    setFeedback(
      2,
      playerTwoCorrect
        ? "Správne! " + state.currentCard.text + " je " + TENSE_LABELS[correctTense] + " čas."
        : "Nie celkom. Správne je " + TENSE_LABELS[correctTense] + " čas.",
      playerTwoCorrect ? "correct" : "incorrect"
    );

    answerValue.textContent = TENSE_LABELS[correctTense];
    promptHint.textContent = "Obaja hráči odpovedali. Pozri výsledok kola.";

    roundWinner = getRoundWinner(playerOneCorrect, playerTwoCorrect);
    summaryText = roundWinner === 0
      ? "Kolo skončilo nerozhodne. Rozdiel bude robiť presnosť a celkový čas."
      : "Kolo berie hráč " + roundWinner + ".";

    roundSummary.textContent = summaryText + " Hráč 1: " + TENSE_LABELS[state.players[1].answer] +
      " • Hráč 2: " + TENSE_LABELS[state.players[2].answer] + ".";

    state.history.push({
      round: state.roundIndex + 1,
      word: state.currentCard.text,
      tense: correctTense,
      playerOneCorrect: playerOneCorrect,
      playerTwoCorrect: playerTwoCorrect,
      playerOneTime: state.players[1].reactionTime,
      playerTwoTime: state.players[2].reactionTime
    });

    nextButton.classList.remove("hidden");
    nextButton.textContent = state.roundIndex === TOTAL_ROUNDS - 1 ? "Zobraziť víťaza" : "Ďalšie kolo";
  }

  function getRoundWinner(playerOneCorrect, playerTwoCorrect) {
    if (playerOneCorrect && !playerTwoCorrect) {
      return 1;
    }

    if (playerTwoCorrect && !playerOneCorrect) {
      return 2;
    }

    if (playerOneCorrect && playerTwoCorrect) {
      return state.players[1].reactionTime <= state.players[2].reactionTime ? 1 : 2;
    }

    return 0;
  }

  function goNext() {
    if (state.roundIndex < TOTAL_ROUNDS - 1) {
      goToRound(state.roundIndex + 1);
      return;
    }

    showResults();
  }

  function determineWinner() {
    var lastRound;

    if (state.players[1].score !== state.players[2].score) {
      return state.players[1].score > state.players[2].score ? 1 : 2;
    }

    if (state.players[1].totalTime !== state.players[2].totalTime) {
      return state.players[1].totalTime < state.players[2].totalTime ? 1 : 2;
    }

    lastRound = state.history[state.history.length - 1];
    return lastRound.playerOneTime <= lastRound.playerTwoTime ? 1 : 2;
  }

  function makeHistoryLine(item) {
    return "Správna odpoveď: " + TENSE_LABELS[item.tense] +
      " • Hráč 1 " + (item.playerOneCorrect ? "✓" : "✕") + " (" + formatSeconds(item.playerOneTime) + ")" +
      " • Hráč 2 " + (item.playerTwoCorrect ? "✓" : "✕") + " (" + formatSeconds(item.playerTwoTime) + ")";
  }

  function showResults() {
    var winner = determineWinner();
    var scoreDifference = Math.abs(state.players[1].score - state.players[2].score);
    var decidedByTime = state.players[1].score === state.players[2].score;
    var i;
    var row;
    var round;
    var details;
    var word;
    var meta;
    var result;

    gameScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    winnerTitle.textContent = "Vyhráva hráč " + winner;
    winnerText.textContent = decidedByTime
      ? "Po troch kolách bolo skóre " + state.players[1].score + ":" + state.players[2].score + ", takže rozhodol rýchlejší súčet reakčných časov."
      : "Víťaz si vybojoval náskok o " + formatPoints(scoreDifference) + ".";

    finalScore1.textContent = formatPoints(state.players[1].score);
    finalScore2.textContent = formatPoints(state.players[2].score);
    finalTime1.textContent = "Celkový čas: " + formatSeconds(state.players[1].totalTime);
    finalTime2.textContent = "Celkový čas: " + formatSeconds(state.players[2].totalTime);

    historyList.innerHTML = "";

    for (i = 0; i < state.history.length; i += 1) {
      row = document.createElement("article");
      row.className = "history-item";

      round = document.createElement("div");
      round.className = "history-round";
      round.textContent = "Kolo " + state.history[i].round;

      details = document.createElement("div");
      word = document.createElement("div");
      word.className = "history-word";
      word.textContent = state.history[i].word;

      meta = document.createElement("div");
      meta.className = "history-meta";
      meta.textContent = makeHistoryLine(state.history[i]);

      details.appendChild(word);
      details.appendChild(meta);

      result = document.createElement("div");
      result.className = "history-result";
      result.textContent = "Bodovanie: " + (state.history[i].playerOneCorrect ? 1 : 0) + " : " +
        (state.history[i].playerTwoCorrect ? 1 : 0);

      row.appendChild(round);
      row.appendChild(details);
      row.appendChild(result);
      historyList.appendChild(row);
    }
  }

  function bindAnswerButtons() {
    var buttons = document.querySelectorAll(".answer-button");
    var i;

    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function () {
        handleAnswer(Number(this.getAttribute("data-player")), this.getAttribute("data-answer"));
      });
    }
  }

  bindAnswerButtons();
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", startGame);
  nextButton.addEventListener("click", goNext);
}());
