import { Base } from "./base.js";
import { Monster } from "./monster.js";
import { Tower } from "./tower.js";
import towerData from "../assets/tower.json" with { type: "json" };
import { TowerControl } from "./towerControl.js";

/* 
  어딘가에 엑세스 토큰이 저장이 안되어 있다면 로그인을 유도하는 코드를 여기에 추가해주세요!
*/

/*

추가하고 싶은거?
2. 경로를 3개정도로 추가해 여러 방향에서 오도록 하기.
3. 스테이지 구분,
4. 포탑 업그레이드. , 포탑판매. --> 이거 하려면 중복되면 안됨. 그니까. 겹치면 안됨.
5. 보스 몬스터 등장. -> 그냥 스폰 몬스터 이미지만 바꾸고 능력치 바꾸면 될듯? 아님 레벨 올리던가. 특별한 능력 추가해도 되고.
6. 게임 종료시 그 스테이지 반환?

서버에서 할일
1. 점수 관리. - 점수 계산.
2. 스테이지 관리.
3. 몬스터 잡은 수 관리. --> 게임 껏다 키면 (즉 스테이지 관리시 힘드니까. "스테이지 넘어갈때" 만 주는걸로.)
4. 

*/

let socket; // 서버 웹소켓 객체
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 500; // 기지 체력

// 타워 관련 변수
let towerCost; // 타워 구입 비용
let towerImage; // 타워 이미지
let towerIndex; // 타워 인덱스
let numOfInitialTowers = 3; // 초기 타워 개수
let isPlacingTower = false; // 현재 타워를 배치 중인지 확인하는 플래그
let previewTower = null; // 미리보기를 위한 타워 객체

const monsters = [];
let ableToMoveRound = false; // 라운드 이동 가능 여부
let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 3; // 몬스터 생성 주기 ms
let killCount = 0; // 몬스터 처치 수
let feverTriggered = false; // 피버 모드 실행 여부를 확인하는 플래그

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 게임 에셋 로드
const TOWER_CONFIG = towerData.data;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = "./images/bg.webp";

const towerImages = TOWER_CONFIG.map((tower) => {
  const image = new Image();
  image.src = tower.image;
  return { image, id: tower.id };
});

const baseImage = new Image();
baseImage.src = "./images/base.png";

const pathImage = new Image();
pathImage.src = "./images/path.png";

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `./images/monster${i}.png`;
  monsterImages.push(img);
}

export const towerControl = new TowerControl(ctx, towerImages);

// 피버 타임 게이지바 너비 계수
const gageBarWidthCoeff = 10;
const maxRage = 20;
let gageBarWidth = maxRage * gageBarWidthCoeff;

const gageBar = {
  x: 300,
  y: 20,
  maxWidth: maxRage * gageBarWidthCoeff,
  width: maxRage * gageBarWidthCoeff,
  height: 40,
  drawBG() {
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(this.x, this.y, this.maxWidth, this.height);
  },
  draw() {
    const my_gradient = ctx.createLinearGradient(
      0,
      this.y,
      0,
      this.y + this.height
    ); // gradient
    my_gradient.addColorStop(0, "#FF8C00");
    my_gradient.addColorStop(0.5, "#FFA500");
    my_gradient.addColorStop(1, "#FFD700");
    ctx.fillStyle = my_gradient;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(this.x, this.y, killCount * gageBarWidthCoeff, this.height);
    ctx.strokeRect(this.x, this.y, this.maxWidth, this.height);
  },
};

let monsterPath;

function generateRandomMonsterPath() {
  //몬스터 경로이동 함수. 경로를 만드는것. 이걸 정하고 나중에 길 생성하는것.
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 400; // 400 ~ 420 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < 1800) {
    // 마지막 x가 1600이 될 때까지 진행
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    if (currentX > 1800) {
      currentX = 1800; // 마지막 x는 1600
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 100) {
      currentY = 100;
    }
    if (currentY > 900) {
      currentY = 900;
    }

    path.push({ x: currentX, y: currentY });
  }

  // 마지막 경로의 y를 시작 y와 동일하게 설정
  path[path.length - 1].y = path[0].y;

  // 경로 정렬 (x 기준으로 오름차순 정렬)
  path.sort((a, b) => a.x - b.x);

  return path;
}

function initMap() {
  // 배경 이미지 그리기
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawPath();
}

