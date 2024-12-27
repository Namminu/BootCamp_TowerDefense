import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";


//유저 입장시 , 아이디 만들고 넣어줌. 나갈때 아이디 삭제함.
const registerHandler = (io) => {
    io.on('connection', (socket) => { //io.on을 하면 connection이벤트가 일어나기 전까지 대기.
        const userUUID = 0; //여기서 토큰 받아서 유저아이디 뽑기.
        addUser({ uuid: userUUID, socketId: socket.id });

        handleConnection(socket, userUUID);

        socket.on('event', (data) => handlerEvent(io, socket, data));
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    })// socket.on은 하나의 대상만.
}

export default registerHandler