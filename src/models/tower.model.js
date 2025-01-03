const towers = {};
const towersqueue = {};
const attackSheets = {};

//타워 만들기.
export const createTower = (uuid) => {
	towers[uuid] = [];
};

//유저 보기.
export const getTower = (uuid) => {
	return towers[uuid];
};

//타워 추가
export const setTower = (uuid, type, x, y, level, damage, range, cooldown, cost, timestamp) => {
	//여기서, 공속, 사거리, 그런걸 확인해야함.피버타입인걸 확인해야 겠는데.
	return towers[uuid].push({ type, x, y, level, damage, range, cooldown, cost, timestamp });
};

//타워 판매
export const removeTower = (uuid, x, y) => {
	const index = towers[uuid].findIndex((tower) => tower.x === x && tower.y === y);
	if (index !== -1) {
		//-1이면 없는거니까 뭐..
		towers[uuid].splice(index, 1)[0];
		return true;
	}
	return false;
};

//레벨 업 타워
export const upTower = (uuid, x, y, level) => {
	const index = towers[uuid].findIndex((tower) => tower.x === x && tower.y === y);
	if (index !== -1) {
		//-1이면 없는거니까 뭐..
		if (towers[uuid][index].level + 1 === level);
		{
			towers[uuid][index].level += 1;
			towers[uuid][index].damage *=1.2;
			towers[uuid][index].cooldown -= 10;
			return true;
		}
	}
	return false;
};

//타워 인벤토리
export const createTowerQueue = (uuid) => {
	towersqueue[uuid] = [];
};

//타워 인벤토리 가져오기.
export const getTowerQueue = (uuid) => {
	return towersqueue[uuid];
};

//타워 인벤토리 추가. //여기서 5개 이하면 뭐 추가되게 로직을 짜기.
export const setTowerQueue = (uuid, towers) => {
	//towers는 에셋.
	while (towersqueue[uuid].length < 5) {
		const towerDataIndex = Math.floor(Math.random() * towers.data.length);
		towersqueue[uuid].push({ towerDataIndex });
	}
};

//타워인벤토리의 타워 지정하면, 그 타워가 사라짐.
export const removeTowerQueue = (uuid, index) => {
	if (index !== -1) {
		//-1이면 없는거니까 뭐..
		towersqueue[uuid].splice(index, 1)[0];
		return true;
	}
	return false;
};

//때린 기록 빈 객체 생성 겸사겸사 초기화용으로도 사용.
export const createTowerAttackSheet = (uuid) => {
	attackSheets[uuid] = [];
};

//때린 기록 주기
export const getowerAttackSheet = (uuid) => {
	return attackSheets[uuid];
};

//때린 기록 저장.
export const setowerAttackSheet = (uuid, atteckerX, atteckerY, hitEntity, damage, timestemp, feverTriggered) => {
	return attackSheets[uuid].push({ atteckerX, atteckerY, hitEntity, damage, timestemp, feverTriggered });
};



// 타워를 돌려서 타워의  공격 범위 안에 있는지 확인.
export const canRangeTower = (towerX, towerY, targetX, targetY, range) => {

	const deltaX = targetX - towerX; 
	const deltaY = targetY - towerY; 
	
	if(Math.sqrt(deltaX ** 2 + deltaY ** 2) > range){
		return false ;
	}

	return true;
};


