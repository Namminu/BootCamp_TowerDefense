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

function placeNewTower() { //타워 배치를 알리는 함수. 타워 배치는 밑에서 한다.
   //if 타워 돈보다 많을때
    isPlacingTower = true; // 타워 배치를 시작
    previewTower = new Tower(0, 0, towerCost); // 초기 위치는 (0, 0)으로 설정 여기서 나타나서 바로 마우스로 이동함.
    document.body.style.cursor = "crosshair"; // 사용자에게 배치 모드임을 알림
}


// 게임 루프
function gameLoop() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
 

  // 몬스터 처리

  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
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
    previewTower.draw(ctx, towerImage);
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
    // 골드 차감 및 타워 설치
    //userGold -= towerCost;
    towers.push(new Tower(previewTower.x, previewTower.y, previewTower.cost));

    // 배치 상태 초기화
    isPlacingTower = false;
    previewTower = null;
    document.body.style.cursor = "default"; // 기본 커서로 복원
  }
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


const buyTowerButton = document.getElementById("buyTowerButton");

buyTowerButton.addEventListener("click", placeNewTower);

document.body.appendChild(buyTowerButton);