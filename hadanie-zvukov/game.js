const TOTAL_SOUNDS = 16;
const STORAGE_KEY = "hadanie-zvukov-odpovede";
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".m4a"];
const teacherKey = Array.isArray(window.SOUND_DATA) ? window.SOUND_DATA : [];
const teacherKeyById = new Map(
  teacherKey
    .filter((item) => Number.isInteger(item?.id) && item.id >= 1 && item.id <= TOTAL_SOUNDS)
    .map((item) => [item.id, item])
);

const sounds = Array.from({ length: TOTAL_SOUNDS }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const config = teacherKeyById.get(index + 1) ?? {};
  return {
    id: index + 1,
    number,
    label: `Zvuk ${number}`,
    baseName:
      typeof config.file === "string" && config.file.trim() ? config.file.trim() : `zvuk-${number}`,
    correctAnswer: typeof config.answer === "string" ? config.answer.trim() : "",
    correctCategory: typeof config.category === "string" ? config.category.trim() : ""
  };
});

const state = {
  currentSoundId: 1,
  answers: loadAnswers(),
  audioSources: [],
  audioSourceIndex: 0,
  pendingAutoplay: false
};

const soundGrid = document.getElementById("soundGrid");
const savedCount = document.getElementById("savedCount");
const perfectCount = document.getElementById("perfectCount");
const keyCount = document.getElementById("keyCount");
const activeSound = document.getElementById("activeSound");
const detailTitle = document.getElementById("detailTitle");
const soundState = document.getElementById("soundState");
const audioPlayer = document.getElementById("audioPlayer");
const audioHint = document.getElementById("audioHint");
const answerForm = document.getElementById("answerForm");
const guessInput = document.getElementById("guessInput");
const formMessage = document.getElementById("formMessage");
const evaluationCard = document.getElementById("evaluationCard");
const summaryList = document.getElementById("summaryList");
const clearCurrentButton = document.getElementById("clearCurrentButton");
const clearAllButton = document.getElementById("clearAllButton");

function loadAnswers() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveAnswers() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.answers));
}

function getSelectedSound() {
  return sounds.find((sound) => sound.id === state.currentSoundId) ?? sounds[0];
}

function getAnswer(soundId) {
  return state.answers[String(soundId)] ?? null;
}

