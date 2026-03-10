(function () {
  const goal = 20;
  const gameLengthSeconds = 30;
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const messageEl = document.getElementById("message");
  const startButton = document.getElementById("startButton");
  const arena = document.getElementById("arena");
  const target = document.getElementById("target");

  let score = 0;
  let timeLeft = gameLengthSeconds;
  let timerId = null;
  let active = false;

  function updateHud() {
    scoreEl.textContent = String(score);
    timeEl.textContent = String(timeLeft);
  }

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function moveTarget() {
    const arenaRect = arena.getBoundingClientRect();
    const targetSize = target.offsetWidth;
    const maxX = arenaRect.width - targetSize;
    const maxY = arenaRect.height - targetSize;
    const nextX = Math.max(0, Math.random() * maxX);
    const nextY = Math.max(0, Math.random() * maxY);

    target.style.left = nextX + targetSize / 2 + "px";
    target.style.top = nextY + targetSize / 2 + "px";
  }

  function finishGame(won) {
    active = false;
    clearInterval(timerId);
    timerId = null;
    target.classList.add("hidden");
    startButton.disabled = false;
    startButton.textContent = "Play again";
    setMessage(
      won
        ? "You reached 20 hits. GitHub Pages test passed."
        : "Time is up. Press Play again and try to catch 20."
    );
  }

  function tick() {
    timeLeft -= 1;
    updateHud();

    if (timeLeft <= 0) {
      finishGame(score >= goal);
    }
  }

  function startGame() {
    score = 0;
    timeLeft = gameLengthSeconds;
    active = true;
    updateHud();
    setMessage("Catch the target 20 times before the timer ends.");
    startButton.disabled = true;
    target.classList.remove("hidden");
    moveTarget();
    clearInterval(timerId);
    timerId = window.setInterval(tick, 1000);
  }

  startButton.addEventListener("click", startGame);

  target.addEventListener("click", function () {
    if (!active) {
      return;
    }

    score += 1;
    updateHud();

    if (score >= goal) {
      finishGame(true);
      return;
    }

    moveTarget();
    setMessage("Nice. Keep going.");
  });

  updateHud();
  target.classList.add("hidden");
})();
