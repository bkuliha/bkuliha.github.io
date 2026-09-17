(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const topics = {
    civil: { title: 'Civilná ochrana', art: 'rescue', color: '#eef0e4', tag: 'ZACHOVAJ POKOJ. KONAJ BEZPEČNE.', description: 'Spoznaj varovné signály a rozhodni sa správne v nečakanej situácii.', detail: 'Varovanie, privolanie pomoci, bezpečná evakuácia a pripravenosť na mimoriadne udalosti.' },
    orientation: { title: 'Orientácia v prírode', art: 'compass', color: '#f1ede3', tag: 'NÁJDI SVOJ SMER.', description: 'Čítaj mapu, objav svetové strany a nájdi bezpečnú cestu.', detail: 'Od orientácie v okolí školy cez svetové strany až po mierku mapy, azimut a plánovanie túry.' },
    aid: { title: 'Prvá pomoc', art: 'aid', color: '#f4eae3', tag: 'AJ TY DOKÁŽEŠ POMÔCŤ.', description: 'Zisti, ako privolať pomoc a čo urobiť, keď ju niekto potrebuje.', detail: 'Bezpečnosť pomocníka, privolanie dospelého a záchranárov, ošetrenie poranení a základy prvej pomoci primerané veku.' },
    nature: { title: 'Ochrana prírody', art: 'nature', color: '#eaf0df', tag: 'ZANECHAJ DOBRÚ STOPU.', description: 'Chráň svet okolo seba. Začni malými rozhodnutiami každý deň.', detail: 'Ohľaduplný pobyt vonku, odpad, ochrana rastlín a živočíchov, voda, ekosystémy a zodpovedná spotreba.' }
  };
  const grades = {
    1: { title: 'Prvé kroky k bezpečiu', description: 'Spoznaj pomocníkov, okolie školy a jednoduché pravidlá, ktoré chránia teba aj prírodu.', curriculum: 'Poplach a dospelý pomocník; lekárnička a odreniny; okolie školy; ohľaduplnosť k prírode.' },
    2: { title: 'Všímam si svet okolo seba', description: 'Rozpoznaj nebezpečenstvo, drž sa bezpečnej cesty a zisti, ako si chrániť zdravie.', curriculum: 'Požiar a elektrina; prevencia ochorení a uštipnutia; turistické značky; voda a neznáme rastliny.' },
    3: { title: 'Viem sa správne rozhodnúť', description: 'Zorientuj sa podľa svetových strán, privolaj pomoc a objav, prečo príroda potrebuje ochranu.', curriculum: 'Mimoriadne udalosti; hygiena a jednoduché krytie rán; svetové strany a terén; chránené územia.' },
    4: { title: 'Pripravený na nové situácie', description: 'Nauč sa čítať mapu, rozpoznať riziká a vybrať správny postup pri bežných poraneniach.', curriculum: 'Nebezpečné látky a ochrana; zdravie a obväzy; mapové značky a výšky; vzduch, voda a bezpečný pobyt.' },
    5: { title: 'Rozhliadni sa. Rozhodni sa.', description: 'Varovné signály, bezpečný pobyt v prírode a základy pomoci. Už vieš viac — teraz to spoj do súvislostí.', curriculum: 'Signály, evakuácia a ukrytie; poranenia končatín a bezvedomie; mapa a kompas; pravidlá ochrany prírody.' },
    6: { title: 'Istota v každom kroku', description: 'Vyskúšaj mierku mapy a azimut, premysli si ochranu pred požiarom a precvič ošetrenie poranení.', curriculum: 'Požiar a chemické riziká; obväzy a poranenia kĺbov; mierka, azimut a búrka; zdroje a ekosystémy.' },
    7: { title: 'Pomoc začína dobrým rozhodnutím', description: 'Naplánuj túru, rozpoznaj vážny stav a zisti, ako koordinovať pomoc aj chrániť svoje okolie.', curriculum: 'Ochrana zásob, očista a úkryty; krvácanie a KPR dospelého; plán túry a vodné prekážky; vplyv človeka.' },
    8: { title: 'Rozvaha aj v náročnej chvíli', description: 'Rieš zložitejšie situácie: od mimoriadnych udalostí cez AED až po orientáciu v teréne.', curriculum: 'Chemické a radiačné udalosti; AED, popáleniny a ďalšie náhle stavy; azimutová trasa; obnova prostredia.' },
    9: { title: 'Pripravenosť pre skutočný život', description: 'Spoj vedomosti do praxe. Vyhodnoť riziká, rozdeľ úlohy a vyber riešenie, ktoré dáva zmysel.', curriculum: 'Miestne riziká a úlohy CO; komplexné situácie prvej pomoci; samostatné plánovanie; udržateľnosť a overovanie údajov.' }
  };
  const artCrops = {
    aid: [18, 15, 255, 260], compass: [390, 5, 173, 200], rescue: [44, 316, 210, 172],
    ambulance: [295, 291, 249, 157], cpr: [17, 532, 250, 200], nature: [298, 489, 246, 242]
  };
  const artLabels = { aid: 'Ilustrácia ošetrenia zraneného spolužiaka', compass: 'Ilustrácia kompasu', rescue: 'Ilustrácia zdravotníčky, záchranára a hasiča', ambulance: 'Ilustrácia sanitky', cpr: 'Ilustrácia nácviku resuscitácie na figuríne', nature: 'Ilustrácia planéty, rastlín, vody a recyklácie' };
  function art(name) {
    return `<svg class="illustration" viewBox="${artCrops[name].join(' ')}" role="img" aria-label="${artLabels[name]}"><image href="assets/ilustracie.jpeg" x="0" y="0" width="567" height="735"/></svg>`;
  }
  function mapArt() {
    return `<svg class="visual-map" viewBox="0 0 310 260" role="img" aria-label="Schematická mapa: sever je hore. Škola v strede, stan severne, les východne, rieka južne od školy.">
      <rect width="310" height="260" rx="14" fill="#f5f3e8"/>
      <path d="M0 60Q80 10 155 60T310 48M0 105Q90 65 150 107T310 89M0 164Q90 120 180 162T310 151" fill="none" stroke="#e1e5d0" stroke-width="1.5"/>
      <path d="M148 63V152H252M148 150V211" stroke="#b49c76" stroke-width="5" stroke-dasharray="5 6" fill="none"/>
      <path d="M0 221Q50 201 96 219T183 218T310 221" fill="none" stroke="#9bc5cb" stroke-width="17"/>
      <path d="M128 202H165V235H128Z" fill="#b79e79" stroke="#967d59" stroke-width="2"/>
      <path d="M121 55 147 18 173 55Z" fill="#c3a465" stroke="#8c7852" stroke-width="2"/><path d="m147 29-10 26h21Z" fill="#6f7459"/>
      <text x="147" y="75" text-anchor="middle" fill="#54624b" font-size="12">STAN</text>
      <path d="M120 130h52v34h-52z" fill="#e4d4b3" stroke="#967d59" stroke-width="2"/><path d="m114 132 32-27 33 27" fill="#bb795f" stroke="#916749" stroke-width="2"/>
      <path d="M139 164v-18h14v18" fill="#788777"/><path d="M127 139h7v8h-7M159 139h7v8h-7" fill="#a2b5b3"/>
      <text x="147" y="184" text-anchor="middle" fill="#54624b" font-size="12">ŠKOLA</text>
      <g fill="#80986c" stroke="#547451" stroke-width="1.5"><path d="m224 130 12-26 12 26h-8v13h-8v-13z"/><path d="m250 145 13-32 13 32h-9v14h-8v-14z"/><path d="m271 125 12-28 12 28h-8v15h-8v-15z"/></g>
      <text x="261" y="180" text-anchor="middle" fill="#54624b" font-size="12">LES</text>
      <text x="61" y="246" text-anchor="middle" fill="#547d85" font-size="12">RIEKA</text>
      <path d="M38 72V33m-7 10 7-12 7 12" stroke="#426253" stroke-width="2" fill="none"/><text x="38" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="#426253">S</text>
    </svg>`;
  }
  function readStorage(key, fallback) {
    try { const data = localStorage.getItem(`pripraveni-v1-${key}`); return data === null ? fallback : JSON.parse(data); } catch { return fallback; }
  }
  function saveStorage(key, value) { try { localStorage.setItem(`pripraveni-v1-${key}`, JSON.stringify(value)); } catch { /* Play remains available without storage. */ } }
  let selectedGrade = Number(readStorage('grade', 5));
  if (!grades[selectedGrade]) selectedGrade = 5;
  const previousByGrade = {};
  const bestByGrade = {};
  for (let grade = 1; grade <= 9; grade++) {
    const previous = readStorage(`previous-${grade}`, []);
    previousByGrade[grade] = Array.isArray(previous) ? previous.filter(id => typeof id === 'string') : [];
    const best = readStorage(`best-${grade}`, null);
    bestByGrade[grade] = Number.isInteger(best) && best >= 0 && best <= 12 ? best : null;
  }
  let view = 'home', session = [], questionIndex = 0, history = [], answered = false, missedOnly = false;
  const dialog = $('info-dialog');
  document.querySelectorAll('[data-art]').forEach(el => { el.innerHTML = art(el.dataset.art); });
  $('grade-buttons').innerHTML = Object.keys(grades).map(grade => `<button class="grade-button" data-grade="${grade}" aria-label="${grade}. ročník" aria-pressed="false">${grade}</button>`).join('');
  $('grade-buttons').addEventListener('click', event => {
    const button = event.target.closest('[data-grade]');
    if (button) selectGrade(Number(button.dataset.grade));
  });
  function selectGrade(grade) {
    selectedGrade = grade; saveStorage('grade', grade);
    document.querySelectorAll('[data-grade]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.grade) === grade)));
    $('grade-label').textContent = `${grade}. ročník · ${grade <= 4 ? '1.' : '2.'} stupeň`;
    $('grade-title').textContent = grades[grade].title;
    $('grade-description').textContent = grades[grade].description;
    $('grade-seal').textContent = String(grade).padStart(2, '0');
    $('start-caption').textContent = `${grade}. ročník · približne 5 – 8 minút`;
    $('start-button').setAttribute('aria-label', `Spustiť výzvu pre ${grade}. ročník`);
    $('best-score').textContent = bestByGrade[grade] === null ? '' : `Tvoje najlepšie skóre: ${bestByGrade[grade]} / 12`;
  }
  selectGrade(selectedGrade);
  $('topic-grid').innerHTML = Object.entries(topics).map(([id, topic], index) => `<button class="topic-card" data-topic="${id}" style="--topic-bg:${topic.color}" aria-label="Viac o téme ${topic.title}"><div class="topic-visual"><span class="topic-number">0${index + 1}</span>${art(topic.art)}</div><div class="topic-card-content"><h3>${topic.title}<span aria-hidden="true">↗</span></h3><p>${topic.description}</p><span class="topic-tag">${topic.tag}</span></div></button>`).join('');
  $('topic-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    const topic = topics[button.dataset.topic];
    openDialog(`<div class="dialog-art">${art(topic.art)}</div><h2 id="dialog-title">${topic.title}</h2><p>${topic.detail}</p><h3>V tvojej výzve</h3><p>Pri každom hraní dostaneš 3 otázky z tejto oblasti. Otázky aj ich náročnosť sa prispôsobia vybranému ročníku.</p><h3>${selectedGrade}. ročník: ${grades[selectedGrade].title}</h3><p>${grades[selectedGrade].description}</p>`);
  });
  function showView(next) {
    view = next;
    for (const name of ['home', 'quiz', 'results']) $(`${name}-view`).hidden = name !== next;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function startQuiz() {
    session = QuizEngine.makeQuiz(QUESTION_BANK, selectedGrade, previousByGrade[selectedGrade]);
    previousByGrade[selectedGrade] = session.map(q => q.id);
    saveStorage(`previous-${selectedGrade}`, previousByGrade[selectedGrade]);
    questionIndex = 0; history = []; answered = false; missedOnly = false;
    showView('quiz'); renderQuestion();
  }
  $('start-button').addEventListener('click', startQuiz);
  function renderQuestion() {
    answered = false;
    const q = session[questionIndex], topic = topics[q.topic];
    const score = history.filter(item => item.correct).length;
    const illustration = q.visual === 'map' ? mapArt() : art(q.topic === 'aid' && selectedGrade >= 7 ? 'cpr' : topic.art);
    $('quiz-view').innerHTML = `<div class="quiz-shell"><div class="quiz-topbar"><button class="back-button" id="quit-quiz">← Späť na úvod</button><span class="quiz-grade">${selectedGrade}. ročník <span aria-hidden="true">·</span> ${grades[selectedGrade].title}</span></div>
      <div class="progress-meta"><span>Otázka <strong>${questionIndex + 1}</strong> z ${session.length}</span><span><strong>${score}</strong> správne ${score === 1 ? 'rozhodnutie' : 'rozhodnutia'}</span></div><div class="progress-track" role="progressbar" aria-label="Zodpovedané otázky" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${history.length}"><div class="progress-fill" style="width:${history.length / session.length * 100}%"></div></div>
      <div class="question-layout"><div class="question-content"><span class="question-topic" style="--topic-bg:${topic.color}"><span aria-hidden="true">◇</span> ${topic.title}</span><p class="question-number">ROZHODNUTIE ${String(questionIndex + 1).padStart(2, '0')}</p><h1 class="question-title" id="question-heading" tabindex="-1">${escape(q.question)}</h1><p class="answer-hint">Vyber jednu odpoveď. Pokojne si to premysli.</p><div class="answers" role="group" aria-labelledby="question-heading">${q.answers.map((answer, i) => `<button class="answer" data-answer="${i}"><span class="answer-letter" aria-hidden="true">${'ABC'[i]}</span><span>${escape(answer.text)}</span></button>`).join('')}</div><div id="feedback-area" aria-live="polite" aria-atomic="true"></div></div><aside class="question-aside" style="--topic-bg:${topic.color}">${illustration}<div><p class="eyebrow">${q.visual === 'map' ? 'POZRI SA NA MAPU' : topic.tag}</p><p>${q.visual === 'map' ? 'S označuje sever. Sleduj polohu jednotlivých miest.' : 'Vedomosti z hry využiješ aj mimo nej.'}</p></div></aside></div><div class="quiz-bottom"><span>Každá otázka je krok k väčšej pripravenosti.</span><span>Bez časového limitu <span aria-hidden="true">◷</span></span></div></div>`;
    $('quit-quiz').addEventListener('click', requestHome);
    $('quiz-view').querySelector('.answers').addEventListener('click', event => {
      const button = event.target.closest('[data-answer]');
      if (button) answerQuestion(Number(button.dataset.answer));
    });
    $('question-heading').focus({ preventScroll: true });
  }
  function answerQuestion(index) {
    if (view !== 'quiz' || answered || !session[questionIndex]?.answers[index]) return;
    answered = true;
    const q = session[questionIndex], chosen = q.answers[index];
    history.push({ question: q, chosen: chosen.text, correct: chosen.correct });
    $('quiz-view').querySelectorAll('[data-answer]').forEach(button => {
      const i = Number(button.dataset.answer), answer = q.answers[i];
      button.disabled = true;
      if (answer.correct) {
        button.classList.add('correct'); button.querySelector('.answer-letter').textContent = '✓';
        button.insertAdjacentHTML('beforeend', '<span class="answer-status">Správne</span>');
      } else if (i === index) {
        button.classList.add('wrong'); button.querySelector('.answer-letter').textContent = '×';
        button.insertAdjacentHTML('beforeend', '<span class="answer-status">Tvoja voľba</span>');
      } else button.classList.add('dimmed');
    });
    const score = history.filter(item => item.correct).length;
    $('quiz-view').querySelector('.progress-meta').lastElementChild.innerHTML = `<strong>${score}</strong> správne ${score === 1 ? 'rozhodnutie' : 'rozhodnutia'}`;
    $('quiz-view').querySelector('.progress-track').setAttribute('aria-valuenow', String(history.length));
    $('quiz-view').querySelector('.progress-fill').style.width = `${history.length / session.length * 100}%`;
    $('feedback-area').innerHTML = `<div class="feedback ${chosen.correct ? '' : 'is-wrong'}"><h3>${chosen.correct ? 'Správne rozhodnutie!' : 'Aj takto sa učíme.'}</h3><p>${escape(q.explanation)}</p></div><div class="feedback-actions"><span class="keyboard-hint">Odpovede: 1 / 2 / 3 · pokračovať: Enter</span><button class="primary-button" id="next-question">${questionIndex === session.length - 1 ? 'Pozrieť výsledok' : 'Ďalšia otázka'} <span aria-hidden="true">→</span></button></div>`;
    $('next-question').addEventListener('click', nextQuestion);
    $('next-question').focus({ preventScroll: true });
  }
  function nextQuestion() {
    if (!answered || view !== 'quiz') return;
    if (questionIndex === session.length - 1) { finishQuiz(); return; }
    questionIndex++; renderQuestion();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function finishQuiz() {
    const score = history.filter(item => item.correct).length;
    const oldBest = bestByGrade[selectedGrade];
    bestByGrade[selectedGrade] = Math.max(score, oldBest ?? 0);
    saveStorage(`best-${selectedGrade}`, bestByGrade[selectedGrade]);
    const title = score >= 10 ? 'Pripravenosť ti pristane.' : score >= 7 ? 'Dobrý smer. Pokračuj ďalej.' : 'Každý krok sa počíta.';
    const description = score >= 10 ? 'V náročných situáciách sa vieš dobre rozhodnúť. Zvedavosť si nechaj — ďalšia výzva prinesie nové otázky.' : score >= 7 ? 'Máš na čom stavať. Pozri si vysvetlenia a pri ďalšej výzve premeň nové poznatky na správne rozhodnutia.' : 'Práve si sa naučil niečo nové. Prejdi si odpovede vlastným tempom a potom si skús ďalšiu výzvu.';
    showView('results');
    $('results-view').innerHTML = `<div class="results-wrap"><section class="result-hero"><p class="eyebrow">VÝZVA DOKONČENÁ · ${selectedGrade}. ROČNÍK</p><div class="result-circle" style="--score:${score / 12 * 100}%" aria-label="${score} správnych odpovedí z 12"><span>${score}<small> / 12</small></span></div><h1 id="results-heading" tabindex="-1">${title}</h1><p>${description}</p><p>${oldBest === null ? 'Tvoja prvá dokončená výzva v tomto ročníku.' : score > oldBest ? 'Nové osobné maximum v tomto ročníku!' : `Tvoje najlepšie skóre v tomto ročníku: ${bestByGrade[selectedGrade]} / 12.`}</p><div class="result-actions"><button class="primary-button" id="play-again">Nová výzva <span aria-hidden="true">↻</span></button><button class="secondary-button" id="change-grade">Vybrať iný ročník</button></div></section><div class="result-topics">${Object.entries(topics).map(([id, topic]) => {
      const correct = history.filter(item => item.question.topic === id && item.correct).length;
      return `<div class="result-topic">${topic.title}<strong>${correct} <small>/ 3</small></strong><div class="result-topic-track"><span style="width:${correct / 3 * 100}%"></span></div></div>`;
    }).join('')}</div><div class="review-heading"><h2>Tvoje rozhodnutia pod lupou.</h2><button class="review-toggle" id="review-toggle" aria-pressed="false">Len na zopakovanie</button></div><p class="answer-hint">Rozklikni otázku a pripomeň si vysvetlenie.</p><div id="review-list"></div></div>`;
    renderReview();
    $('play-again').addEventListener('click', startQuiz);
    $('change-grade').addEventListener('click', () => goHome('choose-grade'));
    $('review-toggle').addEventListener('click', () => { missedOnly = !missedOnly; $('review-toggle').setAttribute('aria-pressed', String(missedOnly)); renderReview(); });
    $('results-heading').focus({ preventScroll: true });
  }
  function renderReview() {
    const visible = history.map((item, index) => ({ ...item, index })).filter(item => !missedOnly || !item.correct);
    $('review-list').innerHTML = visible.length ? visible.map(item => `<details class="review-item"><summary><span class="review-icon ${item.correct ? '' : 'missed'}" aria-label="${item.correct ? 'Správne' : 'Na zopakovanie'}">${item.correct ? '✓' : '↻'}</span><span>${item.index + 1}. ${escape(item.question.question)}</span></summary>${item.correct ? '' : `<p>Tvoja odpoveď: ${escape(item.chosen)}</p>`}<p class="review-answer"><strong>Správna odpoveď:</strong> ${escape(item.question.answers.find(answer => answer.correct).text)}</p><p>${escape(item.question.explanation)}</p></details>`).join('') : '<p class="empty-review">V tejto výzve si odpovedal správne na všetky otázky. Výborne!</p>';
  }
  function goHome(anchor) {
    showView('home'); selectGrade(selectedGrade);
    if (anchor) $(anchor).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function requestHome(anchor) {
    // Event listeners may pass an Event instead of an anchor name.
    const target = typeof anchor === 'string' ? anchor : null;
    if (view !== 'quiz') { goHome(target); return; }
    openDialog('<h2 id="dialog-title">Odísť z tejto výzvy?</h2><p>Rozpracovaná výzva sa ukončí. Doterajšie odpovede sa nezapočítajú do najlepšieho výsledku.</p><div class="confirm-actions"><button class="primary-button" id="stay-quiz">Pokračovať v hre</button><button class="secondary-button" id="leave-quiz">Ukončiť výzvu</button></div>');
    $('stay-quiz').addEventListener('click', () => dialog.close());
    $('leave-quiz').addEventListener('click', () => { dialog.close(); goHome(target); });
    $('stay-quiz').focus();
  }
  $('brand').addEventListener('click', event => { event.preventDefault(); requestHome(); });
  $('topics-link').addEventListener('click', () => requestHome('topics'));
  function openDialog(content) {
    $('dialog-content').innerHTML = content;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }
  $('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  const sourceLinks = [
    ['ŠPÚ: Ochrana života a zdravia — 1. až 4. ročník (ISCED 1, 2009)', 'https://www.statpedu.sk/files/articles/dokumenty/statny-vzdelavaci-program/ochrana_zivota_a_zdravia_isced1.doc.pdf'],
    ['ŠPÚ: Ochrana života a zdravia — 5. až 9. ročník (ISCED 2, 2009)', 'https://www.statpedu.sk/files/articles/dokumenty/statny-vzdelavaci-program/ochrana_zivota_a_zdravia_isced2.doc.pdf'],
    ['ŠPÚ: Environmentálna výchova', 'https://www.statpedu.sk/sk/svp/statny-vzdelavaci-program/svp-prvy-stupen-zs/prierezove-temy/environmentalna-vychova/'],
    ['Ministerstvo školstva: ŠVP pre základné vzdelávanie, konsolidované znenie 2026', 'https://www.minedu.sk/data/att/2a5/36402.149441.pdf'],
    ['Ministerstvo vnútra SR: tiesňové volanie a informácie pre verejnosť', 'https://www.minv.sk/swift_data/source/miestna_statna_sprava/okres_kosice/o04_okr/dokumentynastiahnutie/informacie_preverejnost/OKR_OUKE_InformaciePreVerejnost.pdf'],
    ['Ministerstvo vnútra SR: varovné signály', 'https://www.minv.sk/swift_data/source/miestna_statna_sprava/ou_skalica/odbor_krizoveho_riadenia/Informacia%20pre%20verejnost%20chemicke%20latky..pdf'],
    ['Resuscitation Council UK: resuscitácia dospelých, odporúčania 2025', 'https://www.resus.org.uk/cy/node/36437'],
    ['IFRC: medzinárodné odporúčania prvej pomoci 2025', 'https://www.ifrc.org/sites/default/files/2026-03/IFRC%20International%20First%20Aid%2C%20Resuscitation%20and%20Education%20Guidelines%202025.pdf'],
    ['British Red Cross: prvá pomoc pre deti', 'https://www.redcross.org.uk/first-aid/learn-first-aid-for-babies-and-children'],
    ['Horská záchranná služba: plánovanie a bezpečnosť túry', 'https://hzs.sk/upozornenie-pre-turistov-pred-letnou-turistickou-sezonou/'],
    ['Štátna ochrana prírody SR: prevencia a správanie v prírode', 'https://zasahovytim.sopsr.sk/prevencia/'],
    ['Úrad jadrového dozoru SR: ochranné opatrenia', 'https://www.ujd.gov.sk/cinnosti/havarijna-pripravenost/havarijne-planovanie/opatrenia-v-pripade-udalosti/'],
    ['ICRC: medzinárodný znak civilnej ochrany', 'https://ihl-databases.icrc.org/en/ihl-treaties/api-annex-i-1977/article-15']
  ];
  document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.modal === 'about') {
      openDialog('<h2 id="dialog-title">Malá výzva. Užitočné vedomosti.</h2><ol><li>Vyber si ročník od 1. po 9.</li><li>Odpovedz na 12 otázok — po 3 z každej zo štyroch oblastí.</li><li>Po každej odpovedi si prečítaj vysvetlenie. Nemusíš sa ponáhľať.</li><li>Na konci si pozri výsledok a otázky, ku ktorým sa chceš vrátiť.</li><li>Spusti novú výzvu. Vyberieme ďalšie otázky a premiešame odpovede.</li></ol><h3>Učenie vlastným tempom</h3><p>Za správnu odpoveď získaš bod. Rýchlosť nehodnotíme a za chyby body neodoberáme. Pri prvákoch môže zadanie prečítať dospelý.</p><h3>Ovládanie</h3><p>Klikni na odpoveď alebo použi klávesy 1, 2, 3 či A, B, C. Klávesom Tab prechádzaš ovládacie prvky. Po odpovedi pokračuj tlačidlom alebo klávesom Enter. Okno zavrieš klávesom Escape.</p><h3>Tvoj pokrok</h3><p>Najlepší výsledok a posledný výber otázok sa ukladajú iba v tomto prehliadači, ak ukladanie povoľuje. Účet ani internet na hranie nepotrebuješ. Ak je ukladanie blokované, hra funguje ďalej; po zatvorení si však pokrok nemusí pamätať.</p>');
    } else {
      openDialog(`<h2 id="dialog-title">Pre učiteľov a zvedavých</h2><p>Hra obsahuje 360 autorských otázok: 40 na ročník, po 10 z každej oblasti. Jedna výzva vyberie 12 otázok, po 3 z každej oblasti. Poradie otázok aj odpovedí sa mieša nezávisle. Nasledujúca výzva v tom istom ročníku nepoužije otázky z predchádzajúcej.</p><h3>Ako sú prispôsobené ročníky</h3><p>Podkladom sú ročníkové okruhy Ochrany života a zdravia ISCED 1 a 2 a environmentálna výchova. Ide o didaktické prispôsobenie pre túto hru, nie o oficiálne overenie splnenia ŠVP. Nový ŠVP pracuje s cyklami a zavádza sa postupne od prvákov; konkrétne zaradenie učiva určuje školský vzdelávací program.</p><table class="curriculum-table"><thead><tr><th scope="col">Ročník</th><th scope="col">Zameranie otázok</th></tr></thead><tbody>${Object.entries(grades).map(([grade, info]) => `<tr><th scope="row">${grade}.</th><td>${info.curriculum}</td></tr>`).join('')}</tbody></table><h3>Praktická výučba</h3><p>Kvíz podporuje porozumenie, nenahrádza praktický nácvik prvej pomoci s kvalifikovaným lektorom. Číselné otázky o KPR sa výslovne týkajú dospelého. Pri skutočnej udalosti voláme slovenské linky 155 alebo 112 a riadime sa operátorom. Britské telefónne čísla zo zdrojov nie sú prenesené do hry.</p><h3>Zdroje</h3><p>Podklady overené pri tvorbe 17. 9. 2026. Staršie kurikulárne dokumenty určujú tematické zameranie; postupy prvej pomoci vychádzajú z novších odborných odporúčaní.</p><ul class="source-list">${sourceLinks.map(([title, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${title} ↗</a></li>`).join('')}</ul><h3>Obrázky a súkromie</h3><p>Ilustrácie pochádzajú z obrázka dodaného k projektu. Hra načítava všetky svoje súbory lokálne a nepoužíva analytiku, reklamy ani externé fonty. Externé odkazy sa otvárajú len po kliknutí.</p>`);
    }
  }));
  document.addEventListener('keydown', event => {
    if (view !== 'quiz' || dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    const answerKey = { '1': 0, '2': 1, '3': 2, a: 0, b: 1, c: 2 }[event.key.toLowerCase()];
    if (!answered && answerKey !== undefined) { event.preventDefault(); answerQuestion(answerKey); }
    else if (answered && event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') { event.preventDefault(); nextQuestion(); }
  });
})();
