import { Base } from './base.js';
import { Monster } from './monster.js';
import towerData from '../assets/tower.json' with { type: 'json' };
import monsterData from '../assets/monster.json' with { type: 'json' };
import monsterUnlockData from '../assets/monster_unlock.json' with { type: 'json' };
import { TowerControl } from './towerControl.js';
import { sendEvent } from './socket.js';
import { initModal, showModal } from './webpages/modals/gameOverModal.js';
import { drawGridAndPath, generatePath } from './path.js';
// import {} from './modals/gameOverModal.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = { WIDTH: 280 / 2.5, HEIGHT: 320 / 2.5 };

const startPoint = { x: 0, y: 0 };
const endPoint = { x: 16, y: 4 };
const path = generatePath(startPoint, endPoint);

// 게임 실행 관련 변수
let isGameRun = false;
let gameLoopId;

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 10; // 기지 체력

// 시간 변수
let deltaTime = 0;
let lastFrameTime = 0;
export let accumulatedTime = 0;

// 타워 관련 변수
let towerCost; // 타워 구입 비용
let towerImage; // 타워 이미지
let towerIndex; // 타워 인덱스
let numOfInitialTowers = 3; // 초기 타워 개수
let isPlacingTower = false; // 현재 타워를 배치 중인지 확인하는 플래그
let previewTower = null; // 미리보기를 위한 타워 객체

// 메시지 출력 플래그
let printMessage = false;
let printMessage2 = false;

const monsters = [];
let ableToMoveRound = false; // 라운드 이동 가능 여부
let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 3; // 몬스터 생성 주기 ms
let killCount = 0; // 몬스터 처치 수
let feverTriggered = false; // 피버 모드 실행 여부를 확인하는 플래그

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;
let userData = null;

// 상수 정의
const TOWER_CONFIG = towerData.data;
const MONSTER_CONFIG = monsterData.data;
const MONSTER_UNLOCK_CONFIG = monsterUnlockData.data;

// 경로를 저장할 배열
let paths = [];
// 몬스터의 죽음을 기록할 배열. 라운드마다 보네주고 초기화.
let daethSheets = [];

// 이미지 로딩 파트
const towerImages = TOWER_CONFIG.map((tower) => {
	return { imageSet: tower.imageSet, id: tower.id };
});

const baseImage = new Image();
baseImage.src = './images/base.png';

export const towerControl = new TowerControl(ctx, towerImages);

// 피버 타임 게이지바 너비 계수
const gageBarWidthCoeff = 10;
const maxRage = 20;
let gageBarWidth = maxRage * gageBarWidthCoeff;

const gageBar = {
	x: 20,
	y: 20,
	maxWidth: maxRage * gageBarWidthCoeff,
	width: maxRage * gageBarWidthCoeff,
	height: 40,
	drawBG() {
		ctx.fillStyle = '#F5F5F5';
		ctx.fillRect(this.x, this.y, this.maxWidth, this.height);
	},
	draw() {
		const my_gradient = ctx.createLinearGradient(0, this.y, 0, this.y + this.height); // gradient

		my_gradient.addColorStop(0, '#E3AFAF');
		my_gradient.addColorStop(0.5, '#E30000');
		my_gradient.addColorStop(1, '#E30000');

		ctx.fillStyle = my_gradient;
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.fillRect(this.x, this.y, killCount * gageBarWidthCoeff, this.height);
		ctx.strokeRect(this.x, this.y, this.maxWidth, this.height);
	},
};

let monsterPath;

const eventQueue = []; // 이벤트 큐 센드 이벤트

export function queueEvent(handlerId, payload) {
	eventQueue.push({ handlerId, payload });
}

function processQueue() {
	if (eventQueue.length > 0) {
		const event = eventQueue.shift(); // 큐에서 첫 번째 이벤트 제거
		sendEvent(event.handlerId, event.payload); // 서버로 이벤트 전송
	}
}

