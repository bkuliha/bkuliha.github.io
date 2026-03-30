const POS_LABELS = {
  noun: "podstatné meno",
  adjective: "prídavné meno",
  pronoun: "zámeno",
  numeral: "číslovka",
  verb: "sloveso"
};

const MODE_CONFIG = {
  verbs: {
    label: "Nájdi slovesá",
    title: "Nájdi slovesá vo vete",
    intro:
      "Klikaj iba na slovesá. Keď je sloveso reflexívne, napríklad usmieva sa, berie sa ako jedno sloveso.",
    help: "Klikni na všetky slovesá a potom skontroluj odpoveď."
  },
  parts: {
    label: "Urči slovné druhy",
    title: "Urči slovné druhy všetkých slov",
    intro:
      "Pri každom slove vyber správny slovný druh. Vety obsahujú iba ohybné slovné druhy.",
    help: "Pri každom slove vyber správnu možnosť a potom skontroluj odpoveď."
  }
};

const ROUND_SIZE = 10;
const MIN_NUMERAL_SENTENCES_IN_PARTS_MODE = Math.ceil(ROUND_SIZE / 3);

function token(text, type) {
  return { text, type };
}

const sentenceEntries = [
  {
    subject: [token("chlapec", "noun")],
    predicates: [
      [token("beží", "verb")],
      [token("nesie", "verb"), token("loptu", "noun")],
      [token("kreslí", "verb"), token("draka", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("malý", "adjective"), token("chlapec", "noun")],
    predicates: [
      [token("skáče", "verb")],
      [token("číta", "verb"), token("moju", "pronoun"), token("knihu", "noun")],
      [token("počíta", "verb"), token("tri", "numeral"), token("príklady", "noun")],
      [token("teší sa", "verb")]
    ]
  },
  {
    subject: [token("moja", "pronoun"), token("sestra", "noun")],
    predicates: [
      [token("spieva", "verb")],
      [token("maľuje", "verb"), token("veľké", "adjective"), token("kvety", "noun")],
      [token("nesie", "verb"), token("dve", "numeral"), token("tašky", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("táto", "pronoun"), token("žiačka", "noun")],
    predicates: [
      [token("píše", "verb")],
      [token("číta", "verb"), token("krátky", "adjective"), token("list", "noun")],
      [token("kreslí", "verb"), token("dom", "noun")],
      [token("hlási sa", "verb")]
    ]
  },
  {
    subject: [token("naša", "pronoun"), token("učiteľka", "noun")],
    predicates: [
      [token("učí", "verb")],
      [token("chváli", "verb"), token("múdrych", "adjective"), token("žiakov", "noun")],
      [token("píše", "verb"), token("tri", "numeral"), token("poznámky", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("múdry", "adjective"), token("dedko", "noun")],
    predicates: [
      [token("sedí", "verb")],
      [token("číta", "verb"), token("noviny", "noun")],
      [token("varí", "verb"), token("čaj", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("veselá", "adjective"), token("mama", "noun")],
    predicates: [
      [token("varí", "verb")],
      [token("pečie", "verb"), token("sladký", "adjective"), token("koláč", "noun")],
      [token("nesie", "verb"), token("ťažký", "adjective"), token("nákup", "noun")],
      [token("ponáhľa sa", "verb")]
    ]
  },
  {
    subject: [token("druhý", "numeral"), token("brat", "noun")],
    predicates: [
      [token("cvičí", "verb")],
      [token("dvíha", "verb"), token("činku", "noun")],
      [token("kreslí", "verb"), token("auto", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("prvá", "numeral"), token("žiačka", "noun")],
    predicates: [
      [token("ráta", "verb")],
      [token("píše", "verb"), token("dve", "numeral"), token("vety", "noun")],
      [token("číta", "verb"), token("bájku", "noun")],
      [token("hlási sa", "verb")]
    ]
  },
  {
    subject: [token("tento", "pronoun"), token("turista", "noun")],
    predicates: [
      [token("kráča", "verb")],
      [token("fotí", "verb"), token("starý", "adjective"), token("hrad", "noun")],
      [token("nesie", "verb"), token("nový", "adjective"), token("batoh", "noun")],
      [token("obzerá sa", "verb")]
    ]
  },
  {
    subject: [token("verný", "adjective"), token("pes", "noun")],
    predicates: [
      [token("beží", "verb")],
      [token("chytá", "verb"), token("loptu", "noun")],
      [token("nesie", "verb"), token("palicu", "noun")],
      [token("teší sa", "verb")]
    ]
  },
  {
    subject: [token("hravý", "adjective"), token("kocúr", "noun")],
    predicates: [
      [token("skáče", "verb")],
      [token("naháňa", "verb"), token("klbko", "noun")],
      [token("chytá", "verb"), token("myš", "noun")],
      [token("umýva sa", "verb")]
    ]
  },
  {
    subject: [token("biela", "adjective"), token("sliepka", "noun")],
    predicates: [
      [token("behá", "verb")],
      [token("zobká", "verb"), token("zrno", "noun")],
      [token("hľadá", "verb"), token("červíka", "noun")],
      [token("napije sa", "verb")]
    ]
  },
  {
    subject: [token("piate", "numeral"), token("jablko", "noun")],
    predicates: [
      [token("dozrieva", "verb")],
      [token("padá", "verb")],
      [token("vonia", "verb")],
      [token("kotúľa sa", "verb")]
    ]
  },
  {
    subject: [token("štvrté", "numeral"), token("auto", "noun")],
    predicates: [
      [token("stojí", "verb")],
      [token("trúbi", "verb")],
      [token("brzdí", "verb")],
      [token("rozbieha sa", "verb")]
    ]
  },
  {
    subject: [token("naše", "pronoun"), token("dieťa", "noun")],
    predicates: [
      [token("kreslí", "verb")],
      [token("číta", "verb"), token("moju", "pronoun"), token("knihu", "noun")],
      [token("stavia", "verb"), token("veľkú", "adjective"), token("vežu", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("toto", "pronoun"), token("jahňa", "noun")],
    predicates: [
      [token("stojí", "verb")],
      [token("skáče", "verb")],
      [token("pije", "verb"), token("mlieko", "noun")],
      [token("obzerá sa", "verb")]
    ]
  },
  {
    subject: [token("naša", "pronoun"), token("babka", "noun")],
    predicates: [
      [token("štrikuje", "verb")],
      [token("pečie", "verb"), token("koláč", "noun")],
      [token("číta", "verb"), token("rozprávku", "noun")],
      [token("usmieva sa", "verb")]
    ]
  },
  {
    subject: [token("silný", "adjective"), token("kamarát", "noun")],
    predicates: [
      [token("pomáha", "verb")],
      [token("nesie", "verb"), token("ťažkú", "adjective"), token("tašku", "noun")],
      [token("dvíha", "verb"), token("krabicu", "noun")],
      [token("ponáhľa sa", "verb")]
    ]
  },
  {
    subject: [token("chlapci", "noun")],
    predicates: [
      [token("bežia", "verb")],
      [token("hrajú", "verb"), token("futbal", "noun")],
      [token("nesú", "verb"), token("batohy", "noun")],
      [token("smejú sa", "verb")]
    ]
  },
  {
    subject: [token("títo", "pronoun"), token("žiaci", "noun")],
    predicates: [
      [token("píšu", "verb")],
      [token("čítajú", "verb"), token("krátky", "adjective"), token("text", "noun")],
      [token("rátajú", "verb"), token("príklady", "noun")],
      [token("hlásia sa", "verb")]
    ]
  },
  {
    subject: [token("naše", "pronoun"), token("sestry", "noun")],
    predicates: [
      [token("spievajú", "verb")],
      [token("kreslia", "verb"), token("veľké", "adjective"), token("kvety", "noun")],
      [token("nesú", "verb"), token("tašky", "noun")],
      [token("usmievajú sa", "verb")]
    ]
  },
  {
    subject: [token("tri", "numeral"), token("mačky", "noun")],
    predicates: [
      [token("spia", "verb")],
      [token("chytajú", "verb"), token("klbká", "noun")],
      [token("pijú", "verb"), token("mlieko", "noun")],
      [token("hrajú sa", "verb")]
    ]
  },
  {
    subject: [token("dve", "numeral"), token("jahňatá", "noun")],
    predicates: [
      [token("behajú", "verb")],
      [token("pijú", "verb"), token("mlieko", "noun")],
      [token("hľadajú", "verb"), token("mamu", "noun")],
      [token("schovajú sa", "verb")]
    ]
  },
  {
    subject: [token("veselé", "adjective"), token("deti", "noun")],
    predicates: [
      [token("tancujú", "verb")],
      [token("stavajú", "verb"), token("hrad", "noun")],
      [token("nesú", "verb"), token("lopty", "noun")],
      [token("smejú sa", "verb")]
    ]
  },
  {
    subject: [token("tieto", "pronoun"), token("sliepky", "noun")],
    predicates: [
      [token("zobkajú", "verb")],
      [token("behajú", "verb")],
      [token("hľadajú", "verb"), token("zrno", "noun")],
      [token("napijú sa", "verb")]
    ]
  },
  {
    subject: [token("štyri", "numeral"), token("autá", "noun")],
    predicates: [
      [token("stoja", "verb")],
      [token("trúbia", "verb")],
      [token("brzdia", "verb")],
      [token("rozbiehajú sa", "verb")]
    ]
  },
  {
    subject: [token("zelené", "adjective"), token("jablká", "noun")],
    predicates: [
      [token("dozrievajú", "verb")],
      [token("padajú", "verb")],
      [token("voňajú", "verb")],
      [token("kotúľajú sa", "verb")]
    ]
  },
  {
    subject: [token("múdre", "adjective"), token("žiačky", "noun")],
    predicates: [
      [token("píšu", "verb")],
      [token("čítajú", "verb"), token("knihy", "noun")],
      [token("rátajú", "verb"), token("tri", "numeral"), token("príklady", "noun")],
      [token("hlásia sa", "verb")]
    ]
  },
  {
    subject: [token("biele", "adjective"), token("svetlá", "noun")],
    predicates: [
      [token("svietia", "verb")],
      [token("blikajú", "verb")],
      [token("hasnú", "verb")],
      [token("rozsvietia sa", "verb")]
    ]
  },
  {
    subject: [token("naši", "pronoun"), token("kamaráti", "noun")],
    predicates: [
      [token("cestujú", "verb")],
      [token("nesú", "verb"), token("batohy", "noun")],
      [token("fotia", "verb"), token("hrad", "noun")],
      [token("obzerajú sa", "verb")]
    ]
  },
  {
    subject: [token("prví", "numeral"), token("turisti", "noun")],
    predicates: [
      [token("kráčajú", "verb")],
      [token("fotia", "verb"), token("most", "noun")],
      [token("nesú", "verb"), token("nové", "adjective"), token("mapy", "noun")],
      [token("ponáhľajú sa", "verb")]
    ]
  }
];

function buildSentenceBank() {
  const bank = [];

  sentenceEntries.forEach((entry, entryIndex) => {
    entry.predicates.forEach((predicate, predicateIndex) => {
      bank.push({
        id: `${entryIndex + 1}-${predicateIndex + 1}`,
        words: [...entry.subject, ...predicate]
      });
    });
  });

  return bank;
}

const sentenceBank = buildSentenceBank();

const elements = {
  bankSizeValue: document.getElementById("bankSizeValue"),
  modeValue: document.getElementById("modeValue"),
  progressValue: document.getElementById("progressValue"),
  scoreValue: document.getElementById("scoreValue"),
  introScreen: document.getElementById("introScreen"),
  introText: document.getElementById("introText"),
  questionScreen: document.getElementById("questionScreen"),
  questionBadge: document.getElementById("questionBadge"),
  questionTitle: document.getElementById("questionTitle"),
  questionHelp: document.getElementById("questionHelp"),
  sentenceText: document.getElementById("sentenceText"),
  interactionArea: document.getElementById("interactionArea"),
  feedbackBox: document.getElementById("feedbackBox"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),
  resultScreen: document.getElementById("resultScreen"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  playAgainButton: document.getElementById("playAgainButton"),
  checkButton: document.getElementById("checkButton"),
  nextButton: document.getElementById("nextButton"),
  modeCards: Array.from(document.querySelectorAll(".mode-card"))
};

const state = {
  mode: "verbs",
  round: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  verbSelections: new Set()
};

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function getDisplayWordText(sentence, index) {
  const raw = sentence.words[index].text;
  if (index !== 0) {
    return raw;
  }

  return `${raw.charAt(0).toLocaleUpperCase("sk-SK")}${raw.slice(1)}`;
}

function sentenceToText(sentence) {
  return `${sentence.words.map((word, index) => getDisplayWordText(sentence, index)).join(" ")}.`;
}

function getCurrentSentence() {
  return state.round[state.currentIndex];
}

function getVerbIndexes(sentence) {
  return sentence.words
    .map((word, index) => (word.type === "verb" ? index : -1))
    .filter((index) => index !== -1);
}

function sentenceHasType(sentence, type) {
  return sentence.words.some((word) => word.type === type);
}

function updateModeUI() {
  const config = MODE_CONFIG[state.mode];
  elements.modeValue.textContent = config.label;
  elements.introText.textContent = config.intro;

  elements.modeCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.mode === state.mode);
  });
}

function updateStatus() {
  const shownProgress = state.round.length ? state.currentIndex + 1 : 0;
  elements.progressValue.textContent = `${Math.min(shownProgress, ROUND_SIZE)} / ${ROUND_SIZE}`;
  elements.scoreValue.textContent = String(state.score);
}

function resetFeedback() {
  elements.feedbackBox.className = "feedback hidden";
  elements.feedbackTitle.textContent = "Výsledok";
  elements.feedbackText.textContent = "";
}

function showScreen(screenName) {
  elements.introScreen.classList.toggle("hidden", screenName !== "intro");
  elements.questionScreen.classList.toggle("hidden", screenName !== "question");
  elements.resultScreen.classList.toggle("hidden", screenName !== "result");
}

function renderVerbMode(sentence) {
  state.verbSelections = new Set();
  const container = document.createElement("div");
  container.className = "verb-grid";

  sentence.words.forEach((word, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "word-chip";
    button.textContent = getDisplayWordText(sentence, index);

    button.addEventListener("click", () => {
      if (state.answered) {
        return;
      }

      if (state.verbSelections.has(index)) {
        state.verbSelections.delete(index);
        button.classList.remove("selected");
      } else {
        state.verbSelections.add(index);
        button.classList.add("selected");
      }
    });

    container.appendChild(button);
  });

  elements.interactionArea.replaceChildren(container);
}

function renderPartsMode(sentence) {
  const container = document.createElement("div");
  container.className = "parts-grid";

  sentence.words.forEach((word, index) => {
    const row = document.createElement("div");
    row.className = "part-row";
    row.dataset.index = String(index);

    const wordLabel = document.createElement("div");
    wordLabel.className = "part-word";
    wordLabel.textContent = getDisplayWordText(sentence, index);

    const select = document.createElement("select");
    select.dataset.index = String(index);
    select.innerHTML = `
      <option value="">Vyber slovný druh</option>
      <option value="noun">podstatné meno</option>
      <option value="adjective">prídavné meno</option>
      <option value="pronoun">zámeno</option>
      <option value="numeral">číslovka</option>
      <option value="verb">sloveso</option>
    `;

    const answer = document.createElement("div");
    answer.className = "part-answer";
    answer.textContent = "Vyber odpoveď.";

    row.append(wordLabel, select, answer);
    container.appendChild(row);
  });

  elements.interactionArea.replaceChildren(container);
}

function renderQuestion() {
  const sentence = getCurrentSentence();
  const config = MODE_CONFIG[state.mode];

  state.answered = false;
  resetFeedback();
  updateStatus();
  showScreen("question");

  elements.questionBadge.textContent = `Veta ${state.currentIndex + 1} z ${ROUND_SIZE}`;
  elements.questionTitle.textContent = config.title;
  elements.questionHelp.textContent = config.help;
  elements.sentenceText.textContent = sentenceToText(sentence);
  elements.checkButton.disabled = false;
  elements.checkButton.classList.remove("hidden");
  elements.nextButton.classList.add("hidden");

  if (state.mode === "verbs") {
    renderVerbMode(sentence);
  } else {
    renderPartsMode(sentence);
  }
}

function getVerbFeedback(sentence) {
  const correctIndexes = new Set(getVerbIndexes(sentence));
  const selectedIndexes = state.verbSelections;
  const buttons = Array.from(elements.interactionArea.querySelectorAll(".word-chip"));
  let allCorrect = correctIndexes.size === selectedIndexes.size;

  buttons.forEach((button, index) => {
    const isCorrect = correctIndexes.has(index);
    const isSelected = selectedIndexes.has(index);

    button.disabled = true;

    if (isCorrect && isSelected) {
      button.classList.add("correct");
    } else if (isCorrect && !isSelected) {
      button.classList.add("missed");
      allCorrect = false;
    } else if (!isCorrect && isSelected) {
      button.classList.add("incorrect");
      allCorrect = false;
    }
  });

  const answerWords = sentence.words
    .filter((word) => word.type === "verb")
    .map((word) => word.text)
    .join(", ");

  return {
    correct: allCorrect,
    message: allCorrect
      ? `Výborne. Správne si označil slovesá: ${answerWords}.`
      : `Správne slovesá sú: ${answerWords}.`
  };
}

function getPartsFeedback(sentence) {
  const rows = Array.from(elements.interactionArea.querySelectorAll(".part-row"));
  let allCorrect = true;

  rows.forEach((row) => {
    const index = Number(row.dataset.index);
    const select = row.querySelector("select");
    const answer = row.querySelector(".part-answer");
    const word = sentence.words[index];
    const chosen = select.value;
    const correct = chosen === word.type;

    select.disabled = true;
    answer.textContent = `Správne: ${POS_LABELS[word.type]}`;

    if (correct) {
      row.classList.add("correct-row");
    } else {
      row.classList.add("incorrect-row");
      allCorrect = false;
    }
  });

  return {
    correct: allCorrect,
    message: allCorrect
      ? "Výborne. Pri všetkých slovách si určil správny slovný druh."
      : "Pozri si správne riešenie pri jednotlivých slovách."
  };
}

function checkAnswer() {
  if (state.answered) {
    return;
  }

  const sentence = getCurrentSentence();
  const result = state.mode === "verbs" ? getVerbFeedback(sentence) : getPartsFeedback(sentence);

  state.answered = true;
  if (result.correct) {
    state.score += 1;
  }

  updateStatus();
  elements.feedbackBox.className = `feedback ${result.correct ? "good" : "bad"}`;
  elements.feedbackTitle.textContent = result.correct ? "Správne" : "Skús pozrieť riešenie";
  elements.feedbackText.textContent = result.message;
  elements.checkButton.classList.add("hidden");
  elements.nextButton.classList.remove("hidden");
}

function showResult() {
  updateStatus();
  showScreen("result");

  const config = MODE_CONFIG[state.mode];
  const percent = Math.round((state.score / ROUND_SIZE) * 100);

  elements.resultTitle.textContent = `Tvoje skóre: ${state.score} / ${ROUND_SIZE}`;
  elements.resultText.textContent =
    percent >= 90
      ? `${config.label}: výborná práca. Slovesá aj slovné druhy sa dnes hýbali presne podľa teba.`
      : percent >= 60
        ? `${config.label}: dobrý výsledok. Skús ešte jedno kolo s novou desiatkou viet.`
        : `${config.label}: ešte jedno kolo pomôže. Hra vždy vyberie nových 10 viet z veľkej banky.`;
}

function goNext() {
  if (state.currentIndex === ROUND_SIZE - 1) {
    showResult();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

function startRound() {
  if (state.mode === "parts") {
    const numeralSentences = shuffle(sentenceBank.filter((sentence) => sentenceHasType(sentence, "numeral")));
    const otherSentences = shuffle(sentenceBank.filter((sentence) => !sentenceHasType(sentence, "numeral")));

    const requiredNumeralSentences = numeralSentences.slice(0, MIN_NUMERAL_SENTENCES_IN_PARTS_MODE);
    const remainingCount = ROUND_SIZE - requiredNumeralSentences.length;
    const remainingPool = shuffle([
      ...numeralSentences.slice(MIN_NUMERAL_SENTENCES_IN_PARTS_MODE),
      ...otherSentences
    ]);

    state.round = shuffle([...requiredNumeralSentences, ...remainingPool.slice(0, remainingCount)]);
  } else {
    state.round = shuffle(sentenceBank).slice(0, ROUND_SIZE);
  }

  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  renderQuestion();
}

elements.modeCards.forEach((card) => {
  card.addEventListener("click", () => {
    state.mode = card.dataset.mode;
    updateModeUI();

    if (!elements.questionScreen.classList.contains("hidden")) {
      startRound();
    }
  });
});

elements.startButton.addEventListener("click", startRound);
elements.restartButton.addEventListener("click", startRound);
elements.playAgainButton.addEventListener("click", startRound);
elements.checkButton.addEventListener("click", checkAnswer);
elements.nextButton.addEventListener("click", goNext);

elements.bankSizeValue.textContent = String(sentenceBank.length);
updateModeUI();
updateStatus();
showScreen("intro");
