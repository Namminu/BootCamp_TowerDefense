import { spawnMonster } from "./game.js";

const socket = io("http://localhost:8080");

let userId = null;
socket.on("connection", (data) => {
  console.log("connection", data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit("event", { 
    userId,
    handlerId,
    payload,
  });
};

// 서버에게 생성주기가 완료되면 생성하라는 데이터를 받는다.
socket.on("spawnMonster", (data) => {
    console.log("서버로부터 몬스터 생성 명령 수신", data);
    spawnMonster(); // 클라이언트의 spawnMonster 함수 호출
});

export { sendEvent };
