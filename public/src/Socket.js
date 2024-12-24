import { spawnMonster } from "./game.js";

const socket = io("http://localhost:8080");

let userId = null;
socket.on("connection", (data) => {
  console.log("connection", data);
  userId = data.userId;
});

// 서버에게 생성주기가 완료되면 생성하라는 데이터를 받는다.
socket.on("response", (data) => {
  console.log("response", data);
});

// 서버에게 monsterSpawnInterval 보낸다. | 현재 시간도 보내서 계산시켜야 하나?
const sendEvent = (handlerId, payload) => {
  socket.emit("event", { userId, handlerId, payload });
};

socket.on("spawnMonster", (data) => {
    console.log("서버로부터 몬스터 생성 명령 수신", data);
    spawnMonster(); // 클라이언트의 spawnMonster 함수 호출
});

export { sendEvent };
