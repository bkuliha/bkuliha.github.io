const toolboxDefinition = [
  {
    group: "Zaklad",
    blocks: [
      {
        kind: "start",
        label: "START",
        hint: "Spusti program. Dobry zaciatok kazdej ulohy."
      }
    ]
  },
  {
    group: "Pohyb",
    blocks: [
      {
        kind: "forward",
        label: "Chod rovno",
        hint: "Dash sa pohne dopredu o zvoleny pocet krokov."
      },
      {
        kind: "backward",
        label: "Chod spat",
        hint: "Dash sa pohne dozadu bez toho, aby sa otocil."
      },
      {
        kind: "turn-left",
        label: "Otoc sa vlavo",
        hint: "Otoci sa vlavo o 90, 180 alebo 270 stupnov."
      },
      {
        kind: "turn-right",
        label: "Otoc sa vpravo",
        hint: "Otoci sa vpravo o 90, 180 alebo 270 stupnov."
      }
    ]
  },
  {
    group: "Logika",
    blocks: [
      {
        kind: "speed",
        label: "Nastav rychlost",
        hint: "Pomaly, stredne alebo rychlo."
      },
      {
        kind: "if-obstacle",
        label: "Ak prekazka",
        hint: "Ak je pred Dashom prekazka, vie sa otocit."
      },
      {
        kind: "if-clear",
        label: "Ak cesta volna",
        hint: "Pohne sa iba vtedy, ked pred nim nic nie je."
      },
      {
        kind: "repeat-times",
        label: "Repeat x krat",
        hint: "Opakuje nasledujuci blok zvoleny pocet krat."
      },
      {
        kind: "repeat-until",
        label: "Repeat until",
        hint: "Opakuje nasledujuci blok, kym sa nesplni podmienka."
      }
    ]
  },
  {
    group: "Efekty",
    blocks: [
      {
        kind: "beep",
        label: "Zapipaj",
        hint: "Kratky zvukovy signal."
      },
      {
        kind: "light",
        label: "Zasviet",
        hint: "Rozsvieti farebne svetlo."
      },
      {
        kind: "say",
        label: "Povedz text",
        hint: "Zobrazi bublinu s textom."
      },
      {
        kind: "wait",
        label: "Pockaj",
        hint: "Kratka pauza v programe."
      }
    ]
  }
];

const levels = [
  {
    title: "Uloha 1: Priama cesta",
    text:
      "Dash startuje dolava od ciela a pozera doprava. Poskladaj jednoduchy program, aby prisiel na oranzovu hviezdu.",
    hint: "Skus START a potom pohyb dopredu.",
    cols: 6,
    rows: 5,
    start: { x: 0, y: 4 },
    direction: "E",
    goal: { x: 4, y: 4 },
    obstacles: [
      { x: 2, y: 2 },
      { x: 4, y: 1 }
    ]
  },
  {
    title: "Uloha 2: Roh pri kuzeliach",
    text:
      "Do ciela sa da dostat iba cez otocenie v lavom rohu mapy. Naprogramuj Dashovi zatacku okolo prekazok.",
    hint: "Najprv chod dopredu, potom otoc, prejdi hore a znova otoc.",
    cols: 7,
    rows: 6,
    start: { x: 0, y: 5 },
    direction: "E",
    goal: { x: 5, y: 2 },
    obstacles: [
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 1, y: 1 }
    ]
  },
  {
    title: "Uloha 3: Senzor prekazky",
    text:
      "Pred Dashom je hned stena. Vyuzij blok ak prekazka, aby sa Dash vedel sam otocit a pokracovat dalej.",
    hint: "Ak je pred Dashom prekazka, nech sa najprv otoci vlavo.",
    cols: 6,
    rows: 6,
    start: { x: 1, y: 4 },
    direction: "E",
    goal: { x: 4, y: 1 },
    obstacles: [
      { x: 2, y: 4 },
      { x: 4, y: 4 }
    ]
  },
  {
    title: "Uloha 4: Rychla dorucovacia misia",
    text:
      "Dash potrebuje presviest dlhou trasou. Vyskusaj mu nastavit rychlost a dovez ho k cielu cez dlhu zatacku.",
    hint: "Po dvoch krokoch dopredu sa otoc hore a potom znova doprava.",
    cols: 7,
    rows: 7,
    start: { x: 0, y: 6 },
    direction: "E",
    goal: { x: 6, y: 2 },
    obstacles: [
      { x: 3, y: 6 },
      { x: 3, y: 5 },
      { x: 3, y: 4 }
    ]
  },
  {
    title: "Uloha 5: Cuvanie do garaze",
    text:
      "Dash stoji pred uzkou garazou. Vpredu a po bokoch je tesno, preto sa musi dostat do ciela pomocou cuvania.",
    hint: "Vyskusaj blok chod spat. Dash sa nemusi otocit.",
    cols: 6,
    rows: 6,
    start: { x: 3, y: 1 },
    direction: "N",
    goal: { x: 3, y: 4 },
    obstacles: [
      { x: 3, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 1 }
    ]
  }
];

const directionOrder = ["N", "E", "S", "W"];
const directionVectors = {
  N: { x: 0, y: -1, angle: -90, label: "hore" },
  E: { x: 1, y: 0, angle: 0, label: "vpravo" },
  S: { x: 0, y: 1, angle: 90, label: "dole" },
  W: { x: -1, y: 0, angle: 180, label: "vlavo" }
};
const speedProfiles = {
  slow: { label: "pomaly", move: 760, turn: 520, pause: 480 },
  medium: { label: "stredne", move: 460, turn: 320, pause: 320 },
  fast: { label: "rychlo", move: 250, turn: 190, pause: 180 }
};
const lightPalette = {
  yellow: { label: "zlto", color: "#ffd24d" },
  green: { label: "zeleno", color: "#5ad881" },
  blue: { label: "modro", color: "#65caff" },
  pink: { label: "ruzovo", color: "#ff91cf" }
};