function drawPath() {
  //경로에 따라 길을 그리는것.
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  // 초기 타워들이 좀 중앙에 생겼으면 해서 segmentIndex의 범위를 조정
  const segmentIndex = Math.floor(
    Math.random() * (monsterPath.length - 10) + 5
  );
  console.log(segmentIndex);
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

// function placeInitialTowers() {
//   //타워를 초기에 배치하는 함수
//   /*
//     타워를 초기에 배치하는 함수입니다.
//     무언가 빠진 코드가 있는 것 같지 않나요?
//   */
//   for (let i = 0; i < numOfInitialTowers; i++) {
//     const { x, y } = getRandomPositionNearPath(50); //200만큼 떨어지게? 만드는듯.
//     const tower = towerControl.addTower(x, y);
//     towerImage = tower.image;
//     towerCost = tower.cost;
//     towerControl.drawAndUpdateTowers();
//   }

//   towerImage = null;
//   towerCost = null;
// }

function placeNewTower() {
  //타워 배치를 알리는 함수. 타워 배치는 밑에서 한다.
  previewTower = towerControl.addTower(0, 0); // 초기 위치는 (0, 0)으로 설정 여기서 나타나서 바로 마우스로 이동함.

  towerImage = previewTower.image;
  towerCost = previewTower.cost;

  if (userGold >= towerCost) {
    isPlacingTower = true; // 타워 배치를 시작
    document.body.style.cursor = "crosshair"; // 사용자에게 배치 모드임을 알림
  }
}

function placeBase() {
  //플레이어 베이스를 만드는 함수.
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  //몬스터를 monsters 에 넣는 함수.
  monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));
}

async function gameLoop() {
  //게임 반복.
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = "25px Times New Roman";
  ctx.fillStyle = "skyblue";
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = "white";
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = "yellow";
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = "black";
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  // 몬스터 그리기
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.isDead) {
      monsters.splice(i, 1); // 이미 죽은 몬스터 제거
      continue;
    }

    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        // 게임 종료 시 서버로 gameOver 이벤트 전송
        await sendEvent(3, { userId, currentRound });
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monster.dead();
      monsters.splice(i, 1);
    }
  }

  // 타워 그리기 및 몬스터 공격 처리 //여기서 타워무슨 타워인지 알수 있음.
  towerControl.towers.forEach(async (tower) => {
    // 몬스터 관련 로직
    monsters.forEach((monster) => {
      if (monster.isDead) return; // 이미 죽은 몬스터는 무시

      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
      );
      if (distance < tower.range) {
        //여기서 뭔갈 해야함.(몬스터 뭐 스택 올리는거나. 그런거.)
        tower.attack(monster);
        if (monster.hp <= 0) {
          monster.dead();
          score += monsterLevel;
          userGold += 10;

          if (!tower.feverMode) {
            killCount += 1;
            console.log(`killCount: ${killCount}`); // 몬스터 처치 수 출력
          }

          if (ableToMoveRound) {
            monsterLevel += 1;
            ableToMoveRound = false;
          }
        }
      }
    });

    // 타워 그리기 & 마우스가 타워 위에 있을 때만 사정거리 표시하기
    tower.draw();
    tower.updateCooldown();
    if (tower.isMouseOver) {
      tower.drawRangeCircle();
    }
    // 타워를 클릭했을 때 자세히 보기 창을 띄우기
    if (tower.isClicked) {
      tower.showTowerInfo(tower);
    }
    // 자세히 보기 창에서 업그레이드 버튼을 클릭했을 때
    if (
      tower.isClicked &&
      tower.upgradeBtnClicked &&
      userGold >= tower.cost * 1.5
    ) {
      const upgradePrice = tower.upgradeTower(tower, userGold);
      userGold -= upgradePrice; // 업그레이드 비용 차감
      tower.upgradeBtnClicked = false;
    } else if (tower.upgradeBtnClicked && userGold < tower.cost * 1.5) {
      console.log("Not enough gold to upgrade the tower.");
      tower.upgradeBtnClicked = false;
    }
    // 자세히 보기 창에서 판매 버튼을 클릭했을 때
    if (tower.isClicked && tower.sellBtnClicked) {
      const sellPrice = tower.sellTower(tower);
      userGold += sellPrice; // 타워 판매 시 골드 추가
      tower.sellBtnClicked = false;
    }
  });

  // 피버 타임 시작
  if (!feverTriggered && killCount === maxRage) {
    towerControl.towers.forEach(async (tower) => {
      feverTriggered = true;
      console.log("fever time start");
      await tower.feverTime();
      console.log("fever time end");
      killCount = 0; // killCount 초기화
      ableToMoveRound = true;

      // 피버 모드가 끝난 후 플래그 초기화
      setTimeout(() => {
        feverTriggered = false;
      }, 5000); // feverTime 메서드 실행 시간과 일치하도록 설정
    });
  }

  // 미리보기 타워 그리기
  if (isPlacingTower && previewTower) {
    const isMouseOver = true;
    previewTower.draw();
    previewTower.drawRangeCircle();
  }

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);
  base.selfHeal();

  // 인벤토리 그리기
  towerControl.drawqueue(ctx, canvas);

  // 피버 게이지바 그리기
  gageBar.drawBG();
  gageBar.draw();

  // console.log(`previewTower: ${previewTower}`);

  // TO DO : 피버타임 때?
  // 캔버스 한 번 지워주기

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return; // 이미 초기화된 경우 방지
  }

  isInitGame = true;
  userGold = 1000; // 초기 골드 설정
  score = 0;
  monsterLevel = 1;
  monsterSpawnInterval = 2000;

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 경로 그리기)
  // placeInitialTowers(); // 초기 타워 배치
  placeBase(); // 기지 배치
  setInterval(spawnMonster, monsterSpawnInterval); // 주기적으로 몬스터 생성
  gameLoop(); // 게임 루프 시작
} //이게 시작이네.

