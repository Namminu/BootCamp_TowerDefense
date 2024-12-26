// import { clearStage, getStage, setStage } from "../models/stage.model.js";
// import { getHightScore, setHightScore } from "../models/user.model.js";

import { updateHighScore } from "../models/rank.model.js";

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);

  setStage(uuid, stages.data[0].id, payload.timestamp); //첫번째 스테이지 저장

  return { status: "success" };
};

// Base의 Hp <= 0 일 시 호출되는 이벤트
export const gameOver = async (uuid, payload) => {
  const rounds = getStage(uuid);
  if (!rounds.length) return { status: 'fail', message: 'No Rounds Found for User' };

  const userId = payload.userId;
  const currentRound = payload.currentRound;

  //최고 기록보다 현재 기록이 높다면 DB 갱신
  const result = await updateHighScore(userId, currentRound);

  return {
    status: 'success',
    message: result.updated ? '최고 기록 갱신!' : '게임 오버',
    score: result.currentHighScore
  };
}
