const round = [{ roundNum:0 },];       // [0, { roundNum:1, ... }, { rondNum:2, ... }, ...] 
const user_round = {};      // { user1 : { roundId, timestamp } }

export const createUserRound = (uuid) => {
    user_round[uuid] = [];
}

//유저 스테이지 보기.
export const getUserRound = (uuid) => {
    return stage[uuid];
}

export const setUserRound = (uuid, id, timestamp, itemId) => {
    return stage[uuid].push({ id, timestamp, itemId });
}

export const getRound = () => {
    return round;
}

export const createRound = () => {
    const lastRound = round[round.length-1];
    const newRound = lastRound.roundNum+1;
    const roundInfo = {
        roundNum : newRound,
        spawnTimer : 9-(newRound/10),    // 소환 주기
        spawnCount : 9+newRound,        // 소환될 몬스터 수
        timer : 100-newRound,          // 라운드 진행시간
    }
    round.push(roundInfo);
}