
import { updateHighScore } from "../models/rank.model.js";
import { createTower, getTower } from "../models/tower.model.js";

export const gameStart = (uuid, payload) => {
  createTower(uuid);
  console.log('시작!');
  return { status: "success" };
};

// Base의 Hp <= 0 일 시 호출되는 이벤트
export const gameOver = async (uuid, payload) => {
  const rounds = getStage(uuid);
  if (!rounds.length) return { status: 'fail', message: 'No Rounds Found for User' };

  const userId = payload.userId;
  const currentRound = payload.currentRound;
  if (!userId || !currentRound)
    return { status: 'fail', message: `${!userId ? 'userId' : 'currentRound'} missing error` };

  //최고 기록보다 현재 기록이 높다면 DB 갱신
  const result = await updateHighScore(userId, currentRound);
  if (!result) return { status: 'fail', message: 'update High Score Error' };

  return {
    status: 'success',
    message: result.updated ? '최고 기록 갱신!' : '게임 오버',
    score: result.currentHighScore
  };
}