const appState = {
  levelIndex: 0,
  workspace: [],
  running: false,
  currentBlockId: null,
  logs: [],
  runtime: null,
  nextId: 1
};

const elements = {
  toolGroups: document.getElementById("toolGroups"),
  workspaceList: document.getElementById("workspaceList"),
  programMeta: document.getElementById("programMeta"),
  levelBadge: document.getElementById("levelBadge"),
  directionBadge: document.getElementById("directionBadge"),
  speedBadge: document.getElementById("speedBadge"),
  missionTitle: document.getElementById("missionTitle"),
  missionText: document.getElementById("missionText"),
  feedback: document.getElementById("feedback"),
  runButton: document.getElementById("runButton"),
  clearButton: document.getElementById("clearButton"),
  nextLevelButton: document.getElementById("nextLevelButton"),
  logList: document.getElementById("logList"),
  boardWrap: document.getElementById("boardWrap"),
  boardCanvas: document.getElementById("boardCanvas")
};

let audioContext;

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function obstacleKey(x, y) {
  return `${x},${y}`;
}

function getCurrentLevel() {
  return levels[appState.levelIndex];
}

function createBlock(kind) {
  const id = appState.nextId++;

  switch (kind) {
    case "start":
      return { id, kind };
    case "forward":
      return { id, kind, steps: 2 };
    case "backward":
      return { id, kind, steps: 1 };
    case "turn-left":
    case "turn-right":
      return { id, kind, degrees: 90 };
    case "speed":
      return { id, kind, speed: "medium" };
    case "if-obstacle":
      return { id, kind, turn: "left" };
    case "if-clear":
      return { id, kind, steps: 1 };
    case "repeat-times":
      return { id, kind, count: 3 };
    case "repeat-until":
      return { id, kind, condition: "goal" };
    case "beep":
      return { id, kind };
    case "light":
      return { id, kind, color: "yellow" };
    case "say":
      return { id, kind, text: "Idem!" };
    case "wait":
      return { id, kind, beats: 1 };
    default:
      throw new Error(`Neznamy blok: ${kind}`);
  }
}

function getBlockHeading(block) {
  switch (block.kind) {
    case "start":
      return "START";
    case "forward":
      return "Chod rovno";
    case "backward":
      return "Chod spat";
    case "turn-left":
      return "Otoc sa vlavo";
    case "turn-right":
      return "Otoc sa vpravo";
    case "speed":
      return "Nastav rychlost";
    case "if-obstacle":
      return "Ak prekazka";
    case "if-clear":
      return "Ak cesta volna";
    case "repeat-times":
      return "Repeat x krat";
    case "repeat-until":
      return "Repeat until";
    case "beep":
      return "Zapipaj";
    case "light":
      return "Zasviet";
    case "say":
      return "Povedz";
    case "wait":
      return "Pockaj";
    default:
      return block.kind;
  }
}

function getBlockCaption(block) {
  switch (block.kind) {
    case "start":
      return "Spusti pripraveny program.";
    case "forward":
      return `Dash sa pohne dopredu o ${block.steps} ${block.steps === 1 ? "krok" : "kroky"}.`;
    case "backward":
      return `Dash sa pohne dozadu o ${block.steps} ${block.steps === 1 ? "krok" : "kroky"}.`;
    case "turn-left":
      return `Otoci sa vlavo o ${block.degrees} stupnov.`;
    case "turn-right":
      return `Otoci sa vpravo o ${block.degrees} stupnov.`;
    case "speed":
      return `Dalsie pohyby pojdu ${speedProfiles[block.speed].label}.`;
    case "if-obstacle":
      return `Ak je vpredu prekazka, Dash sa otoci ${block.turn === "left" ? "vlavo" : "vpravo"}.`;
    case "if-clear":
      return `Ak je cesta volna, Dash pojde o ${block.steps} ${block.steps === 1 ? "krok" : "kroky"}.`;
    case "repeat-times":
      return `Zopakuje nasledujuci blok ${block.count} krat.`;
    case "repeat-until":
      return `Opakuje nasledujuci blok, kym plati: ${getUntilLabel(block.condition)}.`;
    case "beep":
      return "Dash vyda kratky signal.";
    case "light":
      return `Dash zasvieti na ${lightPalette[block.color].label}.`;
    case "say":
      return `Dash povie: "${escapeHtml(block.text || "...")}"`;
    case "wait":
      return `Program pocka ${block.beats} ${block.beats === 1 ? "dobu" : "doby"}.`;
    default:
      return "";
  }
}

function resetRuntime() {
  const level = getCurrentLevel();

  appState.runtime = {
    robot: {
      x: level.start.x,
      y: level.start.y,
      renderX: level.start.x,
      renderY: level.start.y,
      direction: level.direction,
      angle: directionVectors[level.direction].angle
    },
    trail: [{ x: level.start.x, y: level.start.y }],
    speed: "medium",
    speech: "",
    speechUntil: 0,
    lightColor: null,
    lightUntil: 0,
    flash: null,
    goalVisited: false,
    actionAtGoal: false,
    statusText: "Dash caka na start."
  };

  updateStatusBadges();
  renderBoard();
}

