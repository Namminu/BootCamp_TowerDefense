import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

//유저 입장시 , 아이디 만들고 넣어줌. 나갈때 아이디 삭제함.
const registerHandler = (io) => {
    io.on('connection', (socket) => { //io.on을 하면 connection이벤트가 일어나기 전까지 대기.
        
        const { authorization } = socket.handshake.auth.token;
        const [tokenType, token] = authorization.split(' ');
        const uuid = jwt.verify(token, process.env.JWT_KEY);

        console.log(uuid);

        addUser({ uuid: userUUID, socketId: socket.id });

        handleConnection(socket, userUUID);

        socket.on('event', (data) => handlerEvent(io, socket, data));
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    })// socket.on은 하나의 대상만.
}

export default registerHandler