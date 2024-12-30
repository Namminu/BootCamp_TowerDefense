import { getGameAssets } from '../init/assets.js';
import { createRoundInfo, getRoundInfo } from '../models/roundInfo.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import { createUserData, getUserData, setUserRound } from '../models/userData.model.js';
import handlerMappings from './handlerMapping.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { gameStart } from './game.handler.js';
import { moveRoundHandler } from './round.handler.js';

dotenv.config();

//유저 삭제함수 불러오는 함수.
export const handleDisconnect = (socket, uuid) => {
	removeUser(socket.id); // 사용자 삭제
	console.log(`User disconnected: ${socket.id}`);
	console.log('Current users:', getUser());
};

export const handleConnection = (socket, uuid) => {
	console.log(`새 유저:${uuid}, 소켓아이디 ${socket.id}`);
	console.log('현재 접속중인 유저:', getUser());

	// 연결되면 바로 게임이 시작되므로 여기서 gameStart 호출 (클라에서 호출X)
	gameStart(uuid, socket);

	// 현재 시간으로 라운드 시작
	const response = moveRoundHandler(uuid, { currentRound: 0, timestamp: Date.now() })
	const initRoundInfo = response.nextRoundInfo;
	const unlockMonsters = response.unlockMonsters;

	// userData.model.js의 userData 불러오기
	const userData = getUserData(uuid);

	socket.emit('connection', { uuid, initRoundInfo, unlockMonsters, userData });
};

export const handlerEvent = async (io, socket, data) => {
	const { userId } = jwt.verify(data.token, process.env.JWT_KEY);

	const handler = handlerMappings[data.handlerId];
	if (!handler) {
		console.error(`헨들러가 존재하지 않습니다. handlerId: ${data.handlerId}`);
		socket.emit('response', { status: 'fail', message: '헨들러가 없어용' });
		return;
	}

	const response = await handler(userId, data.payload, socket);
	console.log('response : ', response);

	if (response.broadcast) {
		io.emit('response', response);
		return;
	}

	socket.emit('response', response);
};
