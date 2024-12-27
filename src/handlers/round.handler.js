import { getGameAssets } from '../init/assets.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';
import { getUserData, setUserRound } from '../models/userData.model.js';

// sendEvent(11, payload : { currentRound, timestamp })
export const moveRoundHandler = (userId, payload) => {
	// 라운드 검증. 유저의 현재 라운드와 currentRound 비교
	if (payload.currentRound) {
		const currentRound = getUserData(userId).round;
		if (currentRound !== payload.currentRound) {
			return { status: 'fail', message: 'currentRound mismatch' };
		}
	} else return { status: 'fail', message: 'no currentRound for moveRound' };

	// 진행행시간 검증. 해당 라운드의 진행시간과 실제 진행시간의 오차 계산
	if (payload.timestamp) {
		const roundStartTime = getUserData.timestamp; // 현재 라운드 시작 시간
		const roundClearTime = payload.timestamp; // 현재 라운드 종료 시간
		const elapsedTime = (roundClearTime - roundStartTime) / 1000;
		const roundTime = getRoundInfo(payload.currentRound).time;
		if (elapsedTime < roundTime - 10 || elapsedTime > roundTime + 10) {
			return { status: 'fail', message: 'elapsedTime out of scope' };
		}
	} else return { status: 'fail', message: 'no timestamp for moveRound' };

	// 다음 라운드
	const nextRound = payload.currentRound + 1;

	// 유저의 현재 라운드 정보 업데이트
	setUserRound(userId, nextRound, payload.timestamp);

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