if (!isInitGame) {
  initGame();
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImages.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  ),
]).then(() => {
  let somewhere = localStorage.getItem("authToken");

  socket = io("http://localhost:8080", {
    auth: {
      token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
    },
  });

  socket.on('response', (data) => {
    console.log(data);
  });
  
  socket.on('connection', (data) => {
    console.log('connection: ', data);
  
    if(data.message){
      console.log(data.message);
    }
  });

  console.log("a");
  //서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다!
  //e.g. serverSocket.on("...", () => {...});
  //이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다!
 
});

// 타워를 설치할 수 있는지 판별하는 함수
function canPlaceTower(x, y) {
  const towerWidth = previewTower ? previewTower.width : 0;
  const towerHeight = previewTower ? previewTower.height : 0;

  const newTowerCenterX = x + towerWidth / 2;
  const newTowerCenterY = y + towerHeight / 2;

  for (const tower of towerControl.towers) {
    if (Math.abs(tower.x - x) < 1 && Math.abs(tower.y - y) < 1) {
      console.log("Cannot place tower: duplicate position.");
      return false;
    }

    const towerCenterX = tower.x + tower.width / 2;
    const towerCenterY = tower.y + tower.height / 2;

    const distance = Math.sqrt(
      Math.pow(towerCenterX - newTowerCenterX, 2) +
        Math.pow(towerCenterY - newTowerCenterY, 2)
    ).toFixed(2); // 소수점 둘째 자리까지 반올림

    console.log("Distance between towers:", distance);

    // 두 타워의 중심 간 거리가 타워 너비 이상이어야 설치 가능
    if (distance < 250) {
      console.log("Cannot place tower: overlaps with another tower.");
      return false;
    }
  }

  // 경계 확인
  const withinBounds =
    x >= 0 &&
    y >= 0 &&
    x + towerWidth <= canvas.width &&
    y + towerHeight <= canvas.height;

  if (!withinBounds) {
    console.log("Cannot place tower: out of bounds.");
    return false;
  }

  return true;
}

// 타워 미리보기 상태일 때 마우스 이동 이벤트 처리
canvas.addEventListener("mousemove", (event) => {
  //타워의 미리보기 위치
  if (isPlacingTower && previewTower) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 미리보기 타워의 위치를 마우스 위치에 맞게 설정
    previewTower.x = mouseX - previewTower.width / 2;
    previewTower.y = mouseY - previewTower.height / 2;
  }
});

// 타워 미리보기 상태일 때 마우스 클릭 이벤트 처리
canvas.addEventListener("click", (event) => {
  if (isPlacingTower && previewTower) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (canPlaceTower(mouseX, mouseY)) {
      // 타워 설치
      previewTower.x = mouseX - previewTower.width / 2;
      previewTower.y = mouseY - previewTower.height / 2;
      towerControl.towers.push(previewTower);

      console.log("Tower placed at:", previewTower.x, previewTower.y);
      console.log("All towers:", towerControl.towers);

      // 설치 후 초기화
      isPlacingTower = false;
      towerControl.towerqueue.splice(towerIndex, 1); // 인벤토리에서 타워 제거
      previewTower = null;
      towerImage = null;
      towerCost = null;
      // isPreview = false;
      document.body.style.cursor = "default";
    } else {
      console.log("해당 위치에 타워를 설치할 수 없습니다!");
    }
  }
});

