import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

//소켓 서버 연결 함수.

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHandler(io);
};

export default initSocket;