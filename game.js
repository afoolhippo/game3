const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const resultText = document.getElementById("resultText");

const bgm = document.getElementById("bgm");

let score = 0;
let time = 60;
let gameOver = false;

const player = {
  x: 160,
  y: 560,
  w: 40,
  h: 40,
  speed: 7
};

const items = [];

const itemTypes = [
  { symbol: "●", score: 10, type: "good" },
  { symbol: "■", score: 10, type: "good" },
  { symbol: "◆", score: 15, type: "good" },
  { symbol: "★", score: 20, type: "rare" },

  { symbol: "✕", score: -20, type: "bad" },
  { symbol: "△", score: -20, type: "bad" }
];

function spawnItem() {
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  items.push({
    x: Math.random() * 320,
    y: -40,
    w: 40,
    h: 40,
    speed: 2 + Math.random() * 3,
    ...type
  });
}

function update() {
  if (gameOver) return;

  items.forEach(item => {
    item.y += item.speed;

    if (collision(player, item)) {

      score += item.score;

      items.splice(items.indexOf(item), 1);
    }
  });

  scoreEl.textContent = score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = "#0f380f";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // アイテム
  items.forEach(item => {

    if (item.type === "good") {
      ctx.fillStyle = "#0f380f";
    }

    if (item.type === "bad") {
      ctx.fillStyle = "#306230";
    }

    if (item.type === "rare") {
      ctx.fillStyle = "#081820";
    }

    ctx.font = "32px monospace";
    ctx.fillText(item.symbol, item.x, item.y + 30);
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

  if (e.key === "ArrowLeft") {
    player.x -= player.speed;
  }

  if (e.key === "ArrowRight") {
    player.x += player.speed;
  }

  limitPlayer();
});

canvas.addEventListener("touchmove", e => {

  const rect = canvas.getBoundingClientRect();

  player.x = e.touches[0].clientX - rect.left - 20;

  limitPlayer();
});

function limitPlayer() {

  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x > canvas.width - player.w) {
    player.x = canvas.width - player.w;
  }
}

setInterval(spawnItem, 700);

const timer = setInterval(() => {

  time--;

  timeEl.textContent = time;

  if (time <= 0) {
    endGame();
  }

}, 1000);

function endGame() {

  gameOver = true;

  bgm.pause();

  resultEl.classList.remove("hidden");

  if (score < 100) {
    resultText.textContent = "味が薄い…";
  }
  else if (score < 250) {
    resultText.textContent = "実家の味";
  }
  else if (score < 400) {
    resultText.textContent = "うまか〜！";
  }
  else {
    resultText