setInterval(processQueue, 10); //10ms마다 처리. 따라서 이벤트가 한없이 쌓이면 좀 버거움.

function setMonsterPathFromGeneratedPath() {
	// generatePath 결과를 기반으로 몬스터 경로 설정
	const generatedPath = path;
	if (!generatedPath || generatedPath.length === 0) {
		console.error('Path generation failed or empty.');
		return [];
	}

	// 캔버스 좌표로 변환
	return generatedPath.map((point) => ({
		x: point.x * cellSize.WIDTH,
		y: point.y * cellSize.HEIGHT,
	}));
}

function initMap() {
	// 배경 이미지 그리기
	paths = setMonsterPathFromGeneratedPath();
	drawGridAndPath(ctx, cellSize, paths);
}

function placeBase() {
	//플레이어 베이스를 만드는 함수.
	const lastPoint = path[path.length - 1];
	if (lastPoint) {
		base = new Base(lastPoint.x * cellSize.WIDTH, lastPoint.y * cellSize.HEIGHT, baseHp);
		base.draw(ctx, baseImage);
	} else {
		console.log('path is not defined');
	}
}

//실질적인 몬스터 소환 함수
export function spawnMonster() {
	if (!isGameRun) return; // 게임 정지 상태일 때는 return

	if (!userData) {
		console.error('유저 데이터를 찾을 수 없습니다.');
		return;
	}

	// userData.round 대신 전역 round 변수 사용
	const currentRound = round;
	let availableMonsters;

	if (currentRound >= 6) {
		// 6라운드 이상이면 모든 몬스터 타입 춣현
		availableMonsters = MONSTER_CONFIG;
	} else {
		// 6라운드 미만이면 현재 라운드에 맞는 몬스터만 출현
		const roundUnlock = MONSTER_UNLOCK_CONFIG.find((data) => data.round_id === currentRound);

		if (!roundUnlock) {
			console.error('현재 라운드에 출현 가능한 몬스터가 없습니다.');
			return;
		}

		// 현재 라운드에 출현 가능한 몬스터 필터링
		availableMonsters = MONSTER_CONFIG.filter((monster) =>
			roundUnlock.monster_id.includes(monster.id),
		);
	}

	monsters.push(new Monster(monsterPath, currentRound, availableMonsters));
}

let previousTime = null;
let isRoundExpired = false;

