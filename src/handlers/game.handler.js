
import { getGameAssets } from "../init/assets.js";
import { updateHighScore } from "../models/rank.model.js";
import { createTower, createTowerQueue, getTower, getTowerQueue, setTowerQueue } from "../models/tower.model.js";
import { createUserData, setUserRound } from "../models/userData.model.js";

export const gameStart = (uuid, payload, socket) => {

  const { tower } = getGameAssets();//타워 에셋 가져오기.

  createUserData(uuid);// 유저 인게임 데이터 제작.
  createTower(uuid);//유저 타워 제작
  createTowerQueue(uuid);//타워 인벤토리 제작
  setTowerQueue(uuid, tower);//타워 인벤토리 채워넣기.
  setUserRound(uuid, 1, Date.now(), 1000); // 유저 인게임 데이터 넣기.
  return { status: "success" };
};

// Base의 Hp <= 0 일 시 호출되는 이벤트
export const gameOver = async (uuid, payload, socket) => {
  // const rounds = getStage(uuid);
  // if (!rounds.length) return { status: 'fail', message: 'No Rounds Found for User' };

  const userId = uuid;
  console.log(`userId : ${userId}`);
  const currentRound = payload.currentRound;
  console.log(`currentRound : ${currentRound}`);

  if (!userId || !currentRound)
    return { status: 'fail', message: `${!userId ? 'userId' : 'currentRound'} missing error` };

  //최고 기록보다 현재 기록이 높다면 DB 갱신
  const result = await updateHighScore(userId, currentRound);
  if (!result) return { status: 'fail', message: 'update High Score Error' };
  console.log(result);

  const data = {
    status: 'success',
    message: result.updated ? '최고 기록 갱신!' : '게임 오버',
    score: result.currentHighScore.highScore
  };
  return data;
}