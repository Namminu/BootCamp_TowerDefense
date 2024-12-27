// 여기선 유저의 타워를 확인하고, 골드를 확인하고, 몬스터 잡을때 그 타워의 거리를 확인함.
// 여기서 유저 골드도 확인해야 할듯. 알맞게 설치가 되고 있는지.
// 몬스터 잡을때 올리면 되고.
import { getGameAssets } from '../init/assets.js';
import {
	getTower,
	getTowerQueue,
	removeTower,
	removeTowerQueue,
	setTower,
	setTowerQueue,
	upTower,
} from '../models/tower.model.js';
import { getUserData, setUserGold } from '../models/userData.model.js';

/*타워를 구입할때, 인벤토리에 타워가 있는지, 설치하는 위치는 다른타워와 겹치지 않는지, 돈은있는지 등을
  확인하고 그 뒤 서버에 타워 정보를 저장해 둡니다.*/
export const buyTower = (userId, payload, socket) => {
	const { tower } = getGameAssets();
	const currentUserData = getUserData(userId);
	let currentTowersQueue = getTowerQueue(userId);
	const selectedTower = tower.data.find((tower) => tower.type === payload.type);
	const selectedTowerInQueue = currentTowersQueue[payload.index];

	if (selectedTowerInQueue && selectedTowerInQueue.towerDataIndex === selectedTower.type) {
		if (!selectedTower) {
			return { status: 'fail', message: '타워를 찾을 수 없음' };
		}

		if (currentUserData.gold < selectedTower.cost) {
			return { status: 'fail', message: '돈이 부족함' };
		}
	}

	const towerWidth = 220 / 1.5;
	const towerHeight = 270 / 1.5;
	const newTowerCenterX = payload.x + towerWidth / 2;
	const newTowerCenterY = payload.y + towerHeight / 2;

	let currentTowers = getTower(userId);

	for (const tower of currentTowers) {
		const towerCenterX = tower.x + tower.width / 2;
		const towerCenterY = tower.y + tower.height / 2;

		const distance = Math.sqrt(
			Math.pow(towerCenterX - newTowerCenterX, 2) + Math.pow(towerCenterY - newTowerCenterY, 2),
		);

		// 두 타워의 중심 간 거리가 타워 너비 이상이어야 설치 가능
		if (distance < 250) {
			return { status: 'fail', message: '타워가 겹쳐서 설치할 수 없습니다.' };
		}
	}

	removeTowerQueue(userId, payload.index);

	currentUserData.gold -= selectedTower.cost;

	console.log('currentUserData.gold:', currentUserData.gold);

	setUserGold(userId, currentUserData.gold);
	setTowerQueue(userId, tower);
	setTower(userId, payload.type, payload.x, payload.y, 1, payload.timestamp);

	return { status: 'success', message: '타워 배치 성공적.' };
};

/*타워 판매시, 그 타워를 보유하고 있는지 확인하고 판매합니다. */
export const sellingTower = (userId, payload, socket) => {
	const { tower } = getGameAssets();
	const currentUserData = getUserData(userId);
	const currentTowers = getTower(userId);

	const matchingTower = currentTowers.find(
		(tower) => tower.x === payload.x && tower.y === payload.y && tower.type === payload.type,
	);

	if (!matchingTower) {
		return { status: 'fail', message: '타워정보가 다름.' };
	}

	const selectedTower = tower.data.find((tower) => tower.type === payload.type);

	const isRemoved = removeTower(userId, payload.x, payload.y);

	if (!isRemoved) {
		return { status: 'fail', message: '타워가 없음' };
	}

	currentUserData.gold += selectedTower.cost * 0.7;
	setUserGold(userId, currentUserData.gold);
	console.log('currentUserData.gold:', currentUserData.gold);

	return { status: 'success', message: '판매 완료.' };
};

/*타워 업그레이드시, 인벤토리에 타워가 있는지, 
그 타워를 보유하고 있는지, 레벨을 맞는지, 돈은 있는지 확인하고 업그레이드합니다. */
export const upgradeTower = (userId, payload, socket) => {
	const { tower } = getGameAssets();
	const currentUserData = getUserData(userId);
	const currentTowers = getTower(userId);
	const currentTowersQueue = getTowerQueue(userId);

	const matchingTower = currentTowers.find(
		(tower) => tower.x === payload.x && tower.y === payload.y && tower.type === payload.type,
	);

	if (!matchingTower) {
		return { status: 'fail', message: '타워정보가 다름.' };
	}

	const index = tower.data.findIndex((tower) => tower.type === matchingTower.type);

	const matchingTowerQueueIndex = currentTowersQueue.findIndex(
		(tower) => tower.towerDataIndex === index,
	);

	if (!matchingTowerQueueIndex) {
		return { status: 'fail', message: '타워가 인벤토리에 없음.' };
	}

	const matchingTowerData = tower.data[index];

	if (currentUserData.gold < 1.2 * matchingTowerData.cost) {
		return { status: 'fail', message: '돈 없음' };
	}

	currentUserData.gold -= 1.2 * matchingTowerData.cost;
	const isUpgrade = upTower(userId, payload.x, payload.y, payload.level); //이 레벨을 올라가고 싶은 레벨임. 안에서 레벨검증함.
	removeTowerQueue(userId, matchingTowerQueueIndex);
	setUserGold(userId, currentUserData.gold);
	setTowerQueue(userId, tower);

	if (!isUpgrade) {
		return { status: 'fail', message: '업그레이드 실패' };
	}

	return { status: 'success', message: '업그레이드 성공' };
};

// 데이터는 {attecker, hitEntity, x, y, timestemp}
export const atteckTower = (userId, payload, socket) => {};

export const killTower = (userId, payload, socket) => {
	//타워가 있는지 확인, 사거리가 되는지 확인,체력이 공격을 맞아 알맞게 피가 까였는지, 전부 가져와서 공격 속도가 되는지 확인, 성공시 다음으로.
	//애는 리스트를 받고, 그 리스트에 있는 타워를 한번에 가져온뒤(뭐 있음 그 목록안에 있는거만 가져오는. 아냐 타워 개수가 수천개 되는게 아니잖아. 그냥 해도 될듯.). 사거리, 공격 속도 확인.
};