function loadLevel(index) {
  appState.levelIndex = (index + levels.length) % levels.length;
  appState.workspace = [];
  appState.currentBlockId = null;
  appState.logs = [];
  resetRuntime();
  renderMission();
  renderWorkspace();
  addLog(`Nova uloha pripravljena. ${getCurrentLevel().hint}`, "info");
  setFeedback("Poskladaj program a stlac Spustit program.", "info");
}

function renderMission() {
  const level = getCurrentLevel();
  elements.levelBadge.textContent = `Uloha ${appState.levelIndex + 1}`;
  elements.missionTitle.textContent = level.title;
  elements.missionText.textContent = `${level.text} Pomocka: ${level.hint}`;
  elements.boardWrap.style.setProperty("--board-ratio", `${level.cols} / ${level.rows}`);
  updateStatusBadges();
  resizeCanvas();
}

function renderToolbox() {
  elements.toolGroups.innerHTML = toolboxDefinition
    .map(
      (group) => `
        <section class="tool-group">
          <h3>${group.group}</h3>
          ${group.blocks
            .map(
              (block) => `
                <button class="tool-button" type="button" data-kind="${block.kind}">
                  <strong>${block.label}</strong>
                  <span>${block.hint}</span>
                </button>
              `
            )
            .join("")}
        </section>
      `
    )
    .join("");
}