async function gameLoop(frameTime) {
	if (!isGameRun) return;
	// 캔버스 새로 그리기
	ctx.textAlign = 'left';
	drawGridAndPath(ctx, cellSize, paths);
	setMonsterPathFromGeneratedPath(); // 경로 다시 그리기

	if (previousTime === null) {
		previousTime = Date.now();
		requestAnimationFrame(gameLoop);
	}
	const currentTime = Date.now();
	const deltaTime2 = currentTime - previousTime;
	previousTime = currentTime;

	if (!isRoundExpired) {
		round_timer -= deltaTime2;
		if (round_timer <= 0) {
			isRoundExpired = true;
			await sendEvent(11, { currentRound: round, timestamp: Date.now(), daethSheets });
			daethSheets = [];
		}
	}
	//게임 반복.
	// ctx.clearRect(0, 0, canvas.width, canvas.height);

	deltaTime = (frameTime - lastFrameTime) / 1000 || 0;
	// 마지막으로 기록된 frameTime(직전 frameTime)
	lastFrameTime = frameTime;
	// 총 누적 시간
	accumulatedTime += deltaTime;

	// 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
	// // 그리드 생성 및 호출
	drawGridAndPath(ctx, cellSize, path);

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
				const response = await sendEvent(3, { currentRound: round, timestamp: currentTime });
				const { message, userName, highScore, time } = response;
				console.log(
					'message : ',
					message,
					'userName : ',
					userName,
					'highScore : ',
					highScore,
					'time : ',
					time,
				);
				showModal(message, userName, highScore, 1, time);

				// 게임 오버 시 몬스터/타워 등 로직 멈추게 하기
				stopGame();
			}
			monster.draw(ctx);
		} else {
			/* 몬스터가 죽었을 때 */
			monster.dead();
			monsters.splice(i, 1);
		}
	}

	// towers 배열 정렬하기(아래쪽에 그려진 타워일수록 나중에 그려지게 하려고)
	towerControl.sortTowers();

	// 타워 그리기 및 몬스터 공격 처리 //여기서 타워무슨 타워인지 알수 있음.
	towerControl.towers.forEach((tower) => {
		// 몬스터 관련 로직
		monsters.forEach((monster) => {
			if (monster.isDead) return; // 이미 죽은 몬스터는 무시

			const distance = Math.sqrt(
				Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
			);
			if (distance < tower.range) {
				// 몬스터가 있는 그리드의 좌표 구하기

				tower.attack(monster);

				if (monster.hp <= 0) {
					daethSheets.push({
						killer: 'killtower',
						x: tower.x,
						y: tower.y,
						monsterId: monster.uniqueId,
						monsterHp: monster.maxHp,
						monsterGold: monster.gold,
						monsterX: monster.x,
						monsterY: monster.y,
						monsterTimestemp: Date.now(),
					});
					monster.dead();
					score += monsterLevel;
					userGold += monster.gold;

					console.log(`${monster.gold}골드를 획득했습니다.`);
					queueEvent(8, { gold: monster.gold });

					if (!tower.feverMode && !feverTriggered) {
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
		if (tower.isMouseOver) {
			tower.drawRangeCircle();
		}
		tower.draw();
		tower.updateCooldown();
	});

	// 타워 자세히 보기창 그리기
	towerControl.towers.forEach(async (tower) => {
		// 타워를 클릭했을 때 자세히 보기 창을 띄우기
		if (tower.isClicked) {
			tower.showTowerInfo();
		}
		// 자세히 보기 창에서 업그레이드 버튼을 클릭했을 때
		if (
			tower.isClicked &&
			tower.upgradeBtnClicked &&
			userGold >= tower.cost * 1.2 &&
			towerControl.towerqueue.filter((t) => t.type === tower.type).length >= 2
		) {
			const upgradePrice = tower.upgradeTower(tower, userGold); //업그레이드.
			userGold -= upgradePrice; // 업그레이드 비용 차감
			tower.upgradeBtnClicked = false;
			tower.isClicked = false;
			towerControl.getTowerqueue(monsterLevel);
		} else if (tower.isClicked && tower.upgradeBtnClicked && userGold < tower.cost * 1.2) {
			console.log('Not enough gold to upgrade the tower.');
			printMessage = true;
			tower.upgradeBtnClicked = false;
			tower.isClicked = false;
		} else if (
			tower.isClicked &&
			tower.upgradeBtnClicked &&
			userGold >= tower.cost * 1.2 &&
			towerControl.towerqueue.filter((t) => t.type === tower.type).length < 2
		) {
			printMessage2 = true;
			tower.upgradeBtnClicked = false;
			tower.isClicked = false;
		}

		if (printMessage) {
			ctx.font = 'bold 25px Arial';
			ctx.fillStyle = '#FF2929';
			ctx.fillText('돈이 모자라요!', tower.x, tower.y);
			// ctx.strokeStyle = '#1B1833';
			// ctx.strokeText('돈이 모자라요!', tower.x, tower.y);

			setTimeout(() => {
				printMessage = false;
			}, 1500);
		}
		if (printMessage2) {
			ctx.font = 'bold 25px Arial';
			ctx.fillStyle = '#FF2929';
			ctx.fillText('재료가 부족해요!', tower.x, tower.y - 10);
			// ctx.strokeStyle = '#1B1833';
			// ctx.strokeText('재료가 부족해요!', tower.x, tower.y - 10);

			setTimeout(() => {
				printMessage2 = false;
			}, 1500);
		}

		// 자세히 보기 창에서 판매 버튼을 클릭했을 때
		if (tower.isClicked && tower.sellBtnClicked) {
			const sellPrice = tower.sellTower(tower);
			userGold += sellPrice; // 타워 판매 시 골드 추가
			tower.sellBtnClicked = false;
			tower.isClicked = false;
		}
	});

	// 피버 타임 시작
	if (!feverTriggered && killCount === maxRage) {
		towerControl.towers.forEach(async (tower) => {
			feverTriggered = true;
			console.log('fever time start');

			// 피버 타임 메서드 호출(5초 동안 실행)
			await tower.feverTime();
			console.log('fever time end');
			killCount = 0; // killCount 초기화
			ableToMoveRound = true;

			feverTriggered = false;
			base.selfHeal();
		});
	}

	if (feverTriggered) {
		// 피버 타임 알림 문구 띄우기
		towerControl.towers.forEach((tower) => {
			ctx.fillStyle = '#FF3F00';
			ctx.font = 'bold 20px Arial';
			ctx.fillText('고양이 파워!', tower.x + 5, tower.y + tower.height);
		});
	}

	// 미리보기 타워 그리기
	if (isPlacingTower && previewTower) {
		previewTower.draw();
		previewTower.drawRangeCircle();

		if (previewTower.isInvalidPlacement) {
			ctx.fillStyle = '#D91656';
			ctx.font = 'bold 20px Arial';
			ctx.fillText('너무 가까워요!', previewTower.x, previewTower.y - 10);
		}
	}

	// 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
	base.draw(ctx, baseImage);
	//base.selfHeal(currentTime);

	// 인벤토리 그리기
	if (towerControl.towerqueue.length < 5) {
		await towerControl.getTowerqueue(monsterLevel);
	}

	towerControl.drawqueue(ctx, canvas, monsterLevel);

	// 유저 UI창
	// ctx.fillStyle = 'white';
	// ctx.fillRect(canvas.width - 250, canvas.height - 180, 200, 100);
	ctx.font = '25px Times New Roman';
	ctx.fillStyle = '#074799';
	ctx.fillText(`최고 기록: ${highScore}`, canvas.width - 250, canvas.height - 30); // 최고 기록 표시
	ctx.fillStyle = 'white';
	ctx.fillText(`점수: ${score}`, canvas.width - 250, canvas.height - 80); // 현재 스코어 표시
	ctx.fillStyle = 'yellow';
	ctx.fillText(`골드: ${userGold}`, canvas.width - 250, canvas.height - 110); // 골드 표시
	ctx.fillStyle = 'black';
	ctx.fillText(`현재 레벨: ${monsterLevel}`, canvas.width - 250, canvas.height - 160); // 최고 기록 표시

	// 피버 게이지바 그리기
	gageBar.drawBG();
	gageBar.draw();

	ctx.font = '40px Times New Roman';
	ctx.strokeStyle = '#000000';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.strokeText(
		`${round}라운드     남은 시간: ${Math.round(round_timer / 1000)}`,
		canvas.width / 2,
		50,
	);
	ctx.fillText(
		`${round}라운드     남은 시간: ${Math.round(round_timer / 1000)}`,
		canvas.width / 2,
		50,
	);

	// TO DO : 피버타임 때?
	// 캔버스 한 번 지워주기

	gameLoopId = requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

export async function initGame(receivedUserData, getReset = false) {
	if ((isInitGame && !getReset) || !receivedUserData) {
		return; // 이미 초기화된 경우 방지
	}

	if (getReset) isInitGame = false; // resetGame으로 강제 초기화

	userData = receivedUserData;
	isInitGame = true;
	isGameRun = true;

	userGold = 800; // 초기 골드 설정
	score = 0;
	monsterLevel = 1;
	//monsterSpawnInterval = 2000;

	console.log('userData: ', userData);

	//monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
	monsterPath = setMonsterPathFromGeneratedPath();
	//await initModal();

	if (monsterPath.length === 0) {
		console.error('monsterPath is not defined');
		return;
	}

	initMap(); // 맵 초기화 (배경, 경로 그리기)
	// placeInitialTowers(); // 초기 타워 배치
	placeBase(); // 기지 배치
	//setInterval(spawnMonster, monsterSpawnInterval); // 주기적으로 몬스터 생성
	// 서버에 몬스터 스폰 주기와 타이밍 동기화
	queueEvent(13, { round: 0, timestamp: Date.now() });
	gameLoop(); // 게임 루프 시작

	await initModal(); // 게임오버 모달창 초기 로드
} //이게 시작이네.

// 게임 리셋
export function resetGame() {
	console.log('Reset Game!');

	// 게임 루프 중단
	isGameRun = false;
	cancelAnimationFrame(gameLoopId);

	// 게임 상태 초기화
	monsters.length = 0;
	towerControl.towers.length = 0;
	userGold = 0;
	baseHp = 10;
	score = 0;
	killCount = 0;
	monsterLevel = 1;
	feverTriggered = false;

	// 몬스터 스폰 초기화
	sendEvent(12, {});
	eventQueue.length = 0;

	// 캔버스 초기화
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 게임 재시작
	initGame(userData, true);
}

// 게임 스탑
function stopGame() {
	console.log('Stop Game!');

	// 게임 루프 중단
	isGameRun = false;
	cancelAnimationFrame(gameLoopId);
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
	new Promise((resolve) => (towerImages.onload = resolve)),
	new Promise((resolve) => (baseImage.onload = resolve)),
	// ...monsterImages.map(
	//   (img) => new Promise((resolve) => (img.onload = resolve))
	// ),
]).then(() => {});

// 타워를 설치할 수 있는지 판별하는 함수
function canPlaceTower(x, y) {
	// 타워 설치 중이 아니라면 return false
	if (!isPlacingTower || !previewTower) {
		return false;
	}

	// 몬스터 공격로에 설치하려고 하면 return false
	const isOnPath = path.some((pathCell) => pathCell.x === x && pathCell.y === y);
	previewTower.isInvalidPlacement = isOnPath;
	if (previewTower.isInvalidPlacement) {
		console.log('Cannot place tower: on path.');
		return false;
	}

	// 이미 타워가 설치된 곳에 설치하려고 하면 return false
	const isOnExistingTower = towerControl.towers.some((tower) => {
		const towerCellX = Math.floor(tower.x / cellSize.WIDTH);
		const towerCellY = Math.floor(tower.y / cellSize.HEIGHT);
		return towerCellX === x && towerCellY === y;
	});
	previewTower.isInvalidPlacement = isOnExistingTower;
	if (previewTower.isInvalidPlacement) {
		console.log('Cannot place tower: position occupied by another tower.');
		return false;
	}

	// 경계 확인
	const towerWidth = previewTower.width;
	const towerHeight = previewTower.height;
	const cellWidth = canvas.width / cellSize.WIDTH;
	const cellHeight = canvas.height / cellSize.HEIGHT;

	const withinBounds =
		x >= 0 &&
		y >= 0 &&
		x + towerWidth / cellWidth <= cellSize.WIDTH &&
		y + towerHeight / cellHeight <= cellSize.HEIGHT;

	if (!withinBounds) {
		console.log('Cannot place tower: out of bounds.');
		return false;
	}

	return true;
}

// 타워 미리보기 상태일 때 마우스 이동 이벤트 처리
canvas.addEventListener('mousemove', (event) => {
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
canvas.addEventListener('click', async (event) => {
	if (isPlacingTower && previewTower) {
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// 클릭된 셀의 행과 열 계산
		const cellX = Math.floor(mouseX / cellSize.WIDTH);
		const cellY = Math.floor(mouseY / cellSize.HEIGHT);
		console.log(`클릭된 셀: (${cellX}, ${cellY})`);

		// 타워 설치가 가능할 때
		if (canPlaceTower(cellX, cellY)) {
			previewTower.x = cellSize.WIDTH * cellX;
			previewTower.y = cellSize.HEIGHT * cellY;
			towerControl.towers.push(previewTower);

			//타워 구매 - sendEvent
			await sendEvent(5, {
				type: previewTower.type,
				x: previewTower.x,
				y: previewTower.y,
				timestamp: Date.now(),
				index: towerIndex,
			});

			towerControl.getTowerqueue(monsterLevel);
			console.log('Tower placed at:', previewTower.x, previewTower.y);
			console.log('All towers:', towerControl.towers);

			// 설치 후 초기화
			isPlacingTower = false;
			towerControl.towerqueue.splice(towerIndex, 1); // 인벤토리에서 타워 제거
			previewTower = null;
			towerImage = null;
			towerCost = null;
			// isPreview = false;
			document.body.style.cursor = 'default';
		} else {
			previewTower.isInvalidPlacement = true;
			console.log('해당 위치에 타워를 설치할 수 없습니다!');
		}
	}
});

// 타워 미리보기 상태일 때 우클릭으로 타워 배치 취소
canvas.addEventListener('contextmenu', (event) => {
	if (isPlacingTower && previewTower) {
		event.preventDefault(); // 우클릭 기본 메뉴 방지
		isPlacingTower = false;
		previewTower = null;
		document.body.style.cursor = 'default'; // 커서 복원
		userGold += towerCost; // 골드 반환
		towerImage = null;
		towerCost = null;
		// isPreview = false;
	}
});

// 타워 이미지 위로 마우스를 올렸을 때 이벤트 처리
canvas.addEventListener('mousemove', (event) => {
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
// 타워 이미지를 클릭했을 때 정보창 열기 & 바깥을 누르면 닫기
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	if (activeTowerInfo) {
		const infoX = activeTowerInfo.x;
		const infoY = activeTowerInfo.y;
		// 클릭이 정보창 외부인지 확인
		const isOutsideInfo =
			mouseX < infoX || mouseX > infoX + 170 || mouseY < infoY || mouseY > infoY + 130;

		// 업그레이드 버튼
		if (
			mouseX >= infoX + 10 &&
			mouseX <= infoX + 90 &&
			mouseY >= infoY + 100 &&
			mouseY <= infoY + 120
		) {
			console.log('Upgrade button clicked');
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
			console.log('Sell button clicked');
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
			activeTowerInfo = { x: tower.x + tower.width + 10, y: tower.y }; // 정보창 위치
			tower.isClicked = true; // 현재 타워 클릭 상태
			console.log('Tower clicked:', tower);
		} else {
			tower.isClicked = false; // 다른 타워 클릭 상태 초기화
		}
	});
});

// 인벤토리 클릭
canvas.addEventListener('click', (event) => {
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
						console.error('Failed to create preview tower.');
						return;
					}
					towerImage = previewTower.image;
					towerCost = previewTower.cost;
					towerIndex = index;
					isPlacingTower = true; // 설치 모드 활성화
					document.body.style.cursor = 'crosshair'; // 커서 변경
				} else {
					printMessage = true;
					console.log('골드가 부족합니다!');
				}
			}
			currentX += towerWidth + towerPadding; // 다음 타워 위치로 이동
		});
	}
});

let round = 0;
let spawn_count = 0;
let round_timer = 0;
let roundUnlock = null;

export function setRound(roundInfo, unlockMonsters) {
	round = roundInfo.round;
	monsterSpawnInterval = roundInfo.duration;
	spawn_count = roundInfo.count;
	round_timer = roundInfo.time;
	roundUnlock = unlockMonsters;
	isRoundExpired = false;
}
