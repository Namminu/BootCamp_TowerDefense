import { getGameAssets } from '../init/assets.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';
import { getUserData, setUserRound, setUserTimestamp } from '../models/userData.model.js';
import { killTower } from './tower.handler.js';
import { baseHitEnemyCheck } from './base.hanlder.js';

// sendEvent(11, payload : { currentRound, timestamp })
export const moveRoundHandler = (userId, payload, socket) => {
	if(payload.currentRound !== 0){
		// 라운드 검증. 유저의 현재 라운드와 currentRound 비교
		if (payload.currentRound) {
			const currentRound = getUserData(userId).round;
			if (currentRound !== payload.currentRound) {
				return { status: 'fail', message: 'currentRound mismatch' };
			}
		} else return { status: 'fail', message: 'no currentRound for moveRound' };
	
		// 진행행시간 검증. 해당 라운드의 진행시간과 실제 진행시간의 오차 계산 //이거 가져가서 쓰면 끝남 ㅇㅇ
		if (payload.timestamp) {
			const roundStartTime = getUserData(userId).timestamp; // 현재 라운드 시작 시간
			const roundClearTime = payload.timestamp; // 현재 라운드 종료 시간
			const elapsedTime = (roundClearTime - roundStartTime) / 1000;
			const roundTime = getRoundInfo(payload.currentRound).time / 1000;
			if (elapsedTime < roundTime - 10 || elapsedTime > roundTime + 10) {
				return { status: 'fail', message: 'elapsedTime out of scope' };
			}
		} else return { status: 'fail', message: 'no timestamp for moveRound' };	
	}



	const isKillTower= killTower(userId, payload.deathSheets);

	if(!isKillTower) {
		return { status: 'fail', message: '이새끼 핵씀.' };
	}

	const isKillBase = baseHitEnemyCheck(userId, payload.deathSheets);
	if(!isKillBase) {
		return { status: 'fail', message: '이상한 결과' };
	}

	// 다음 라운드
	const nextRound = payload.currentRound + 1;

	// 유저의 현재 라운드 정보 업데이트
	setUserRound(userId, nextRound);
	setUserTimestamp(userId, Date.now());

	// 다음 라운드 정보를 담은 객체 생성
	// 서버에 저장된 다음 라운드 정보가 있다면 바로 저장, 없다면 생성 후 저장
	let nextRoundInfo = getRoundInfo(nextRound);
	if (!nextRoundInfo) nextRoundInfo = createRoundInfo(nextRound);

	// 다음 라운드 해금 정보
	const { monster, monster_unlock } = getGameAssets();
	const unlockMonsterIds = monster_unlock.data.find((e) => e.round_id === 1).monster_id;
	const unlockMonsters = monster.data.filter((e) => unlockMonsterIds.includes(e.id));

	return {
		handlerId: 11,
		status: 'success',
		nextRoundInfo,
		unlockMonsters,
	};
};