function renderWorkspace() {
  if (appState.workspace.length === 0) {
    elements.workspaceList.innerHTML = `
      <li class="workspace-empty">
        Tu sa budu zhromazdovat bloky. Zacni blokom <strong>START</strong>,
        potom pridaj pohyb, otacanie, repeat bloky a pripadne podmienky alebo efekty.
      </li>
    `;
    elements.programMeta.textContent = "Zatial nie je vlozeny ziadny blok.";
    return;
  }

  elements.programMeta.textContent = `V programe je ${appState.workspace.length} ${appState.workspace.length === 1 ? "blok" : appState.workspace.length < 5 ? "bloky" : "blokov"}.`;

  elements.workspaceList.innerHTML = appState.workspace
    .map((block, index) => {
      const isActive = appState.currentBlockId === block.id;

      return `
        <li class="block-card ${isActive ? "active" : ""}" data-block-id="${block.id}">
          <div class="block-top">
            <div>
              <div class="block-order">${index + 1}</div>
            </div>
            <div class="block-copy">
              <h3 class="block-title">${getBlockHeading(block)}</h3>
              <p class="block-caption">${getBlockCaption(block)}</p>
            </div>
          </div>

          <div class="field-grid">
            ${renderBlockFields(block)}
          </div>

          <div class="block-actions">
            <button class="icon-button" type="button" data-action="move-up" ${appState.running ? "disabled" : ""} aria-label="Posunut blok vyssie">Hore</button>
            <button class="icon-button" type="button" data-action="move-down" ${appState.running ? "disabled" : ""} aria-label="Posunut blok nizsie">Dole</button>
            <button class="icon-button delete" type="button" data-action="delete" ${appState.running ? "disabled" : ""} aria-label="Vymazat blok">Zmaz</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function renderBlockFields(block) {
  switch (block.kind) {
    case "forward":
    case "backward":
    case "if-clear":
      return `
        <label class="mini-field">
          Kroky
          <input
            type="number"
            min="1"
            max="10"
            step="1"
            data-field="steps"
            value="${block.steps}"
            ${appState.running ? "disabled" : ""}
          />
        </label>
      `;
    case "turn-left":
    case "turn-right":
      return `
        <label class="mini-field">
          Stupne
          <select data-field="degrees" ${appState.running ? "disabled" : ""}>
            ${[90, 180, 270]
              .map((value) => `<option value="${value}" ${block.degrees === value ? "selected" : ""}>${value} stupnov</option>`)
              .join("")}
          </select>
        </label>
      `;
    case "speed":
      return `
        <label class="mini-field">
          Rychlost
          <select data-field="speed" ${appState.running ? "disabled" : ""}>
            <option value="slow" ${block.speed === "slow" ? "selected" : ""}>pomaly</option>
            <option value="medium" ${block.speed === "medium" ? "selected" : ""}>stredne</option>
            <option value="fast" ${block.speed === "fast" ? "selected" : ""}>rychlo</option>
          </select>
        </label>
      `;
    case "if-obstacle":
      return `
        <label class="mini-field">
          Otocenie
          <select data-field="turn" ${appState.running ? "disabled" : ""}>
            <option value="left" ${block.turn === "left" ? "selected" : ""}>vlavo</option>
            <option value="right" ${block.turn === "right" ? "selected" : ""}>vpravo</option>
          </select>
        </label>
      `;
    case "repeat-times":
      return `
        <label class="mini-field">
          Pocet
          <input
            type="number"
            min="2"
            max="10"
            step="1"
            data-field="count"
            value="${block.count}"
            ${appState.running ? "disabled" : ""}
          />
        </label>
      `;
    case "repeat-until":
      return `
        <label class="mini-field">
          Kym
          <select data-field="condition" ${appState.running ? "disabled" : ""}>
            <option value="goal" ${block.condition === "goal" ? "selected" : ""}>dorazi do ciela</option>
            <option value="obstacle" ${block.condition === "obstacle" ? "selected" : ""}>je vpredu prekazka</option>
            <option value="clear" ${block.condition === "clear" ? "selected" : ""}>je vpredu volna cesta</option>
          </select>
        </label>
      `;
    case "light":
      return `
        <label class="mini-field">
          Farba
          <select data-field="color" ${appState.running ? "disabled" : ""}>
            ${Object.entries(lightPalette)
              .map(
                ([key, value]) =>
                  `<option value="${key}" ${block.color === key ? "selected" : ""}>${value.label}</option>`
              )
              .join("")}
          </select>
        </label>
      `;
    case "say":
      return `
        <label class="mini-field">
          Text
          <input
            type="text"
            maxlength="28"
            data-field="text"
            value="${escapeHtml(block.text)}"
            ${appState.running ? "disabled" : ""}
          />
        </label>
      `;
    case "wait":
      return `
        <label class="mini-field">
          Doby
          <input
            type="number"
            min="1"
            max="3"
            step="1"
            data-field="beats"
            value="${block.beats}"
            ${appState.running ? "disabled" : ""}
          />
        </label>
      `;
    default:
      return `<span class="block-caption">Tento blok nepotrebuje dalsie nastavenie.</span>`;
  }
}

function updateStatusBadges() {
  const runtime = appState.runtime;
  if (!runtime) {
    return;
  }

  elements.directionBadge.textContent = directionVectors[runtime.robot.direction].label;
  elements.speedBadge.textContent = speedProfiles[runtime.speed].label;
}

function getUntilLabel(condition) {
  switch (condition) {
    case "obstacle":
      return "vpredu je prekazka";
    case "clear":
      return "vpredu je volna cesta";
    case "goal":
    default:
      return "Dash dorazi do ciela";
  }
}

function setFeedback(text, tone = "info") {
  elements.feedback.textContent = text;
  elements.feedback.className = `feedback ${tone === "info" ? "" : tone}`.trim();
}

function addLog(text, tone = "info") {
  appState.logs.unshift({ text, tone });
  appState.logs = appState.logs.slice(0, 8);

  elements.logList.innerHTML = appState.logs
    .map(
      (entry, index) => `
        <div class="log-entry ${entry.tone}">
          <strong>${index === 0 ? "Teraz" : `Krok ${appState.logs.length - index}`}</strong>${escapeHtml(entry.text)}
        </div>
      `
    )
    .join("");
}

function resizeCanvas() {
  const rect = elements.boardCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  elements.boardCanvas.width = Math.max(1, Math.round(rect.width * dpr));
  elements.boardCanvas.height = Math.max(1, Math.round(rect.height * dpr));

  renderBoard();
}

function getBoardMetrics() {
  const canvas = elements.boardCanvas;
  const level = getCurrentLevel();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const padding = 18;
  const cell = Math.min((width - padding * 2) / level.cols, (height - padding * 2) / level.rows);
  const boardWidth = cell * level.cols;
  const boardHeight = cell * level.rows;
  const offsetX = (width - boardWidth) / 2;
  const offsetY = (height - boardHeight) / 2;

  return { width, height, cell, offsetX, offsetY };
}

function cellCenter(x, y, metrics) {
  return {
    x: metrics.offsetX + metrics.cell * x + metrics.cell / 2,
    y: metrics.offsetY + metrics.cell * y + metrics.cell / 2
  };
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function renderBoard() {
  const runtime = appState.runtime;
  if (!runtime) {
    return;
  }

  const canvas = elements.boardCanvas;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const metrics = getBoardMetrics();
  const level = getCurrentLevel();
  const now = performance.now();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, metrics.width, metrics.height);

  drawRoundedRect(ctx, 6, 6, metrics.width - 12, metrics.height - 12, 24);
  ctx.fillStyle = "#f5fbff";
  ctx.fill();

  drawRoundedRect(ctx, metrics.offsetX - 8, metrics.offsetY - 8, metrics.cell * level.cols + 16, metrics.cell * level.rows + 16, 22);
  ctx.fillStyle = "rgba(188, 226, 255, 0.26)";
  ctx.fill();

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      const x = metrics.offsetX + col * metrics.cell;
      const y = metrics.offsetY + row * metrics.cell;

      drawRoundedRect(ctx, x + 4, y + 4, metrics.cell - 8, metrics.cell - 8, 18);
      ctx.fillStyle = (row + col) % 2 === 0 ? "rgba(255,255,255,0.95)" : "rgba(238, 247, 255, 0.96)";
      ctx.fill();
    }
  }

  ctx.strokeStyle = "rgba(83, 122, 168, 0.18)";
  ctx.lineWidth = 1;
  for (let row = 0; row <= level.rows; row++) {
    const y = metrics.offsetY + row * metrics.cell;
    ctx.beginPath();
    ctx.moveTo(metrics.offsetX, y);
    ctx.lineTo(metrics.offsetX + metrics.cell * level.cols, y);
    ctx.stroke();
  }
  for (let col = 0; col <= level.cols; col++) {
    const x = metrics.offsetX + col * metrics.cell;
    ctx.beginPath();
    ctx.moveTo(x, metrics.offsetY);
    ctx.lineTo(x, metrics.offsetY + metrics.cell * level.rows);
    ctx.stroke();
  }

  const startCenter = cellCenter(level.start.x, level.start.y, metrics);
  ctx.beginPath();
  ctx.arc(startCenter.x, startCenter.y, metrics.cell * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(71, 193, 120, 0.26)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(startCenter.x, startCenter.y, metrics.cell * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#47c178";
  ctx.fill();

  const goalCenter = cellCenter(level.goal.x, level.goal.y, metrics);
  drawStar(ctx, goalCenter.x, goalCenter.y, metrics.cell * 0.14, metrics.cell * 0.3, 5);
  ctx.fillStyle = "#f5a623";
  ctx.fill();
  ctx.strokeStyle = "rgba(176, 108, 8, 0.36)";
  ctx.lineWidth = 2;
  ctx.stroke();

  level.obstacles.forEach((obstacle) => {
    drawObstacle(ctx, obstacle, metrics);
  });

  drawTrail(ctx, runtime, metrics);
  drawDash(ctx, runtime, metrics, now);
}

function drawStar(ctx, x, y, innerRadius, outerRadius, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI / points) * i;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
}

function drawObstacle(ctx, obstacle, metrics) {
  const x = metrics.offsetX + obstacle.x * metrics.cell;
  const y = metrics.offsetY + obstacle.y * metrics.cell;
  const size = metrics.cell - 16;

  drawRoundedRect(ctx, x + 8, y + 8, size, size, 16);
  ctx.fillStyle = "#ee6f55";
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.fillRect(x + 18, y + 18, size - 20, 8);
  ctx.fillRect(x + 18, y + 34, size - 24, 8);

  ctx.fillStyle = "rgba(113, 31, 16, 0.22)";
  ctx.fillRect(x + 14, y + size - 4, size - 12, 6);
}

function drawTrail(ctx, runtime, metrics) {
  if (runtime.trail.length < 2 && runtime.robot.renderX === runtime.trail[0].x && runtime.robot.renderY === runtime.trail[0].y) {
    return;
  }

  const points = runtime.trail.map((point) => cellCenter(point.x, point.y, metrics));
  const tail = cellCenter(runtime.robot.renderX, runtime.robot.renderY, metrics);

  if (!points.length || points[points.length - 1].x !== tail.x || points[points.length - 1].y !== tail.y) {
    points.push(tail);
  }

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.strokeStyle = "rgba(40, 117, 255, 0.38)";
  ctx.lineWidth = Math.max(6, metrics.cell * 0.14);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawDash(ctx, runtime, metrics, now) {
  const robot = runtime.robot;
  const center = cellCenter(robot.renderX, robot.renderY, metrics);
  const radius = metrics.cell * 0.28;
  const lightActive = runtime.lightColor && runtime.lightUntil > now;
  const speechActive = runtime.speech && runtime.speechUntil > now;

  ctx.save();
  ctx.translate(center.x, center.y);

  if (lightActive) {
    const gradient = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius * 2.5);
    gradient.addColorStop(0, `${runtime.lightColor}cc`);
    gradient.addColorStop(1, `${runtime.lightColor}00`);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  ctx.rotate((robot.angle * Math.PI) / 180);
  drawDirectionArrow(ctx, radius);

  ctx.beginPath();
  ctx.ellipse(0, radius * 1.7, radius * 1.15, radius * 0.34, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(8, 35, 82, 0.18)";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-radius * 1.08, radius * 0.1, radius * 0.32, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#244eb5";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(radius * 1.08, radius * 0.1, radius * 0.32, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  const bodyGradient = ctx.createLinearGradient(-radius, -radius * 1.6, radius, radius * 1.5);
  bodyGradient.addColorStop(0, "#7fe4ff");
  bodyGradient.addColorStop(0.56, "#2f8dff");
  bodyGradient.addColorStop(1, "#1f54c7");

  ctx.beginPath();
  ctx.arc(0, radius * 0.25, radius * 1.34, 0, Math.PI * 2);
  ctx.fillStyle = bodyGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -radius * 1.05, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(radius * 0.3, -radius * 1.17, radius * 0.48, 0, Math.PI * 2);
  ctx.fillStyle = "#f6fbff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(radius * 0.45, -radius * 1.12, radius * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "#122553";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(radius * 0.51, -radius * 1.18, radius * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-radius * 0.32, -radius * 1.27, radius * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15, 57, 142, 0.35)";
  ctx.fill();

  ctx.restore();

  if (speechActive) {
    drawSpeechBubble(ctx, runtime.speech, center.x, center.y - radius * 2.7, metrics);
  }
}

function drawDirectionArrow(ctx, radius) {
  ctx.save();
  ctx.rotate(Math.PI / 2);

  ctx.beginPath();
  ctx.moveTo(0, -radius * 2.05);
  ctx.lineTo(radius * 0.48, -radius * 1.28);
  ctx.lineTo(radius * 0.18, -radius * 1.28);
  ctx.lineTo(radius * 0.18, -radius * 0.35);
  ctx.lineTo(-radius * 0.18, -radius * 0.35);
  ctx.lineTo(-radius * 0.18, -radius * 1.28);
  ctx.lineTo(-radius * 0.48, -radius * 1.28);
  ctx.closePath();
  ctx.fillStyle = "rgba(20, 48, 79, 0.24)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -radius * 1.9);
  ctx.lineTo(radius * 0.34, -radius * 1.36);
  ctx.lineTo(radius * 0.09, -radius * 1.36);
  ctx.lineTo(radius * 0.09, -radius * 0.46);
  ctx.lineTo(-radius * 0.09, -radius * 0.46);
  ctx.lineTo(-radius * 0.09, -radius * 1.36);
  ctx.lineTo(-radius * 0.34, -radius * 1.36);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.fill();

  ctx.restore();
}

function drawSpeechBubble(ctx, text, x, y, metrics) {
  const maxWidth = Math.min(metrics.cell * 3.6, 240);
  const padding = 12;
  ctx.save();
  ctx.font = "700 15px Trebuchet MS";
  const measured = Math.min(ctx.measureText(text).width + padding * 2, maxWidth);
  const height = 42;
  const bubbleX = x - measured / 2;
  const bubbleY = y - height / 2;

  drawRoundedRect(ctx, bubbleX, bubbleY, measured, height, 18);
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.fill();
  ctx.strokeStyle = "rgba(30, 73, 121, 0.18)";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 8, bubbleY + height);
  ctx.lineTo(x, bubbleY + height + 12);
  ctx.lineTo(x + 8, bubbleY + height);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.fill();

  ctx.fillStyle = "#1f4f85";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.slice(0, 26), x, bubbleY + height / 2 + 1);
  ctx.restore();
}

function swapBlocks(indexA, indexB) {
  const copy = [...appState.workspace];
  [copy[indexA], copy[indexB]] = [copy[indexB], copy[indexA]];
  appState.workspace = copy;
}

function isInsideBoard(x, y) {
  const level = getCurrentLevel();
  return x >= 0 && y >= 0 && x < level.cols && y < level.rows;
}

function isObstacle(x, y) {
  const level = getCurrentLevel();
  return level.obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y);
}

function isGoal(x, y) {
  const level = getCurrentLevel();
  return x === level.goal.x && y === level.goal.y;
}

function directionAfterTurn(direction, deltaQuarterTurns) {
  const index = directionOrder.indexOf(direction);
  const nextIndex = (index + deltaQuarterTurns + directionOrder.length * 10) % directionOrder.length;
  return directionOrder[nextIndex];
}

function isRepeatBlock(kind) {
  return kind === "repeat-times" || kind === "repeat-until";
}

function canBeRepeated(block) {
  return Boolean(block) && block.kind !== "start" && !isRepeatBlock(block.kind);
}

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function animate(duration, update) {
  return new Promise((resolve) => {
    const start = performance.now();

    function frame(now) {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      update(eased);
      renderBoard();

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

async function animateMove(targetX, targetY) {
  const runtime = appState.runtime;
  const profile = speedProfiles[runtime.speed];
  const fromX = runtime.robot.x;
  const fromY = runtime.robot.y;

  await animate(profile.move, (progress) => {
    runtime.robot.renderX = fromX + (targetX - fromX) * progress;
    runtime.robot.renderY = fromY + (targetY - fromY) * progress;
  });

  runtime.robot.x = targetX;
  runtime.robot.y = targetY;
  runtime.robot.renderX = targetX;
  runtime.robot.renderY = targetY;
  runtime.trail.push({ x: targetX, y: targetY });
  updateStatusBadges();
  renderBoard();
}

async function animateTurn(deltaQuarterTurns) {
  const runtime = appState.runtime;
  const degrees = deltaQuarterTurns * 90;
  const profile = speedProfiles[runtime.speed];
  const fromAngle = runtime.robot.angle;
  const toAngle = fromAngle + degrees;

  await animate(profile.turn * Math.abs(deltaQuarterTurns), (progress) => {
    runtime.robot.angle = fromAngle + (toAngle - fromAngle) * progress;
  });

  runtime.robot.direction = directionAfterTurn(runtime.robot.direction, deltaQuarterTurns);
  runtime.robot.angle = directionVectors[runtime.robot.direction].angle;
  updateStatusBadges();
  renderBoard();
}

function playBeep() {
  try {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) {
        return;
      }
      audioContext = new AudioCtor();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.value = 650;
    gain.gain.value = 0.0001;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    oscillator.start(now);
    oscillator.stop(now + 0.28);
  } catch (error) {
    // Tichy fallback bez zvuku.
  }
}

async function crash(message) {
  const runtime = appState.runtime;
  runtime.flash = { color: "rgba(219, 92, 86, 0.24)", until: performance.now() + 320 };
  setFeedback(message, "danger");
  addLog(message, "danger");
  renderBoard();
  await pause(420);
}

function frontCell(direction = appState.runtime.robot.direction, distance = 1) {
  const vector = directionVectors[direction];
  return {
    x: appState.runtime.robot.x + vector.x * distance,
    y: appState.runtime.robot.y + vector.y * distance
  };
}

function backCell(distance = 1) {
  const vector = directionVectors[appState.runtime.robot.direction];
  return {
    x: appState.runtime.robot.x - vector.x * distance,
    y: appState.runtime.robot.y - vector.y * distance
  };
}

function markGoalVisit() {
  const runtime = appState.runtime;
  if (!runtime.goalVisited && isGoal(runtime.robot.x, runtime.robot.y)) {
    runtime.goalVisited = true;
    addLog("Dash dorazil na ciel.", "success");
  }
}

function untilConditionMet(condition) {
  const runtime = appState.runtime;
  if (condition === "goal") {
    return isGoal(runtime.robot.x, runtime.robot.y);
  }

  const next = frontCell();
  const obstacleAhead = !isInsideBoard(next.x, next.y) || isObstacle(next.x, next.y);
  if (condition === "obstacle") {
    return obstacleAhead;
  }
  if (condition === "clear") {
    return !obstacleAhead;
  }

  return false;
}

async function moveSteps(steps, backwards = false) {
  for (let index = 0; index < steps; index++) {
    const next = backwards ? backCell(1) : frontCell(appState.runtime.robot.direction, 1);

    if (!isInsideBoard(next.x, next.y)) {
      await crash("Dash vysiel mimo mapy. Skus mensi pocet krokov alebo ine otocenie.");
      return false;
    }

    if (isObstacle(next.x, next.y)) {
      await crash("Dash narazil do prekazky. Uprav program alebo vyuzi podmienku ak prekazka.");
      return false;
    }

    await animateMove(next.x, next.y);
    markGoalVisit();
  }

  return true;
}

async function executeBlock(block) {
  const runtime = appState.runtime;

  switch (block.kind) {
    case "start":
      addLog("Program sa spustil.", "info");
      setFeedback("Dash vyrasa na cestu.", "info");
      runtime.statusText = "Dash startuje.";
      await pause(160);
      return true;

    case "forward":
      addLog(`Dash ide dopredu o ${block.steps}.`, "info");
      return moveSteps(block.steps, false);

    case "backward":
      addLog(`Dash cuva o ${block.steps}.`, "info");
      return moveSteps(block.steps, true);

    case "turn-left":
      addLog(`Dash sa otaca vlavo o ${block.degrees} stupnov.`, "info");
      await animateTurn(-(block.degrees / 90));
      return true;

    case "turn-right":
      addLog(`Dash sa otaca vpravo o ${block.degrees} stupnov.`, "info");
      await animateTurn(block.degrees / 90);
      return true;

    case "speed":
      runtime.speed = block.speed;
      updateStatusBadges();
      addLog(`Dash prepina rychlost na ${speedProfiles[block.speed].label}.`, "info");
      setFeedback(`Rychlost nastavena na ${speedProfiles[block.speed].label}.`, "info");
      await pause(180);
      return true;

    case "if-obstacle": {
      const next = frontCell();
      const obstacleAhead = !isInsideBoard(next.x, next.y) || isObstacle(next.x, next.y);
      if (obstacleAhead) {
        addLog(`Senzor hlasi prekazku. Dash sa otoci ${block.turn === "left" ? "vlavo" : "vpravo"}.`, "warning");
        await animateTurn(block.turn === "left" ? -1 : 1);
      } else {
        addLog("Pred Dashom nie je prekazka, podmienka sa preskoci.", "info");
        await pause(150);
      }
      return true;
    }

    case "if-clear": {
      const next = frontCell();
      const obstacleAhead = !isInsideBoard(next.x, next.y) || isObstacle(next.x, next.y);
      if (obstacleAhead) {
        addLog("Cesta nie je volna, Dash zostava stat.", "warning");
        await pause(150);
        return true;
      }
      addLog(`Cesta je volna, Dash ide dopredu o ${block.steps}.`, "info");
      return moveSteps(block.steps, false);
    }

    case "repeat-times":
    case "repeat-until":
      return true;

    case "beep":
      playBeep();
      addLog("Dash pipol.", "info");
      if (isGoal(runtime.robot.x, runtime.robot.y)) {
        runtime.actionAtGoal = true;
      }
      await pause(speedProfiles[runtime.speed].pause);
      return true;

    case "light":
      runtime.lightColor = lightPalette[block.color].color;
      runtime.lightUntil = performance.now() + 900;
      addLog(`Dash svieti na ${lightPalette[block.color].label}.`, "info");
      if (isGoal(runtime.robot.x, runtime.robot.y)) {
        runtime.actionAtGoal = true;
      }
      renderBoard();
      await pause(speedProfiles[runtime.speed].pause + 160);
      return true;

    case "say":
      runtime.speech = (block.text || "Idem!").slice(0, 28);
      runtime.speechUntil = performance.now() + 1500;
      addLog(`Dash hovori: "${runtime.speech}"`, "info");
      if (isGoal(runtime.robot.x, runtime.robot.y)) {
        runtime.actionAtGoal = true;
      }
      renderBoard();
      await pause(700);
      return true;

    case "wait":
      addLog(`Dash caka ${block.beats} ${block.beats === 1 ? "dobu" : "doby"}.`, "info");
      await pause(speedProfiles[runtime.speed].pause * block.beats);
      return true;

    default:
      return true;
  }
}

async function runProgram() {
  if (appState.running) {
    return;
  }

  if (appState.workspace.length === 0) {
    setFeedback("Najprv vloz aspon jeden blok. Zacni blokom START.", "warning");
    return;
  }

  if (appState.workspace[0].kind !== "start") {
    setFeedback("Program by mal zacinat blokom START.", "warning");
    return;
  }

  appState.running = true;
  elements.runButton.disabled = true;
  elements.clearButton.disabled = true;
  elements.nextLevelButton.disabled = true;

  resetRuntime();
  renderWorkspace();
  setFeedback("Program bezi. Sleduj mapu vpravo.", "info");

  let success = true;

  for (let index = 0; index < appState.workspace.length; index++) {
    const block = appState.workspace[index];
    appState.currentBlockId = block.id;
    renderWorkspace();

    if (block.kind === "repeat-times") {
      const nextBlock = appState.workspace[index + 1];
      if (!canBeRepeated(nextBlock)) {
        setFeedback("Repeat x krat musi byt hned pred blokom, ktory sa ma opakovat.", "warning");
        addLog("Repeat x krat nema za sebou vhodny blok.", "warning");
        success = false;
        break;
      }

      addLog(`Repeat x krat zopakuje blok ${getBlockHeading(nextBlock)} ${block.count} krat.`, "info");
      let repeatOk = true;
      for (let repeatIndex = 0; repeatIndex < block.count; repeatIndex++) {
        appState.currentBlockId = nextBlock.id;
        renderWorkspace();
        const result = await executeBlock(nextBlock);
        if (!result) {
          repeatOk = false;
          break;
        }
      }

      if (!repeatOk) {
        success = false;
        break;
      }

      index += 1;
      continue;
    }

    if (block.kind === "repeat-until") {
      const nextBlock = appState.workspace[index + 1];
      if (!canBeRepeated(nextBlock)) {
        setFeedback("Repeat until musi byt hned pred blokom, ktory sa ma opakovat.", "warning");
        addLog("Repeat until nema za sebou vhodny blok.", "warning");
        success = false;
        break;
      }

      addLog(`Repeat until opakuje blok ${getBlockHeading(nextBlock)}, kym plati: ${getUntilLabel(block.condition)}.`, "info");
      let repeatOk = true;
      let guard = 0;

      while (!untilConditionMet(block.condition) && guard < 20) {
        appState.currentBlockId = nextBlock.id;
        renderWorkspace();
        const result = await executeBlock(nextBlock);
        if (!result) {
          repeatOk = false;
          break;
        }
        guard += 1;
      }

      if (repeatOk && guard >= 20 && !untilConditionMet(block.condition)) {
        setFeedback("Repeat until sa zastavil po 20 opakovaniach, lebo podmienka sa nesplnila.", "warning");
        addLog("Repeat until narazil na bezpecnostny limit 20 opakovani.", "warning");
        success = false;
        break;
      }

      if (!repeatOk) {
        success = false;
        break;
      }

      index += 1;
      continue;
    }

    const result = await executeBlock(block);
    if (!result) {
      success = false;
      break;
    }
  }

  appState.currentBlockId = null;

  if (success && isGoal(appState.runtime.robot.x, appState.runtime.robot.y)) {
    const bonus = appState.runtime.actionAtGoal
      ? " A este stihol ciel oslavit efektom."
      : "";
    setFeedback(`Vyborne! Dash prisiel do ciela.${bonus}`, "success");
    addLog("Misia splnena.", "success");
  } else if (success && appState.runtime.goalVisited) {
    setFeedback("Dash bol v cieli, ale program ho odtial posunul prec. Skus upravit posledne bloky.", "warning");
  } else if (success) {
    setFeedback("Dash este do ciela nedorazil. Skus inu kombinaciu blokov.", "warning");
  }

  appState.running = false;
  elements.runButton.disabled = false;
  elements.clearButton.disabled = false;
  elements.nextLevelButton.disabled = false;
  renderWorkspace();
  renderBoard();
}

function updateBlockField(blockId, field, value) {
  const block = appState.workspace.find((item) => item.id === blockId);
  if (!block) {
    return;
  }

  if (field === "steps") {
    block.steps = clamp(Number(value) || 1, 1, 10);
  } else if (field === "count") {
    block.count = clamp(Number(value) || 2, 2, 10);
  } else if (field === "degrees") {
    const allowed = [90, 180, 270];
    block.degrees = allowed.includes(Number(value)) ? Number(value) : 90;
  } else if (field === "speed") {
    block.speed = ["slow", "medium", "fast"].includes(value) ? value : "medium";
  } else if (field === "turn") {
    block.turn = value === "right" ? "right" : "left";
  } else if (field === "condition") {
    block.condition = ["goal", "obstacle", "clear"].includes(value) ? value : "goal";
  } else if (field === "color") {
    block.color = lightPalette[value] ? value : "yellow";
  } else if (field === "text") {
    block.text = value.slice(0, 28);
  } else if (field === "beats") {
    block.beats = clamp(Number(value) || 1, 1, 3);
  }

  if (field !== "text") {
    renderWorkspace();
  }
}

elements.toolGroups.addEventListener("click", (event) => {
  const button = event.target.closest("[data-kind]");
  if (!button || appState.running) {
    return;
  }

  const block = createBlock(button.dataset.kind);
  appState.workspace.push(block);
  renderWorkspace();
  setFeedback(`Blok ${getBlockHeading(block)} bol pridany do programu.`, "info");
});

elements.workspaceList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-block-id]");
  const actionButton = event.target.closest("[data-action]");

  if (!card || !actionButton || appState.running) {
    return;
  }

  const blockId = Number(card.dataset.blockId);
  const index = appState.workspace.findIndex((block) => block.id === blockId);
  if (index === -1) {
    return;
  }

  const action = actionButton.dataset.action;

  if (action === "move-up" && index > 0) {
    swapBlocks(index, index - 1);
  } else if (action === "move-down" && index < appState.workspace.length - 1) {
    swapBlocks(index, index + 1);
  } else if (action === "delete") {
    appState.workspace.splice(index, 1);
  }

  renderWorkspace();
});

elements.workspaceList.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  const card = event.target.closest("[data-block-id]");
  if (!field || !card) {
    return;
  }

  updateBlockField(Number(card.dataset.blockId), field, event.target.value);
});

elements.workspaceList.addEventListener("change", (event) => {
  const field = event.target.dataset.field;
  const card = event.target.closest("[data-block-id]");
  if (!field || !card) {
    return;
  }

  updateBlockField(Number(card.dataset.blockId), field, event.target.value);
  if (field === "text") {
    renderWorkspace();
  }
});

elements.runButton.addEventListener("click", runProgram);

elements.clearButton.addEventListener("click", () => {
  if (appState.running) {
    return;
  }

  appState.workspace = [];
  appState.currentBlockId = null;
  resetRuntime();
  renderWorkspace();
  setFeedback("Program je vymazany. Mozes skladat novu postupnost blokov.", "info");
  addLog("Bloky boli vymazane.", "info");
});

elements.nextLevelButton.addEventListener("click", () => {
  if (appState.running) {
    return;
  }

  loadLevel(appState.levelIndex + 1);
});

window.addEventListener("resize", resizeCanvas);

renderToolbox();
loadLevel(0);
