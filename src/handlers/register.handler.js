import { getTowerQueue } from '../models/tower.model.js';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { moveRoundHandler } from './round.handler.js';

dotenv.config();

//유저 입장시 , 아이디 만들고 넣어줌. 나갈때 아이디 삭제함.
const registerHandler = (io) => {
	io.on('connection', (socket) => {
		//io.on을 하면 connection이벤트가 일어나기 전까지 대기.

		const authorization = socket.handshake.query.token;
		const { userId } = jwt.verify(authorization, process.env.JWT_KEY);

		addUser({ uuid: userId, socketId: socket.id });

		//타워인벤토리를 보네는 소켓입니다.
		socket.on('requestTowerQueue', () => {
			const towerQueueTyep = getTowerQueue(userId);
			socket.emit('TowerQueueData', towerQueueTyep);
		});

		socket.on('moveRoundHandler', (payload) => {
			const response = moveRoundHandler(userId, payload);
			socket.emit('moveRoundHandler', response);
		});

		handleConnection(socket, userId);

		socket.on('event', (data) => handlerEvent(io, socket, data));
		socket.on('disconnect', () => handleDisconnect(socket, userId));
	}); // socket.on은 하나의 대상만.
};

export default registerHandler;