// 타워 미리보기 상태일 때 우클릭으로 타워 배치 취소
canvas.addEventListener("contextmenu", (event) => {
  if (isPlacingTower && previewTower) {
    event.preventDefault(); // 우클릭 기본 메뉴 방지
    isPlacingTower = false;
    previewTower = null;
    document.body.style.cursor = "default"; // 커서 복원
    userGold += towerCost; // 골드 반환
    towerImage = null;
    towerCost = null;
    // isPreview = false;
  }
});

// 타워 이미지 위로 마우스를 올렸을 때 이벤트 처리
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  towerControl.towers.forEach((tower) => {
    const isMouseOverTower =
      mouseX >= tower.x &&
      mouseX <= tower.x + tower.width &&
      mouseY >= tower.y &&
      mouseY <= tower.y + tower.height;

    if (isMouseOverTower) {
      tower.isMouseOver = true;
    } else {
      tower.isMouseOver = false;
    }
  });
});

// 타워 정보창 관련 변수
let activeTowerInfo = null;
// 타워 이미지를 클릭했을 때 정보창 열기 & 이미지 바깥을 누르면 닫기
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (activeTowerInfo) {
    const infoX = activeTowerInfo.x;
    const infoY = activeTowerInfo.y;
    // 클릭이 정보창 외부인지 확인
    const isOutsideInfo =
      mouseX < infoX ||
      mouseX > infoX + 180 ||
      mouseY < infoY ||
      mouseY > infoY + 150;

    // 업그레이드 버튼
    if (
      mouseX >= infoX + 10 &&
      mouseX <= infoX + 90 &&
      mouseY >= infoY + 100 &&
      mouseY <= infoY + 120
    ) {
      console.log("Upgrade button clicked");
      const tower = towerControl.towers.find((tower) => tower.isClicked);
      if (tower) {
        tower.upgradeBtnClicked = true;
      }
      activeTowerInfo = null; // 정보창 닫기
      return; // 다른 처리를 막기 위해 종료
    }

    // 판매 버튼
    if (
      mouseX >= infoX + 110 &&
      mouseX <= infoX + 160 &&
      mouseY >= infoY + 100 &&
      mouseY <= infoY + 120
    ) {
      console.log("Sell button clicked");
      const tower = towerControl.towers.find((tower) => tower.isClicked);
      if (tower) {
        tower.sellBtnClicked = true;
      }
      activeTowerInfo = null; // 정보창 닫기
      return; // 다른 처리를 막기 위해 종료
    }

    if (isOutsideInfo) {
      towerControl.towers.forEach((tower) => {
        tower.isClicked = false; // 타워 클릭 상태 비활성화
      });
      activeTowerInfo = null; // 정보창 닫기
      return; // 정보창 외부 클릭만 처리
    }
  }

  towerControl.towers.forEach((tower) => {
    const isClicked =
      mouseX >= tower.x &&
      mouseX <= tower.x + tower.width &&
      mouseY >= tower.y &&
      mouseY <= tower.y + tower.height;

    if (isClicked) {
      activeTowerInfo = { x: tower.x - tower.width - 10, y: tower.y }; // 정보창 위치
      tower.isClicked = true; // 현재 타워 클릭 상태
      console.log("Tower clicked:", tower);
    } else {
      tower.isClicked = false; // 다른 타워 클릭 상태 초기화
    }
  });
});

// 인벤토리 클릭
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const queueY = canvas.height - 180; // 인벤토리 Y 위치
  const towerWidth = 220 / 1.5;
  const towerHeight = 270 / 1.5;
  const towerPadding = 160;
  let currentX = 60;

  // 인벤토리 클릭 감지
  if (mouseY >= queueY) {
    towerControl.towerqueue.forEach((tower, index) => {
      if (
        mouseX >= currentX &&
        mouseX <= currentX + towerWidth &&
        mouseY >= queueY &&
        mouseY <= queueY + towerHeight
      ) {
        // 타워를 선택하고 설치 모드 활성화
        if (userGold >= tower.cost) {
          // isPreview = true;
          userGold -= tower.cost;
          previewTower = towerControl.buyqueueTower(0, 0, index); // 선택된 타워 생성
          if (!previewTower) {
            console.error("Failed to create preview tower.");
            return;
          }
          towerImage = previewTower.image;
          towerCost = previewTower.cost;
          towerIndex = index;
          isPlacingTower = true; // 설치 모드 활성화
          document.body.style.cursor = "crosshair"; // 커서 변경
        } else {
          console.log("골드가 부족합니다!");
        }
      }
      currentX += towerWidth + towerPadding; // 다음 타워 위치로 이동
    });
  }
});
