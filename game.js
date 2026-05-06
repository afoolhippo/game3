const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const resultText = document.getElementById("resultText");

const bgm = document.getElementById("bgm");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

let score = 0;
let time = 60;
let gameOver = false;
let started = false;

const player = {
  x: 160,
  y: 560,
  w: 40,
  h: 40,
  speed: 7
};

const items = [];

const itemCounts = {
  maru: 0,
  shikaku: 0,
  hishi: 0,
  sankakuGood: 0,
  batsu: 0,
  sankakuBad: 0,
  rare: 0
};

const itemTypes = [
  { id: "maru", symbol: "●", label: "にんじん", score: 10, type: "good" },
  { id: "shikaku", symbol: "■", label: "れんこん", score: 10, type: "good" },
  { id: "hishi", symbol: "◆", label: "ごぼう", score: 10, type: "good" },
  { id: "sankakuGood", symbol: "▲", label: "とり肉", score: 10, type: "good" },

  { id: "batsu", symbol: "✕", label: "異物X", score: -20, type: "bad" },
  { id: "sankakuBad", symbol: "△", label: "異物△", score: -20, type: "bad" },

  { id: "rare", symbol: "★", label: "レア素材", score: 50, type: "rare" }
];

function spawnItem() {
  if (!started || gameOver) return;

  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  items.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    w: 40,
    h: 40,
    speed: 2 + Math.random() * 3,
    ...type
  });
}

function update() {
  if (!started || gameOver) return;

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];

    item.y += item.speed;

    if (collision(player, item)) {
      score += item.score;
      itemCounts[item.id]++;
      items.splice(i, 1);
      continue;
    }

    if (item.y > canvas.height + 50) {
      items.splice(i, 1);
    }
  }

  scoreEl.textContent = score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f380f";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  items.forEach(item => {
    if (item.type === "good") ctx.fillStyle = "#0f380f";
    if (item.type === "bad") ctx.fillStyle = "#6b2b16";
    if (item.type === "rare") ctx.fillStyle = "#081820";

    ctx.font = "32px monospace";
    ctx.fillText(item.symbol, item.x + 4, item.y + 32);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function collision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

document.addEventListener("keydown", e => {
  if (!started || gameOver) return;

  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;

  limitPlayer();
});

canvas.addEventListener("touchmove", e => {
  if (!started || gameOver) return;

  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  player.x = e.touches[0].clientX - rect.left - player.w / 2;

  limitPlayer();
}, { passive: false });

function limitPlayer() {
  if (player.x < 0) player.x = 0;

  if (player.x > canvas.width - player.w) {
    player.x = canvas.width - player.w;
  }
}

setInterval(spawnItem, 700);

setInterval(() => {
  if (!started || gameOver) return;

  time--;
  timeEl.textContent = time;

  if (time <= 0) {
    endGame();
  }
}, 1000);

function makeBar(value, max = 10) {
  const v = Math.max(0, Math.min(max, Math.round(value)));
  return "█".repeat(v) + "░".repeat(max - v);
}

function endGame() {
  gameOver = true;

  if (bgm) bgm.pause();

  resultEl.classList.remove("hidden");

  const goodTotal =
    itemCounts.maru +
    itemCounts.shikaku +
    itemCounts.hishi +
    itemCounts.sankakuGood;

  const badTotal =
    itemCounts.batsu +
    itemCounts.sankakuBad;

  const umami = Math.min(10, itemCounts.sankakuGood * 1.5 + itemCounts.rare * 2);
  const yasai = Math.min(10, (itemCounts.maru + itemCounts.shikaku + itemCounts.hishi) / 2);
  const soul = Math.min(10, score / 40 + itemCounts.rare * 2);
  const noise = Math.min(10, badTotal * 2);

  let title = "";

  if (score < 100) {
    title = "味が薄い…";
  } else if (score < 250) {
    title = "実家の味";
  } else if (score < 400) {
    title = "うまか〜！";
  } else {
    title = "がめ煮SOUL MAX";
  }

  resultText.innerHTML = `
    <strong>${title}</strong><br>
    SCORE：${score}<br><br>

    <div class="resultBlock">
      <strong>取った素材</strong><br>
      ● ${itemTypes[0].label}：${itemCounts.maru}<br>
      ■ ${itemTypes[1].label}：${itemCounts.shikaku}<br>
      ◆ ${itemTypes[2].label}：${itemCounts.hishi}<br>
      ▲ ${itemTypes[3].label}：${itemCounts.sankakuGood}<br>
      ★ ${itemTypes[6].label}：${itemCounts.rare}<br>
      ✕ ${itemTypes[4].label}：${itemCounts.batsu}<br>
      △ ${itemTypes[5].label}：${itemCounts.sankakuBad}<br>
    </div>

    <br>

    <div class="resultBlock">
      <strong>味パラメータ</strong><br>
      うまみ　${makeBar(umami)}<br>
      根菜感　${makeBar(yasai)}<br>
      ソウル　${makeBar(soul)}<br>
      雑味　　${makeBar(noise)}<br>
    </div>

    <br>
    良素材：${goodTotal}　異物：${badTotal}
  `;
}

function restartGame() {
  location.reload();
}

startBtn.addEventListener("click", () => {
  started = true;
  startScreen.style.display = "none";

  if (bgm) {
    bgm.currentTime = 0;
    bgm.play().catch(err => {
      console.log(err);
    });
  }
});

loop();