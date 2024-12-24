import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { getHightScore, setHightScore } from "../models/user.model.js";


export const gameStart = (uuid, payload) => {

    const { stages } = getGameAssets();

    clearStage(uuid);

    setStage(uuid, stages.data[0].id, payload.timestamp); //첫번때 스테이지 저장

    return { status: 'success' }
}

// Base의 Hp <= 0 일 시 호출되는 이벤트
export const gameOver = (uuid, payload) => {
    const rounds = getStage(uuid);
    if(!rounds.length) return { status: 'fail', message : 'No Rounds Found for User'};

    temp;

    //DB - HighScores 에서 유저의 최고 기록 가져와서 비교
    //최고 기록보다 현재 기록이 높다면 DB 갱신

    return { status: 'success', message: "게임 끝", score };
}