import { getGameAssets } from "../init/assets.js";
import { getRoundInfo } from "../models/roundInfo.model.js";
import { getUserData, setUserRound } from "../models/userData.model.js";

// sendEvent(11, payload : { currentRound, timestamp })
export const moveRoundHandler = (userId, payload) => {
    // 라운드 검증. 유저의 현재 라운드와 currentRound 비교
    if (payload.currentRound) {
        const currentRound = getUserData(userId).round;
        if (currentRound !== payload.currentRound) {
            return { status: "fail", message: "currentRound mismatch" };
        }
    } else return { status: "fail", message: "no currentRound for moveRound" };

    // 진행행시간 검증. 해당 라운드의 진행시간과 실제 진행시간의 오차 계산
    if (payload.timestamp) {
        const roundStartTime = 0;
        const roundClearTime = payload.timestamp;
        const elapsedTime = (roundClearTime - roundStartTime) / 1000;
        const roundTime = 0;
        if (elapsedTime < roundTime - 10 || elapsedTime > roundTime + 10) {
            return { status: "fail", message: "currnetStage mismatch" };
        }
    } else return { status: "fail", message: "no timestamp for moveRound" };

    // 다음 라운드
    const nextRound = payload.currentRound + 1;

    // 다음 라운드 정보를 담은 객체 생성
    const nextRoundInfo = getRoundInfo(nextRound);

    // 유저의 현재 라운드 정보 업데이트
    setUserRound(userId, nextRound, payload.timestamp );

    // monster.json 에셋에서 다음 라운드에 해금되는 id인 몬스터들 저장
    const { monsters, unlock_monster } = getGameAssets();
    const unlockMonsters = monsters.data.find(mon => (mon.round = nextRound)); //[{ id:2 }];

    // 유저의 다음 라운드 정보 업데이트 + 다음 라운드 몬스터 해제
    //setRound(userId, nextRound, Date.now());
    return {
        handlerId: 11,
        status: "success",
        nextRoundInfo,
        unlockMonsters,
    };
};
