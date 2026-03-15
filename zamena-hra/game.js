(function () {
  const QUESTION_BANK = [
    { id: 1, type: "fill", category: "personal", answer: "Ja", template: "___ dnes nesiem pastelky do školy." },
    { id: 2, type: "fill", category: "personal", answer: "ty", template: "Po zvonení pôjdeš k tabuli aj ___." },
    { id: 3, type: "fill", category: "personal", answer: "on", template: "Na štarte už stojí ___." },
    { id: 4, type: "fill", category: "personal", answer: "ona", template: "Pred spaním číta rozprávku ___." },
    { id: 5, type: "fill", category: "personal", answer: "ono", template: "V košíku sa ešte schováva kuriatko, lebo ___ je unavené." },
    { id: 6, type: "fill", category: "personal", answer: "My", template: "___ zajtra vyrážame na školský výlet." },
    { id: 7, type: "fill", category: "personal", answer: "Vy", template: "___ dnes cvičíte novú básničku." },
    { id: 8, type: "fill", category: "personal", answer: "Oni", template: "___ sa chystajú na futbalový turnaj." },
    { id: 9, type: "fill", category: "personal", answer: "Ony", template: "___ prišli do triedy ako prvé." },
    { id: 10, type: "fill", category: "possessive", answer: "môj", template: "To je ___ zošit, nosím ho každý deň." },
    { id: 11, type: "fill", category: "possessive", answer: "moja", template: "Na lavici zostala ___ guma." },
    { id: 12, type: "fill", category: "possessive", answer: "moje", template: "Toto je ___ obľúbené lego." },
    { id: 13, type: "fill", category: "possessive", answer: "tvoja", template: "V skrinke je ___ fľaša na vodu." },
    { id: 14, type: "fill", category: "possessive", answer: "jeho", template: "V predsieni visí ___ kabát." },
    { id: 15, type: "fill", category: "possessive", answer: "jej", template: "Na polici leží ___ kniha." },
    { id: 16, type: "fill", category: "possessive", answer: "náš", template: "Pred školou už stojí ___ autobus." },
    { id: 17, type: "fill", category: "possessive", answer: "vaše", template: "Na stole sú ___ pracovné listy." },
    { id: 18, type: "fill", category: "possessive", answer: "ich", template: "Za domom sa hrá ___ pes." },
    { id: 19, type: "choice", category: "possessive", answer: "moja", template: "Toto je ___ ceruzka.", options: ["moja", "môj", "moje", "ich"] },
    { id: 20, type: "choice", category: "personal", answer: "ona", template: "Po tréningu ___ príde domov unavená.", options: ["on", "ona", "ono", "oni"] },
    { id: 21, type: "choice", category: "personal", answer: "my", template: "Na ihrisko pôjdeme všetci, lebo ___ máme čas.", options: ["ja", "my", "on", "ona"] },
    { id: 22, type: "choice", category: "possessive", answer: "naše", template: "Toto sú ___ kľúče od skrinky.", options: ["naše", "náš", "naša", "jej"] },
    { id: 23, type: "choice", category: "personal", answer: "oni", template: "Do triedy vstúpili chlapci a ___ si sadli.", options: ["oni", "ony", "my", "vy"] },
    { id: 24, type: "choice", category: "personal", answer: "ono", template: "Na stole stojí auto a ___ je červené.", options: ["ono", "ona", "on", "oni"] },
    { id: 25, type: "choice", category: "possessive", answer: "tvoje", template: "Máš tu ___ prezuvky?", options: ["tvoj", "tvoje", "tvoja", "naše"] },
    { id: 26, type: "choice", category: "possessive", answer: "váš", template: "Na nástenke visí ___ rozvrh hodín.", options: ["váš", "vaše", "vaša", "ich"] },
    { id: 27, type: "choice", category: "personal", answer: "on", template: "V klietke odpočíva papagáj a ___ je tichý.", options: ["on", "ona", "ono", "oni"] },
    { id: 28, type: "choice", category: "personal", answer: "ona", template: "Vidím Evu a ___ nesie husle.", options: ["ona", "on", "my", "vy"] },
    { id: 29, type: "choice", category: "possessive", answer: "ich", template: "Naši susedia prišli a ___ dom svieti novou farbou.", options: ["ich", "jeho", "jej", "náš"] },
    { id: 30, type: "choice", category: "possessive", answer: "tvoja", template: "Je to ___ obľúbená hračka?", options: ["moja", "tvoja", "naša", "ich"] },
    { id: 31, type: "choice", category: "personal", answer: "vy", template: "Na predstavenie sa tešíte aj ___?", options: ["vy", "ty", "my", "oni"] },
    { id: 32, type: "choice", category: "personal", answer: "ja", template: "Do školy idem pešo, lebo ___ bývam blízko.", options: ["ja", "my", "oni", "ono"] },
    { id: 33, type: "choice", category: "personal", answer: "ony", template: "Na dvore sa hrajú dievčatá a ___ spievajú.", options: ["ony", "oni", "my", "vy"] },
    { id: 34, type: "choice", category: "possessive", answer: "naša", template: "Pod stromom leží ___ lopta, neodkop ju.", options: ["naša", "náš", "naše", "ich"] },
    { id: 35, type: "choice", category: "personal", answer: "on", template: "Na stole zostal notebook a ___ patrí učiteľovi.", options: ["on", "ono", "ona", "vy"] },
    { id: 36, type: "choice", category: "personal", answer: "ony", template: "Na tanieri sú sušienky a ___ sú ešte teplé.", options: ["ony", "oni", "my", "vy"] },
    { id: 37, type: "find", category: "personal", answer: "Ja", tokens: ["Ja", "dnes", "rozdám", "zošity", "."] },
    { id: 38, type: "find", category: "possessive", answer: "Tvoj", tokens: ["Tvoj", "pes", "čaká", "pri", "dverách", "."] },
    { id: 39, type: "find", category: "personal", answer: "Ona", tokens: ["Ona", "spieva", "v", "zbore", "."] },
    { id: 40, type: "find", category: "possessive", answer: "Náš", tokens: ["Náš", "vlak", "odchádza", "o", "siedmej", "."] },
    { id: 41, type: "find", category: "personal", answer: "Vy", tokens: ["Vy", "cvičíte", "veľmi", "presne", "."] },
    { id: 42, type: "find", category: "possessive", answer: "Jej", tokens: ["Jej", "ceruzka", "spadla", "pod", "lavicu", "."] },
    { id: 43, type: "find", category: "personal", answer: "My", tokens: ["My", "zajtra", "sadíme", "strom", "."] },
    { id: 44, type: "find", category: "possessive", answer: "Jeho", tokens: ["Jeho", "bicykel", "stojí", "pri", "plote", "."] },
    { id: 45, type: "find", category: "personal", answer: "Ono", tokens: ["Ono", "ešte", "pokojne", "spí", "."] },
    { id: 46, type: "find", category: "possessive", answer: "Ich", tokens: ["Ich", "trieda", "vyhrala", "súťaž", "."] },
    { id: 47, type: "find", category: "personal", answer: "Oni", tokens: ["Oni", "bežia", "po", "ihrisku", "."] },
    { id: 48, type: "find", category: "possessive", answer: "Moja", tokens: ["Moja", "babka", "pečie", "koláč", "."] },
    { id: 49, type: "find", category: "personal", answer: "Ty", tokens: ["Ty", "dnes", "odpovedáš", "pri", "tabuli", "."] },
    { id: 50, type: "find", category: "possessive", answer: "Váš", tokens: ["Váš", "tím", "získal", "pohár", "."] }
  ];

  const TASK_COPY = {
    fill: {
      badge: "Dopĺňanie",
      prompt: "Doplň správne zámeno.",
      instruction: "Napíš do prázdneho miesta správne osobné alebo privlastňovacie zámeno."
    },
    choice: {
      badge: "Výber z možností",
      prompt: "Vyber správne zámeno.",
      instruction: "Klikni na možnosť, ktorá vetu doplní správne."
    },
    find: {
      badge: "Nájdi zámeno",
      prompt: "Klikni na zámeno vo vete.",
      instruction: "Vo vete je jedno cieľové osobné alebo privlastňovacie zámeno. Označ ho."
    }
  };

  const CATEGORY_COPY = {
    personal: {
      label: "osobné základné zámeno",
      reason: "Toto zámeno pomenúva osobu alebo vec, o ktorej sa vo vete hovorí."
    },
    possessive: {
      label: "privlastňovacie zámeno",
      reason: "Toto zámeno vyjadruje, komu niečo patrí alebo s kým niečo súvisí."
    }
  };

  const scoreValue = document.getElementById("scoreValue");
  const progressValue = document.getElementById("progressValue");
  const startRoundButton = document.getElementById("startRoundButton");
  const restartButton = document.getElementById("restartButton");
  const taskBadge = document.getElementById("taskBadge");
  const progressLabel = document.getElementById("progressLabel");
  const roundLabel = document.getElementById("roundLabel");
  const progressBar = document.getElementById("progressBar");
  const promptTitle = document.getElementById("promptTitle");
  const instructionText = document.getElementById("instructionText");
  const sentenceText = document.getElementById("sentenceText");
  const textForm = document.getElementById("textForm");
  const textAnswer = document.getElementById("textAnswer");
  const textSubmit = document.getElementById("textSubmit");
  const choiceGrid = document.getElementById("choiceGrid");
  const wordGrid = document.getElementById("wordGrid");
  const feedbackBox = document.getElementById("feedbackBox");
  const feedbackTitle = document.getElementById("feedbackTitle");
  const feedbackAnswer = document.getElementById("feedbackAnswer");
  const feedbackType = document.getElementById("feedbackType");
  const feedbackReason = document.getElementById("feedbackReason");
  const nextButton = document.getElementById("nextButton");
  const questionShell = document.getElementById("questionShell");
  const summaryBox = document.getElementById("summaryBox");
  const summaryScore = document.getElementById("summaryScore");
  const summaryMessage = document.getElementById("summaryMessage");
  const summaryPersonal = document.getElementById("summaryPersonal");
  const summaryPossessive = document.getElementById("summaryPossessive");

  let roundQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function normalize(value) {
    return value
      .trim()
      .toLocaleLowerCase("sk")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }
    return copy;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatBlankTemplate(template) {
    return template.replace("___", '<span class="blank">______</span>');
  }

  function formatSolvedTemplate(template, answer) {
    return template.replace("___", '<span class="solution-word">' + escapeHtml(answer) + "</span>");
  }

  function tokensToSentenceHtml(tokens, highlightAnswer) {
    let html = "";

    tokens.forEach(function (token, index) {
      const isPunctuation = /^[.,!?;:]$/.test(token);
      let rendered = escapeHtml(token);

      if (highlightAnswer && normalize(token) === normalize(highlightAnswer)) {
        rendered = '<span class="solution-word">' + escapeHtml(token) + "</span>";
      }

      if (index === 0 || isPunctuation) {
        html += rendered;
      } else {
        html += " " + rendered;
      }
    });

    return html;
  }

  function updateHud() {
    const total = roundQuestions.length || 10;
    const shownProgress = roundQuestions.length === 0 ? 0 : Math.min(currentIndex + 1, roundQuestions.length);
    const completedWidth = roundQuestions.length === 0 ? 0 : (currentIndex / roundQuestions.length) * 100;

    scoreValue.textContent = score + " / " + total;
    progressValue.textContent = shownProgress + " / " + total;
    roundLabel.textContent = shownProgress + " / " + total;
    progressBar.style.width = completedWidth + "%";
  }

  function resetInteraction() {
    textForm.hidden = true;
    choiceGrid.hidden = true;
    wordGrid.hidden = true;
    feedbackBox.hidden = true;
    nextButton.hidden = true;
    choiceGrid.innerHTML = "";
    wordGrid.innerHTML = "";
    textAnswer.value = "";
    textAnswer.disabled = false;
    textSubmit.disabled = false;
  }

  function renderQuestion() {
    const question = roundQuestions[currentIndex];
    const taskCopy = TASK_COPY[question.type];

    answered = false;
    summaryBox.hidden = true;
    questionShell.hidden = false;
    resetInteraction();
    updateHud();

    taskBadge.textContent = taskCopy.badge;
    taskBadge.className = "badge";
    taskBadge.classList.add("type-" + question.type);
    promptTitle.textContent = taskCopy.prompt;
    instructionText.textContent = taskCopy.instruction;
    progressLabel.textContent = "Úloha " + (currentIndex + 1) + " z " + roundQuestions.length;

    if (question.type === "fill") {
      sentenceText.innerHTML = formatBlankTemplate(question.template);
      textForm.hidden = false;
      window.setTimeout(function () {
        textAnswer.focus();
      }, 0);
      return;
    }

    if (question.type === "choice") {
      sentenceText.innerHTML = formatBlankTemplate(question.template);
      choiceGrid.hidden = false;

      question.options.forEach(function (option) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-button";
        button.textContent = option;
        button.addEventListener("click", function () {
          submitAnswer(option, button, null);
        });
        choiceGrid.appendChild(button);
      });
      return;
    }

    sentenceText.innerHTML = tokensToSentenceHtml(question.tokens);
    wordGrid.hidden = false;

    question.tokens.forEach(function (token, index) {
      if (/^[.,!?;:]$/.test(token)) {
        const punctuation = document.createElement("span");
        punctuation.textContent = token;
        wordGrid.appendChild(punctuation);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "word-button";
      button.textContent = token;
      button.dataset.index = String(index);
      button.addEventListener("click", function () {
        submitAnswer(token, button, index);
      });
      wordGrid.appendChild(button);
    });
  }

  function showFeedback(question, isCorrect) {
    const category = CATEGORY_COPY[question.category];

    if (question.type === "find") {
      sentenceText.innerHTML = tokensToSentenceHtml(question.tokens, question.answer);
    } else {
      sentenceText.innerHTML = formatSolvedTemplate(question.template, question.answer);
    }

    feedbackBox.hidden = false;
    feedbackTitle.textContent = isCorrect ? "Správne." : "Teraz už vidíš správne riešenie.";
    feedbackTitle.className = "feedback-title";
    feedbackTitle.classList.add(isCorrect ? "correct-text" : "incorrect-text");
    feedbackAnswer.innerHTML = "<strong>Správne riešenie:</strong> " + escapeHtml(question.answer);
    feedbackType.innerHTML = "<strong>Typ zámena:</strong> " + escapeHtml(category.label);
    feedbackReason.innerHTML = "<strong>Prečo:</strong> " + escapeHtml(category.reason);
    nextButton.textContent = currentIndex === roundQuestions.length - 1 ? "Zobraziť výsledok" : "Ďalšia veta";
    nextButton.hidden = false;
  }

  function submitAnswer(rawAnswer, selectedButton, selectedIndex) {
    const question = roundQuestions[currentIndex];
    if (answered) {
      return;
    }

    answered = true;
    let isCorrect = false;

    if (question.type === "find") {
      const correctIndex = question.tokens.findIndex(function (token) {
        return normalize(token) === normalize(question.answer);
      });

      Array.from(wordGrid.querySelectorAll(".word-button")).forEach(function (button) {
        const buttonIndex = Number(button.dataset.index);
        if (buttonIndex === correctIndex) {
          button.classList.add("correct");
        }
        if (button === selectedButton && buttonIndex !== correctIndex) {
          button.classList.add("incorrect");
        }
        button.disabled = true;
      });

      isCorrect = selectedIndex === correctIndex;
    } else if (question.type === "choice") {
      Array.from(choiceGrid.querySelectorAll(".choice-button")).forEach(function (button) {
        if (normalize(button.textContent) === normalize(question.answer)) {
          button.classList.add("correct");
        }
        if (button === selectedButton && normalize(button.textContent) !== normalize(question.answer)) {
          button.classList.add("incorrect");
        }
        button.disabled = true;
      });

      isCorrect = normalize(rawAnswer) === normalize(question.answer);
    } else {
      textAnswer.disabled = true;
      textSubmit.disabled = true;
      isCorrect = normalize(rawAnswer) === normalize(question.answer);
    }

    if (isCorrect) {
      score += 1;
    }

    updateHud();
    showFeedback(question, isCorrect);
  }

  function showSummary() {
    const personalCount = roundQuestions.filter(function (question) {
      return question.category === "personal";
    }).length;
    const possessiveCount = roundQuestions.length - personalCount;

    summaryScore.textContent = String(score);
    summaryPersonal.textContent = String(personalCount);
    summaryPossessive.textContent = String(possessiveCount);

    if (score === roundQuestions.length) {
      summaryMessage.textContent = "Výborné. V tomto kole boli všetky odpovede správne.";
    } else if (score >= 7) {
      summaryMessage.textContent = "Dobrá práca. Skús ešte jedno kolo a trafíš aj zvyšné zámená.";
    } else {
      summaryMessage.textContent = "Spusti ďalšie kolo a precvič si novú desiatku viet z banky.";
    }

    questionShell.hidden = true;
    summaryBox.hidden = false;
    progressLabel.textContent = "Kolo je dokončené.";
    roundLabel.textContent = roundQuestions.length + " / " + roundQuestions.length;
    progressValue.textContent = roundQuestions.length + " / " + roundQuestions.length;
    progressBar.style.width = "100%";
  }

  function startRound() {
    roundQuestions = shuffle(QUESTION_BANK).slice(0, 10);
    currentIndex = 0;
    score = 0;
    startRoundButton.textContent = "Spustiť ďalšie kolo";
    updateHud();
    renderQuestion();
  }

  textForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!textAnswer.value.trim()) {
      textAnswer.focus();
      return;
    }
    submitAnswer(textAnswer.value, null, null);
  });

  nextButton.addEventListener("click", function () {
    currentIndex += 1;

    if (currentIndex >= roundQuestions.length) {
      showSummary();
      return;
    }

    renderQuestion();
  });

  startRoundButton.addEventListener("click", startRound);
  restartButton.addEventListener("click", startRound);

  updateHud();
})();
