import { getGameAssets } from '../init/assets.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import { createUserData, setUserRound } from '../models/userData.model.js';
import handlerMappings from './handlerMapping.js';

//유저 삭제함수 불러오는 함수.
export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`새 유저:${uuid}, 소켓아이디 ${socket.id}`);
  console.log('현재 접속중인 유저:', getUser());

  createUserData(uuid);
  setUserRound(uuid, 1, Date.now());
  const initRoundInfo = getRoundInfo(1);
  if(!initRoundInfo) initRoundInfo = createRoundInfo(1);

  socket.emit('connection', { uuid, initRoundInfo });
};

export const handlerEvent = (io, socket, data) => {
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    console.error(`헨들러가 존재하지 않습니다. handlerId: ${data.handlerId}`);
    socket.emit("response", { status: "fail", message: "헨들러가 없어용" });
    return;
  }

  const response = handler(socket, data.userId, data.payload);

  if (response.broadcast) {
    io.emit('response', response);
    return;
  }

  socket.emit('response', response);
};
