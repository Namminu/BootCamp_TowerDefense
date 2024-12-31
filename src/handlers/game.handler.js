import { getGameAssets } from '../init/assets.js';
import { updateHighScore } from '../models/rank.model.js';
import {
	createTower,
	createTowerAttackSheet,
	createTowerQueue,
	getTower,
	getTowerQueue,
	setTowerQueue,
} from '../models/tower.model.js';
import {
	createUserData,
	getUserData,
	setUserGold,
	setUserRound,
	setUserData,
} from '../models/userData.model.js';
import { getRoundInfo } from '../models/roundInfo.model.js';
import { moveRoundHandler } from './round.handler.js';

export const gameStart = (userId, payload, socket) => {
	const { tower } = getGameAssets(); //타워 에셋 가져오기.

	// 게임 시작시 유저 정보 초기값 세팅
	createUserData(userId);
	createTower(userId);
	createTowerQueue(userId);
	createTowerAttackSheet(userId);
	setUserData(userId, 1, Date.now(), 1000);
	setTowerQueue(userId, tower);

	// 현재 시간으로 라운드 시작
	const response = moveRoundHandler(userId, { currentRound: 0, timestamp: Date.now() });
	const initRoundInfo = response.nextRoundInfo;
	const unlockMonsters = response.unlockMonsters;

	return { status: 'success', initRoundInfo, unlockMonsters };
};

// Base의 Hp <= 0 일 시 호출되는 이벤트
// sendEvent(3, payload : { currentRound, timestamp })
export const gameOver = async (userId, payload, socket) => {
	const currentRound = payload.currentRound;
	if (!userId || !currentRound)
		return { status: 'fail', message: `${!userId ? 'userId' : 'currentRound'} missing error` };

	const elapsedTime = (payload.timestamp - getUserData(userId).timestamp) / 1000;
	// const roundTime = getRoundInfo(currentRound).time / 1000;
	// if (elapsedTime < roundTime - 10 || elapsedTime > roundTime + 10)
	// 	return { status: 'fail', message: 'elapsedTime out of scope' };

	//최고 기록보다 현재 기록이 높다면 DB 갱신
	const result = await updateHighScore(userId, currentRound, elapsedTime);
	if (!result) return { status: 'fail', message: 'update High Score Error' };
	console.log(result);

	const data = {
		status: 'success',
		message: result.updated ? '최고 기록 갱신!' : '게임 오버',
		userName: result.userName,
		highScore: result.currentHighScore,
		time: result.elapsedTime,
	};
	return data;
};

export const updateUserGold = (userId, payload, socket) => {
	if (!userId || !payload) return { status: 'fail', message: '필수 값이 없습니다.' };

	const userData = getUserData(userId);
	const newGold = userData.gold + payload.gold;
	setUserGold(userId, newGold);

	console.log('서버에 들어온 골드', payload.gold);

	console.log('서버 userData: ', userData);

	return { status: 'success', message: newGold };
};
