function setAppHeight() {

  const height =
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  document.documentElement
    .style
    .setProperty("--app-height", `${height}px`);
}

setAppHeight();

window.addEventListener("resize", setAppHeight);

if (window.visualViewport) {

  window.visualViewport
    .addEventListener("resize", setAppHeight);
}

const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

const scoreEl =
  document.getElementById("score");

const timeEl =
  document.getElementById("time");

const titleScreen =
  document.getElementById("titleScreen");

const gameScreen =
  document.getElementById("gameScreen");

const resultScreen =
  document.getElementById("resultScreen");

const titleImage =
  document.getElementById("titleImage");

const startButton =
  document.getElementById("startButton");

const rankTitle =
  document.getElementById("rankTitle");

const resultText =
  document.getElementById("resultText");

const bgm =
  document.getElementById("bgm");

const seGood =
  document.getElementById("seGood");

const seGold =
  document.getElementById("seGold");

const seCD =
  document.getElementById("seCD");

const seVHS =
  document.getElementById("seVHS");

const seStart =
  document.getElementById("seStart");

const seResult =
  document.getElementById("seResult");

const seChorus =
  document.getElementById("seChorus");

const GAME_TIME = 107;

const load = src => {

  const img = new Image();

  img.src = src;

  return img;
};

const images = {

  ninjin: load("ninjin.png"),
  renkon: load("renkon.png"),
  gobou: load("gobou.png"),
  toriniku: load("toriniku.png"),
  ingen: load("ingen.png"),
  cd: load("cd.png"),
  vhs: load("vhs.png"),
  goldshitake: load("goldshitake.png"),
  nabe: load("nabe.png")
};

let started = false;
let gameOver = false;
let score = 0;

let chorusPlayed1 = false;
let chorusPlayed2 = false;

let currentTitle = "味が薄い…🍲";

const player = {

  x: 180,
  y: 660,

  w: 72,
  h: 72,

  speed: 8
};

const items = [];

const counts = {

  ninjin: 0,
  renkon: 0,
  gobou: 0,
  toriniku: 0,
  ingen: 0,

  cd: 0,
  vhs: 0,

  goldshitake: 0
};

const itemTypes = [

  {
    id: "ninjin",
    score: 10,
    type: "good",
    weight: 26
  },

  {
    id: "renkon",
    score: 10,
    type: "good",
    weight: 22
  },

  {
    id: "gobou",
    score: 10,
    type: "good",
    weight: 20
  },

  {
    id: "toriniku",
    score: 10,
    type: "good",
    weight: 16
  },

  {
    id: "ingen",
    score: 10,
    type: "good",
    weight: 12
  },

  {
    id: "cd",
    score: -30,
    type: "bad",
    weight: 8
  },

  {
    id: "vhs",
    score: -50,
    type: "bad",
    weight: 5
  },

  {
    id: "goldshitake",
    score: 250,
    type: "rare",
    weight: 0.25
  }
];

function playSE(se) {

  if (!se) return;

  se.currentTime = 0;

  se.play().catch(() => {});
}

function weightedRandom() {

  const total =
    itemTypes.reduce(
      (sum, item) => sum + item.weight,
      0
    );

  let rand = Math.random() * total;

  for (const item of itemTypes) {

    rand -= item.weight;

    if (rand <= 0) return item;
  }

  return itemTypes[0];
}

function isChorus() {

  const t = bgm.currentTime;

  return (
    (t >= 37 && t <= 53) ||
    (t >= 72 && t <= 88)
  );
}

function spawnItem() {

  if (!started || gameOver) return;

  const amount =
    isChorus()
      ? 2 + Math.floor(Math.random() * 2)
      : 1;

  for (let i = 0; i < amount; i++) {

    const type = weightedRandom();

    let speed =
      2 + Math.random() * 1.8;

    let vx = 0;

    let w = 52;
    let h = 52;

    if (type.id === "cd") {

      speed =
        5.5 + Math.random() * 1.8;

      vx =
        (Math.random() - 0.5) * 5;
    }

    if (type.id === "vhs") {

      speed = 2.1;

      vx =
        (Math.random() - 0.5) * 1.5;

      w = 84;
      h = 54;
    }

    if (type.id === "goldshitake") {

      speed = 1.7;

      vx =
        (Math.random() - 0.5) * 2;

      w = 58;
      h = 58;
    }

    items.push({

      x:
        Math.random() *
        (canvas.width - w),

      y: -80,

      w,
      h,

      speed,
      vx,

      ...type
    });
  }
}

