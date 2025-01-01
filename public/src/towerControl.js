import { Tower } from './tower.js';
import towerData from '../assets/tower.json' with { type: 'json' };
import { loadTowerQueue, sendEvent } from './socket.js';

export class TowerControl {
	constructor(ctx, towerImages) {
		this.id = 1;
		this.ctx = ctx; // 캔버스 컨텍스트
		this.canvas = ctx.canvas; // 캔버스
		this.towerImages = towerImages.map((ele) => ele.imageSet); // 타워 이미지 배열
		this.towerId = towerImages.map((ele) => ele.id); // 타워 이미지 아이디 배열
		this.towers = []; // 설치된 타워들을 관리하는 배열
		this.towerqueue = [];
		this.isUpdatingTowerQueue = false;
	}

	sortTowers() {
		this.towers.sort((a, b) => a.y - b.y);
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async getTowerqueue(monsterLevel) {
		if (this.isUpdatingTowerQueue) return; // 이미 업데이트 중이라면 반환
		this.isUpdatingTowerQueue = true;

		try {
			const TowerQueueType = await loadTowerQueue(); // [{type:},{type:},... 이런식으로 받습니다. 5개를 받습니다.]

			console.log('TowerQueueType', TowerQueueType);
			const newQueue = [];
			for (let i = 0; i < TowerQueueType.length; i++) {
				const towerType = TowerQueueType[i].towerDataIndex;
				const towerIndex = 1 + towerData.data.findIndex((tower) => tower.type === towerType); // 이새끼 뭐냐;; 이거 빼니까 작동을 안함.
				const img = await loadImage(this.towerImages[towerIndex].idle[0]);
				if (towerIndex !== -1) {
					newQueue.push({
						image: img,
						name: towerData.data[towerIndex].name,
						type: towerData.data[towerIndex].type,
						cost: towerData.data[towerIndex].cost,
					});
				}
			}
			this.towerqueue = newQueue;
			console.log('Updated towerqueue:', this.towerqueue);
			return this.towerqueue;
		} catch (error) {
			console.error('Failed to load tower queue:', error);
		} finally {
			this.isUpdatingTowerQueue = false; // 상태 해제
		}
	}

	drawqueue(ctx, canvas, monsterLevel) {
		// 인벤토리 관련 변수
		const towerPadding = 160; // 타워 간 간격
		const startX = 60; // 첫 번째 타워 시작 위치
		let currentX = startX;
		// 인벤토리 영역 설정
		const queueHeight = 200; // 인벤토리 높이
		const queueY = canvas.height - queueHeight; // 인벤토리 위치
		ctx.fillStyle = '#F0BB78';
		this.ctx.textAlign = 'left';
		ctx.fillRect(0, queueY - 15, canvas.width, queueHeight);

		const imageWidth = 220 / 1.5;
		const imageHeight = 270 / 1.5;
		const textOffsetX = 10; // 이미지 오른쪽으로 이동할 간격

		this.towerqueue.forEach((tower, index) => {
			ctx.drawImage(tower.image, currentX, queueY, imageWidth, imageHeight);

			ctx.font = 'bold 16px Arial';
			ctx.fillStyle = 'Black';

			// 이름 텍스트
			ctx.fillText(
				`${tower.name}`,
				currentX + imageWidth + textOffsetX, // 이미지 오른쪽
				queueY + 100, // 세 번째 줄 (간격 추가)
			);

			// 구매 비용 텍스트
			ctx.fillText(
				`구매: ${tower.cost}G`,
				currentX + imageWidth + textOffsetX, // 이미지 오른쪽
				queueY + 40, // 이미지 높이에 맞게 조정
			);

			// 업그레이드 비용 텍스트
			ctx.fillText(
				`업그레이드: ${tower.cost * 1.6}G`,
				currentX + imageWidth + textOffsetX, // 이미지 오른쪽
				queueY + 70, // 두 번째 줄 (간격 추가)
			);

			// 영역 업데이트
			currentX += imageWidth + towerPadding;
		});
	}

	buyqueueTower(x, y, queueIndex) {
		const towerName = this.towerqueue[queueIndex].name;
		const index = towerData.data.findIndex((data) => data.name === towerName);

		// const image = this.towerImages[index];
		const imageSet = this.towerImages[index];
		const damage = towerData.data[index].damage;
		const range = towerData.data[index].range;
		const cooldown = towerData.data[index].cooldown;
		const cost = towerData.data[index].cost;
		const type = towerData.data[index].type;
		const id = this.id;
		const newTower = new Tower(this.ctx, x, y, damage, range, cooldown, cost, imageSet, type, id);

		this.id++;

		return newTower;
	}

	addTower(x, y) {
		const index = this.getRandomNumber(0, this.towerImages.length - 1);
		const image = this.towerImages[index];
		const damage = towerData.data[index].damage;
		const range = towerData.data[index].range;
		const cooldown = towerData.data[index].cooldown;
		const cost = towerData.data[index].cost;
		const type = towerData.data[index].type;
		const id = this.id;
		const newTower = new Tower(this.ctx, x, y, damage, range, cooldown, cost, image, type, id);
		this.towers.push(newTower);

		this.id++;

		return newTower;
	}

	drawAndUpdateTowers() {
		this.towers.forEach((tower) => {
			tower.draw();
			tower.updateCooldown();
		});
	}

	attackMonstersInRange(monsters, score, userGold, monsterLevel) {
		this.towers.forEach((tower) => {
			monsters.forEach((monster) => {
				const distance = Math.sqrt(
					Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
				);
				if (distance < tower.range) {
					tower.attack(monster);
					if (monster.hp <= 0) {
						score += monsterLevel;
						userGold += 10;
					}
				}
			});
		});
	}
}

// 이미지 로딩 함수
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = src;
	});
}
