import { Base } from "./base.js";
import { Monster } from "./monster.js";
import { MonsterControl } from "./monsterControl.js";  // Import the MonsterControl class

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let base; // 기지 객체
let baseHp = 500; // 기지 체력
let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 2000; // 몬스터 생성 주기 (ms)

let isInitGame = false; // 게임 초기화 여부

// 이미지 로딩
const backgroundImage = new Image();
backgroundImage.src = "./images/bg.webp";

const baseImage = new Image();
baseImage.src = "./images/base.png";

// 몬스터 컨트롤 객체
const monsterControl = new MonsterControl();
monsterControl.loadMonsterImages(); // 몬스터 이미지 로딩

// 게임 초기화 함수
function initGame() {
  if (isInitGame) {
    return; // 이미 초기화된 경우 방지
  }

  isInitGame = true;
  monsterLevel = 1;
  monsterSpawnInterval = 2000;

  const monsterPath = monsterControl.generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 경로 그리기)
  placeBase(monsterControl.monsterPath); // 기지 배치
  setInterval(() => monsterControl.spawnMonster(), monsterSpawnInterval); // 주기적으로 몬스터 생성
  gameLoop(); 
}

// 배경 및 초기 맵 그리기
function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); 
}

// 기지 배치
function placeBase(monsterPath) {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

// 게임 루프
function gameLoop() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  base.draw(ctx, baseImage); // 기지 다시 그리기

  // 몬스터 처리
  monsterControl.monsters.forEach((monster, index) => {
    if (monster.hp <= 0) {
      monsterControl.monsters.splice(index, 1);
    } else {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
      monster.draw(ctx);
    }
  });

  requestAnimationFrame(gameLoop); // 다음 프레임에 gameLoop 호출
}

// 게임 시작
if (!isInitGame) {
  initGame();
}