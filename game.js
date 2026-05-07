const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("result");
const resultText = document.getElementById("resultText");

const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const titleImage = document.getElementById("titleImage");

const bgm = document.getElementById("bgm");

const seGood = document.getElementById("seGood");
const seGold = document.getElementById("seGold");
const seCD = document.getElementById("seCD");
const seVHS = document.getElementById("seVHS");
const seStart = document.getElementById("seStart");
const seResult = document.getElementById("seResult");
const seChorus = document.getElementById("seChorus");

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
let time = 107;

let chorusPlayed1 = false;
let chorusPlayed2 = false;

const player = {
  x: 150,
  y: 540,
  w: 64,
  h: 64,
  speed: 7
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
titleImage.onclick = startGame;