import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { getHightScore, setHightScore } from "../models/user.model.js";

export const gameStart = (uuid, payload) => {

    const { stages } = getGameAssets();

    clearStage(uuid);

    setStage(uuid, stages.data[0].id, payload.timestamp); //첫번때 스테이지 저장

    return { status: 'success' }
}


export const gameOver = (uuid, payload) => { //여기서 최종 점수 계산.
    //여기서 점수 검증, 최종 보스임. 

    return { status: 'success', message: "게임 끝", score };
}