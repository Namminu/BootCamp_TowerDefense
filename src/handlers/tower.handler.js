// 여기선 유저의 타워를 확인하고, 골드를 확인하고, 몬스터 잡을때 그 타워의 거리를 확인함.
// 여기서 유저 골드도 확인해야 할듯. 알맞게 설치가 되고 있는지.
// 몬스터 잡을때 올리면 되고.
import { getGameAssets } from '../init/assets.js';
import {
	canRangeTower,
	setowerAttackSheet,
	getTower,
	getTowerQueue,
	removeTower,
	removeTowerQueue,
	setTower,
	setTowerQueue,
	upTower,
	getowerAttackSheet,
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

	const towerWidth = 100 / 1.5;
	const towerHeight = 100 / 1.5;
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
	console.log("현재 서버 골드:",currentUserData.gold);
	setUserGold(userId, currentUserData.gold);
	setTowerQueue(userId, tower);
	setTower(userId, payload.type, payload.x, payload.y, 1, selectedTower.damage, selectedTower.range, selectedTower.cooldown, selectedTower.cost, payload.timestamp);
	return { status: 'success', message: '타워 배치 성공적.' };
};

/*타워 판매시, 그 타워를 보유하고 있는지 확인하고 판매합니다. */
export const sellingTower = (userId, payload, socket) => {
	const currentUserData = getUserData(userId);
	const currentTowers = getTower(userId);

	const matchingTower = currentTowers.find(
		(tower) => tower.x === payload.x && tower.y === payload.y && tower.type === payload.type,
	);

	if (!matchingTower) {
		return { status: 'fail', message: '타워정보가 다름.' };
	}

	const isRemoved = removeTower(userId, payload.x, payload.y);

	if (!isRemoved) {
		return { status: 'fail', message: '타워가 없음' };
	}

	currentUserData.gold += matchingTower.cost * 0.7;
	setUserGold(userId, currentUserData.gold);
	console.log("현재 서버 골드:",currentUserData.gold);

	return { status: 'success', message: '판매 완료.' };
};

/*타워 업그레이드시, 인벤토리에 타워가 있는지, 
그 타워를 2개 이상 보유하고 있는지, 레벨을 맞는지, 돈은 있는지 확인하고 업그레이드합니다. */
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

	const matchingTowerQueueIndex = currentTowersQueue
		.map((tower, i) => (tower.towerDataIndex === index ? i : -1)) // 조건을 만족하는 인덱스 반환, 아니면 -1
		.filter((i) => i !== -1); // 유효한 인덱스만 필터링

	console.log("currentTowersQueue",currentTowersQueue);	
	console.log('matchingTowerQueueIndex', matchingTowerQueueIndex);
	
	if (matchingTowerQueueIndex.length < 2) {
		return { status: 'fail', message: '타워가 인벤토리에 없음.' };
	}

	const matchingTowerData = tower.data[index];

	if (currentUserData.gold < 1.2 * matchingTowerData.cost) {
		return { status: 'fail', message: '돈 없음' };
	}

	currentUserData.gold -= 1.2 * matchingTowerData.cost;
	const isUpgrade = upTower(userId, payload.x, payload.y, payload.level); //이 레벨을 올라가고 싶은 레벨임. 안에서 레벨검증함.

	for (let i = 1; i < 3; i++) {
		removeTowerQueue(userId, matchingTowerQueueIndex[matchingTowerQueueIndex.length - i]);
	}

	setUserGold(userId, currentUserData.gold);
	setTowerQueue(userId, tower);
	setUserGold(userId, currentUserData.gold);

	if (!isUpgrade) {
		return { status: 'fail', message: '업그레이드 실패' };
	}
	console.log("현재 서버 골드:",currentUserData.gold);
	return { status: 'success', message: '업그레이드 성공' };
};

// {atteckerX ,atteckerY, hitEntity, x, y, timestemp,} //피버 타임에 대해 고민하기.//여기는 맞은 위치x,y.
export const atteckTower = (userId, payload, socket) => {
	const currentTowers = getTower(userId);

	const matchingTower = currentTowers.find(
		(tower) => tower.x === payload.atteckerX && tower.y === payload.atteckerY,
	);

	if (!matchingTower) {
		return { status: 'fail', message: '어캐 때림? 이거 뜨면 꼭 알려주셈.' };
	}
	if (payload.feverTriggered) {
		matchingTower.range *=1.2;
		matchingTower.damage *=1.5;
	}
	
	const isatteck = canRangeTower(matchingTower.x ,matchingTower.y ,payload.x ,payload.y , matchingTower.range);

	if(!isatteck){
		return { status: 'fail', message: '고무고무 먹지마라' };
	}

	setowerAttackSheet( userId, payload.atteckerX, payload.atteckerY, payload.hitEntity, matchingTower.damage, payload.timestemp);

	return { status: 'success', message: '때릴 수 있는 놈이군.' };
};


//킬 목록을 가져온다. 목록은 [{ killer{killer ,killerX, killerY}, dethEntity{id,hp,speed,gold,timestemp}, x, y,},...] 나는 x,y(죽은위치) 안쓰지만 베이스랑 라운드에서 쓰기 때문.
export const killTower = (userId, daethSheets) => {

	// daethSheets = daethSheets.filter(item => item.killer === 'killtower');
	// const currentTowers = getTower(userId);
	// const damageSheet = getowerAttackSheet(userId);

	// // daethSheets.forEach(sheet => {
	// // 	const matchingTower = currentTowers.find(
	// // 		tower => tower.x === sheet.x && tower.y === sheet.y
	// // 	);
	
	// // 	if (matchingTower) {
	// // 		console.log("Matching tower found:", matchingTower);
	// // 	} else {
	// // 		console.log("No matching tower for daethSheet:", sheet);
	// // 	}
	// // });
	// // const matchingTower = currentTowers.find(
	// // 	(tower) => tower.x === daethSheets.x && tower.y === daethSheets.y,
	// // );
	
	

	//폴문으로 dethEntity 와 같은 hitEntity 의 데미지 시트만 가져와서 데미지를 전부 더한게 최대 체력보다 높은지 검증, 마지막 때린놈이 죽인놈이 맞는지 검증.



	//두번째 폴문으로. 어택 시트에서 타워끼리 모아서, 타워 스템프의 차이가 공속보다 빠른지 확인하기. 피버타입까지 고려해서 2배까지는 허용.




	//타워가 있는지 확인, 사거리가 되는지 확인,체력이 공격을 맞아 알맞게 피가 까였는지, 전부 가져와서 공격 속도가 되는지 확인, 성공시 다음으로.
	//애는 리스트를 받고, 그 리스트에 있는 타워를 한번에 가져온뒤, 공격 속도 확인.
	return true;
};
