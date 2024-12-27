import { getGameAssets } from '../init/assets.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import { createUserData, setUserRound } from '../models/userData.model.js';
import handlerMappings from './handlerMapping.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { gameStart } from './game.handler.js';

dotenv.config();

//유저 삭제함수 불러오는 함수.
export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log("Current users:", getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`새 유저:${uuid}, 소켓아이디 ${socket.id}`);
  console.log("현재 접속중인 유저:", getUser());

  createUserData(uuid);

  // 연결되면 바로 게임이 시작되므로 여기서 gameStart 호출 (클라에서 호출X)
  gameStart(uuid, socket);

  // 1라운드 정보
  let initRoundInfo = getRoundInfo(1);
  if(!initRoundInfo) initRoundInfo = createRoundInfo(1);

  // 1라운드 해금 정보
  const { monster_unlock, monster } = getGameAssets();
  const unlockMonsterIds = monster_unlock.data.find(e=>e.round_id===1).monster_id;
  const unlockMonsters = monster.data.filter(e=>unlockMonsterIds.includes(e.id));

  socket.emit('connection', { uuid, initRoundInfo, unlockMonsters });
};

export const handlerEvent = async (io, socket, data) => {

  const { userId } = jwt.verify(data.token, process.env.JWT_KEY);

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    console.error(`헨들러가 존재하지 않습니다. handlerId: ${data.handlerId}`);
    socket.emit("response", { status: "fail", message: "헨들러가 없어용" });
    return;
  }

  const response = await handler(userId, data.payload, socket);
  console.log('response : ', response);

  if (response.broadcast) {
    io.emit("response", response);
    return;
  }

  socket.emit("response", response);
};
