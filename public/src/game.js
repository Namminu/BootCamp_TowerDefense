import { Base } from "./base.js";
import { MonsterControl } from "./monsterControl.js";  // Import the MonsterControl class
import { Tower } from "./tower.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let base; // 기지 객체
let baseHp = 500; // 기지 체력
let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 2000; // 몬스터 생성 주기 (ms)

let towerCost = 100; // 타워 구입 비용
const towers = [];
const MIN_DISTANCE = 100;

let isPlacingTower = false; // 현재 타워를 배치 중인지 확인하는 플래그
let previewTower = null; // 미리보기를 위한 타워 객체

let isInitGame = false; // 게임 초기화 여부

// 이미지 로딩
const backgroundImage = new Image();
backgroundImage.src = "./images/bg.webp";

const baseImage = new Image();
baseImage.src = "./images/base.png";

const towerImage = new Image();
towerImage.src = "./images/tower.png";

const towerImage2 = new Image();
towerImage2.src = "./images/tower2.png";

const towerImage3 = new Image();
towerImage3.src = "./images/tower3.png";

// 몬스터 컨트롤 객체
const monsterControl = new MonsterControl();
monsterControl.loadMonsterImages(); // 몬스터 이미지 로딩

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

//타워간 거리 제한.
function canPlaceTower(newTowerX, newTowerY) {
  for (let i = 0; i < towers.length; i++) {
    const tower = towers[i];

    // 타워 간의 거리 계산 (두 타워의 중심 사이 거리)
    const dx = newTowerX - (tower.x);
    const dy = newTowerY - (tower.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < MIN_DISTANCE) {
      return false; // 타워 간의 거리가 최소 거리보다 짧으면 배치 불가
    }
  }
  return true; // 배치 가능
}


function placeNewTower(type) { // 타입을 매개변수로 받아 타워를 설정
  isPlacingTower = true; // 타워 배치를 시작
  let towerImageToUse;
  switch (type) {
    case 'normal':
      towerImageToUse = towerImage;  // 기본 타워 이미지
      break;
    case 'rage':
      towerImageToUse = towerImage2;  // 분노 타워 이미지
      break;
    case 'sadness':
      towerImageToUse = towerImage3;  // 슬픔 타워 이미지
      break;
    default:
      towerImageToUse = towerImage;  // 기본 타워 이미지
      break;
  }
  previewTower = new Tower(0, 0, towerCost, type, towerImageToUse); // 타입에 맞는 타워 생성
  document.body.style.cursor = "crosshair"; // 사용자에게 배치 모드임을 알림
}








// 게임 루프
function gameLoop() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 이건 절대 지우지 마.
 

  // 몬스터 처리

  towers.forEach((tower) => {
    tower.draw(ctx);
    tower.updateCooldown();
    monsterControl.monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
      );
      if (distance < tower.range) { //여기서 뭔갈 해야함.(몬스터 뭐 스택 올리는거나. 그런거.)
        tower.attack(monster);
      }
    });
  });


  if (isPlacingTower && previewTower) {
    // 미리보기 타워 렌더링 (타워 이미지와 동일하게)
    const canPlace = canPlaceTower(previewTower.x, previewTower.y);
    previewTower.draw(ctx, true, canPlace);
  }

  base.draw(ctx, baseImage); // 기지 다시 그리기

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

// 게임 시작
if (!isInitGame) {
  initGame();
}


canvas.addEventListener("mousemove", (event) => { //타워의 미리보기 위치
  if (isPlacingTower && previewTower) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // 미리보기 타워의 위치를 마우스 위치에 맞게 설정
    previewTower.x = mouseX - previewTower.width / 2;
    previewTower.y = mouseY - previewTower.height / 2;

 
  }
});



canvas.addEventListener("click", (event) => { //실제로 설치
  if (isPlacingTower && previewTower) {
    if (canPlaceTower(previewTower.x, previewTower.y)) {
      towers.push(new Tower(previewTower.x, previewTower.y, previewTower.cost, previewTower.type, previewTower.image)); 
      isPlacingTower = false;
      previewTower = null;
      document.body.style.cursor = "default"; // 기본 커서로 복원
    } else {
      console.log("이 위치에는 타워를 배치할 수 없습니다. 다른 위치를 선택하세요."); // 배치 불가 경고
    }
  }

  towers.forEach(tower => {
    if (event.x >= tower.x && event.x <= tower.x + tower.width &&
        event.y >= tower.y && event.y <= tower.y + tower.height) {

      // 모달에 타워 정보 업데이트
      document.getElementById("towerLevel").textContent = `레벨: ${tower.level}`;
      document.getElementById("towerAttackPower").textContent = `공격력: ${tower.attackPower}`;
      document.getElementById("towerRange").textContent = `사거리: ${tower.range}`;
      document.getElementById("towerCost").textContent = `비용: ${tower.cost}`;

      // 모달 띄우기
      towerInfoModal.style.display = "flex";
    }
  });

});

// 우클릭으로 타워 배치 취소
canvas.addEventListener("contextmenu", (event) => {
  if (isPlacingTower) {
    event.preventDefault(); // 우클릭 기본 메뉴 방지
    isPlacingTower = false;
    previewTower = null;
    document.body.style.cursor = "default"; // 커서 복원
  }
});


const buyTowerButton1 = document.getElementById("buyTowerButton1");
const buyTowerButton2 = document.getElementById("buyTowerButton2");
const buyTowerButton3 = document.getElementById("buyTowerButton3");

let towerInfoModal = document.getElementById("towerInfoModal");
let closeModal = document.getElementById("closeModal");

buyTowerButton1.addEventListener("click", () => placeNewTower('normal')); // 노말 타입 타워 배치
buyTowerButton2.addEventListener("click", () => placeNewTower('rage')); // 분노 타입 타워 배치
buyTowerButton3.addEventListener("click", () => placeNewTower('sadness')); // 슬픔 타입 타워 배치

closeModal.onclick = function() {
  towerInfoModal.style.display = "none";
}



document.body.appendChild(buyTowerButton1);