function countSavedAnswers() {
  return sounds.filter((sound) => {
    const answer = getAnswer(sound.id);
    return Boolean(answer?.guess) && Boolean(answer?.category);
  }).length;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function hasTeacherKey(sound) {
  return Boolean(sound.correctAnswer) && Boolean(sound.correctCategory);
}

function countTeacherKeys() {
  return sounds.filter((sound) => hasTeacherKey(sound)).length;
}

function evaluateAnswer(sound, answer) {
  if (!answer || !hasTeacherKey(sound)) {
    return null;
  }

  const guessCorrect = normalizeText(answer.guess) === normalizeText(sound.correctAnswer);
  const categoryCorrect = answer.category === sound.correctCategory;
  const total = Number(guessCorrect) + Number(categoryCorrect);

  return {
    guessCorrect,
    categoryCorrect,
    total,
    status: total === 2 ? "perfect" : total === 1 ? "partial" : "wrong"
  };
}

function countPerfectAnswers() {
  return sounds.filter((sound) => {
    const result = evaluateAnswer(sound, getAnswer(sound.id));
    return result?.status === "perfect";
  }).length;
}

function resultLabel(status) {
  if (status === "perfect") {
    return "Správne";
  }
  if (status === "partial") {
    return "Čiastočne správne";
  }
  return "Nesprávne";
}

function categoryLabel(value) {
  return value === "priroda" ? "Zvuk prírody" : "Ľudská činnosť";
}

function setFormMessage(text, type = "info") {
  formMessage.textContent = text;
  formMessage.style.background =
    type === "error" ? "rgba(163, 71, 50, 0.12)" : "rgba(239, 182, 76, 0.18)";
  formMessage.style.color = type === "error" ? "#8f3321" : "#7b5611";
}

function buildAudioSources(sound) {
  return AUDIO_EXTENSIONS.map((extension) => `./zvuky/${sound.baseName}${extension}`);
}

function renderGrid() {
  soundGrid.innerHTML = "";

  sounds.forEach((sound) => {
    const button = document.createElement("button");
    const answer = getAnswer(sound.id);
    const result = evaluateAnswer(sound, answer);
    const isSaved = Boolean(answer?.guess) && Boolean(answer?.category);
    const isActive = sound.id === state.currentSoundId;

    button.type = "button";
    button.className = "sound-card";
    if (isSaved) {
      button.classList.add("is-saved");
    }
    if (isActive) {
      button.classList.add("is-active");
    }
    if (result?.status) {
      button.classList.add(`is-${result.status}`);
    }

    button.innerHTML = `
      <span class="sound-number">${sound.label}</span>
      <span class="sound-mark" aria-hidden="true">?</span>
      ${isSaved ? `<span class="sound-tag">${result ? resultLabel(result.status) : "Uložené"}</span>` : ""}
    `;
    button.setAttribute("aria-label", `${sound.label}${isSaved ? ", odpoveď uložená" : ""}`);
    button.addEventListener("click", () => {
      state.currentSoundId = sound.id;
      render({ autoplay: true });
    });

    soundGrid.appendChild(button);
  });
}

function renderSummary() {
  const filledSounds = sounds.filter((sound) => getAnswer(sound.id));

  if (filledSounds.length === 0) {
    summaryList.innerHTML = `
      <article class="summary-item is-empty">
        <p>Zatiaľ nie je uložená žiadna odpoveď.</p>
      </article>
    `;
    return;
  }

  summaryList.innerHTML = "";

  sounds.forEach((sound) => {
    const answer = getAnswer(sound.id);
    const result = evaluateAnswer(sound, answer);
    const article = document.createElement("article");
    article.className = `summary-item${answer ? "" : " is-empty"}${result ? ` is-${result.status}` : ""}`;

    if (!answer) {
      article.innerHTML = `
        <h3>${sound.label}</h3>
        <p>Ešte bez odpovede.</p>
      `;
      summaryList.appendChild(article);
      return;
    }

    article.innerHTML = `
      <h3>${sound.label}</h3>
      <p><strong>Odpoveď:</strong> ${escapeHtml(answer.guess)}</p>
      <p><strong>Kategória:</strong> ${categoryLabel(answer.category)}</p>
      ${
        result
          ? `<p><strong>Správna odpoveď:</strong> ${escapeHtml(sound.correctAnswer)}</p>
             <p><strong>Správna kategória:</strong> ${categoryLabel(sound.correctCategory)}</p>
             <span class="summary-result is-${result.status}">${resultLabel(result.status)}</span>`
          : ""
      }
    `;
    summaryList.appendChild(article);
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setCheckedCategory(category) {
  const inputs = Array.from(answerForm.elements.category);
  for (const input of inputs) {
    input.checked = input.value === category;
  }
}

function loadAudioCandidate(sound, index) {
  if (sound.id !== state.currentSoundId) {
    return;
  }

  if (index >= state.audioSources.length) {
    soundState.textContent = "Súbor chýba";
    soundState.className = "state-badge is-missing";
    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    audioPlayer.load();
    audioPlayer.hidden = true;
    audioHint.textContent =
      `V priečinku zvuky zatiaľ nevidím súbor ${sound.baseName} s podporovanou príponou.`;
    state.pendingAutoplay = false;
    return;
  }

  state.audioSourceIndex = index;
  const source = state.audioSources[index];

  soundState.textContent = "Načítavam zvuk";
  soundState.className = "state-badge";
  audioPlayer.hidden = false;
  audioHint.textContent = `Skúšam otvoriť súbor ${sound.baseName}${AUDIO_EXTENSIONS[index]}.`;
  audioPlayer.src = source;
  audioPlayer.load();
}

async function renderDetail(autoplay = false) {
  const sound = getSelectedSound();
  const answer = getAnswer(sound.id);
  const result = evaluateAnswer(sound, answer);

  detailTitle.textContent = sound.label;
  activeSound.textContent = sound.label;
  guessInput.value = answer?.guess ?? "";
  setCheckedCategory(answer?.category ?? "");
  audioPlayer.pause();
  audioPlayer.hidden = true;
  state.audioSources = buildAudioSources(sound);
  state.audioSourceIndex = 0;
  state.pendingAutoplay = autoplay;
  loadAudioCandidate(sound, 0);

  if (!answer) {
    evaluationCard.className = "evaluation-card";
    evaluationCard.innerHTML = hasTeacherKey(sound)
      ? `<h3>Vyhodnotenie</h3><p>Po uložení odpovede sa tu ukáže, či bola správna.</p>`
      : `<h3>Vyhodnotenie</h3><p>Pre tento zvuk ešte nie je vyplnený učiteľský kľúč.</p>`;
    return;
  }

  if (!result) {
    evaluationCard.className = "evaluation-card";
    evaluationCard.innerHTML =
      "<h3>Vyhodnotenie</h3><p>Pre tento zvuk ešte nie je dostupné porovnanie so správnou odpoveďou.</p>";
    return;
  }

  evaluationCard.className = `evaluation-card is-${result.status}`;
  evaluationCard.innerHTML = `
    <h3>${resultLabel(result.status)}</h3>
    <p>Odpoveď žiaka: <strong>${escapeHtml(answer.guess)}</strong></p>
    <p>Správna odpoveď: <strong>${escapeHtml(sound.correctAnswer)}</strong></p>
    <p>Kategória žiaka: <strong>${categoryLabel(answer.category)}</strong></p>
    <p>Správna kategória: <strong>${categoryLabel(sound.correctCategory)}</strong></p>
  `;
}

function renderStatus() {
  savedCount.textContent = `${countSavedAnswers()} / ${TOTAL_SOUNDS}`;
  perfectCount.textContent = `${countPerfectAnswers()} / ${TOTAL_SOUNDS}`;
  keyCount.textContent = `${countTeacherKeys()} / ${TOTAL_SOUNDS}`;
}

function render(options = {}) {
  renderGrid();
  renderStatus();
  renderSummary();
  renderDetail(Boolean(options.autoplay));
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const sound = getSelectedSound();
  const guess = guessInput.value.trim();
  const category = answerForm.elements.category.value;

  if (!guess) {
    setFormMessage("Najprv napíš, čo podľa teba počuješ.", "error");
    guessInput.focus();
    return;
  }

  if (!category) {
    setFormMessage("Vyber, či ide o zvuk prírody alebo o ľudskú činnosť.", "error");
    return;
  }

  state.answers[String(sound.id)] = {
    guess,
    category
  };
  saveAnswers();
  render();
  const result = evaluateAnswer(sound, state.answers[String(sound.id)]);
  setFormMessage(
    result
      ? `Odpoveď pre ${sound.label.toLowerCase()} je uložená. Výsledok: ${resultLabel(result.status).toLowerCase()}.`
      : `Odpoveď pre ${sound.label.toLowerCase()} je uložená.`
  );
});

clearCurrentButton.addEventListener("click", () => {
  const sound = getSelectedSound();
  delete state.answers[String(sound.id)];
  saveAnswers();
  render();
  setFormMessage(`Odpoveď pre ${sound.label.toLowerCase()} bola vymazaná.`);
});

clearAllButton.addEventListener("click", () => {
  const confirmed = window.confirm("Naozaj chceš vymazať všetky uložené odpovede?");
  if (!confirmed) {
    return;
  }

  state.answers = {};
  saveAnswers();
  render();
  setFormMessage("Všetky odpovede boli vymazané.");
});

audioPlayer.addEventListener("loadeddata", async () => {
  const sound = getSelectedSound();

  soundState.textContent = "Zvuk pripravený";
  soundState.className = "state-badge is-ready";
  audioHint.textContent = hasTeacherKey(sound)
    ? `Prehráva sa súbor ${sound.baseName}. Kľúč učiteľa je pre tento zvuk vyplnený.`
    : `Prehráva sa súbor ${sound.baseName}. Kľúč učiteľa ešte nie je vyplnený.`;

  if (!state.pendingAutoplay) {
    return;
  }

  state.pendingAutoplay = false;

  try {
    await audioPlayer.play();
  } catch (error) {
    audioHint.textContent += " Ak sa nespustí automaticky, stlač tlačidlo Play.";
  }
});

audioPlayer.addEventListener("error", () => {
  const sound = getSelectedSound();
  loadAudioCandidate(sound, state.audioSourceIndex + 1);
});

render();
