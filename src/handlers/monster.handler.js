import { addMonster, updateMonsters } from '../models/monster.model.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';

// 몬스터 스폰 주기 변수
let spawnInterval;

//먼저 stage에 접근을 해서 stage마다의 생성 주기에 접근?
export const monsterCreate = (userId, payload, socket) => {
	console.log('getMonsterCreateHandler', payload);

	const round = payload.round;
	createRoundInfo(round);
	const roundInfo = getRoundInfo(round);
	console.log('roundInfo: ', roundInfo);

	if (!roundInfo) {
		console.log(`라운드 정보가 없습니다. round : ${round}`);
		return { status: 'fail', message: 'Round Info Not Found' };
	}

	const { duration, count, time } = roundInfo;

	// 이후 주기적으로 몬스터 생성 이벤트 전송
	//const spawnInterval =
	// spawnInterval = setInterval(() => {
	// 	socket.emit('spawnMonster', { message: '몬스터 생성하세요!', round, count });
	// }, duration);

	return { status: 'success', message: `Monster Spawning started for round ${round}` };
};

export const stopCreateMonster = (userId, payload, socket) => {
	clearInterval(spawnInterval);
	return { status: 'success', message: `Monster Spawn Stop}` };
}

// sendEvent(41, payload : {})
export const spawnMonster = (userId) => {
	addMonster(userId);
	return { handlerId: 41, status: 'success', message: 'monster added to Pool'};
}

// sendEvent(42, payload : {})
export const updateMonster = (userId) => {
	return { handlerId: 42, status: 'success', monsters : updateMonsters(userId)};
}