function collision(a, b) {

  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update() {

  if (!started || gameOver) return;

  if (
    !chorusPlayed1 &&
    bgm.currentTime >= 37
  ) {

    chorusPlayed1 = true;

    playSE(seChorus);
  }

  if (
    !chorusPlayed2 &&
    bgm.currentTime >= 72
  ) {

    chorusPlayed2 = true;

    playSE(seChorus);
  }

  for (
    let i = items.length - 1;
    i >= 0;
    i--
  ) {

    const item = items[i];

    item.y += item.speed;
    item.x += item.vx;

    if (
      item.x < 0 ||
      item.x > canvas.width - item.w
    ) {
      item.vx *= -1;
    }

    if (collision(player, item)) {

      score += item.score;

      counts[item.id]++;

      if (item.type === "good") {
        playSE(seGood);
      }

      if (item.id === "goldshitake") {
        playSE(seGold);
      }

      if (item.id === "cd") {
        playSE(seCD);
      }

      if (item.id === "vhs") {
        playSE(seVHS);
      }

      items.splice(i, 1);

      continue;
    }

    if (
      item.y > canvas.height + 100
    ) {
      items.splice(i, 1);
    }
  }

  scoreEl.textContent = score;

  const remain =
    Math.max(
      0,
      Math.ceil(
        GAME_TIME - bgm.currentTime
      )
    );

  timeEl.textContent = remain;

  if (bgm.ended) {
    endGame();
  }
}

function draw() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  items.forEach(item => {

    const img = images[item.id];

    if (img) {

      ctx.drawImage(
        img,
        item.x,
        item.y,
        item.w,
        item.h
      );
    }
  });

  ctx.drawImage(
    images.nabe,
    player.x,
    player.y,
    player.w,
    player.h
  );
}

function loop() {

  update();
  draw();

  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

function makeBar(value) {

  const v =
    Math.max(
      0,
      Math.min(10, Math.round(value))
    );

  return (
    "█".repeat(v) +
    "░".repeat(10 - v)
  );
}

function endGame() {

  gameOver = true;

  bgm.pause();

  playSE(seResult);

  gameScreen.classList.add("hidden");

  resultScreen.classList.remove("hidden");

  const umami =
    Math.min(
      10,
      counts.toriniku * 0.22 +
      counts.goldshitake * 2
    );

  const yasai =
    Math.min(
      10,
      counts.ninjin * 0.07 +
      counts.renkon * 0.11 +
      counts.gobou * 0.14 +
      counts.ingen * 0.06
    );

  const soul =
    Math.min(
      10,
      score / 420 +
      counts.gobou * 0.05 +
      counts.ingen * 0.07 +
      counts.goldshitake * 1.5
    );

  const noise =
    Math.min(
      10,
      counts.cd * 0.8 +
      counts.vhs * 1.3
    );

  if (score < 500) {
    currentTitle = "味が薄い…🍲";
  }
  else if (score < 1200) {
    currentTitle = "実家の味🍲";
  }
  else if (score < 2200) {
    currentTitle = "うまか〜！🍲✨";
  }
  else {
    currentTitle =
      "がめ煮SOUL MAX🍲🔥✨";
  }

  rankTitle.textContent = currentTitle;

  resultText.innerHTML = `
    SCORE：${score}<br><br>

    うまみ　${makeBar(umami)}<br>
    根菜感　${makeBar(yasai)}<br>
    ソウル　${makeBar(soul)}<br>
    雑味　　${makeBar(noise)}
  `;
}

function startGame() {

  if (started) return;

  started = true;

  titleScreen.classList.add("hidden");

  gameScreen.classList.remove("hidden");

  playSE(seStart);

  bgm.currentTime = 0;

  bgm.play().catch(() => {});

  loop();
}

function shareScore() {

  const text =
`${currentTitle}

SCORE：${score}

無料ブラウザゲーム
「がめ煮ソウル」

https://afoolhippo.github.io/game3/

#がめ煮ソウル #カバゲーセン`;

  const url =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");
}

titleImage
  .addEventListener(
    "pointerdown",
    startGame
  );

startButton
  .addEventListener(
    "pointerdown",
    startGame
  );

document
  .getElementById("shareButton")
  .addEventListener(
    "pointerdown",
    shareScore
  );

document
  .getElementById("restartBtn")
  .addEventListener(
    "pointerdown",
    () => {
      location.reload();
    }
  );

document
  .getElementById("homeButton")
  .addEventListener(
    "pointerdown",
    () => {

      location.href =
        "https://afoolhippo.github.io/home/?skipTitle=1";
    }
  );

document
  .getElementById("titleBackButton")
  .addEventListener(
    "pointerdown",
    () => {
      location.reload();
    }
  );

const keys = {};

document.addEventListener(
  "keydown",
  e => {
    keys[e.key] = true;
  }
);

document.addEventListener(
  "keyup",
  e => {
    keys[e.key] = false;
  }
);

canvas.addEventListener(
  "touchmove",

  e => {

    if (!started || gameOver) return;

    e.preventDefault();

    const rect =
      canvas.getBoundingClientRect();

    const scaleX =
      canvas.width / rect.width;

    player.x =
      (
        e.touches[0].clientX -
        rect.left
      ) *
      scaleX -
      player.w / 2;

    limitPlayer();
  },

  { passive: false }
);

function limitPlayer() {

  player.x =
    Math.max(
      0,
      Math.min(
        canvas.width - player.w,
        player.x
      )
    );
}

function movePlayer() {

  if (started && !gameOver) {

    if (keys.ArrowLeft) {
      player.x -= player.speed;
    }

    if (keys.ArrowRight) {
      player.x += player.speed;
    }

    limitPlayer();
  }

  requestAnimationFrame(movePlayer);
}

setInterval(spawnItem, 800);

movePlayer();