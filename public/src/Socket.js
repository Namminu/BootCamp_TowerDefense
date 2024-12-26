import { spawnMonster } from "./game.js";

let somewhere = localStorage.getItem("authToken");

const socket = io("http://localhost:8080", {
  query: {
    token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
  },
});

socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);

  if(data.message){
    console.log(data.message);
  }
});


const loadTowerQueue = () => {
  return new Promise((resolve, reject) => {
    socket.emit('requestTowerQueue');
    socket.on('TowerQueueData', (TowerQueueTyep) => {
      resolve(TowerQueueTyep);
    });
    socket.on('error', (error) => {
      reject(error);
    });
  });
};

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    token: somewhere,
    handlerId,
    payload,
  });
};


// 서버에게 생성주기가 완료되면 생성하라는 데이터를 받는다.
socket.on("spawnMonster", (data) => {
    console.log("서버로부터 몬스터 생성 명령 수신", data);
    spawnMonster(); // 클라이언트의 spawnMonster 함수 호출
});
export { sendEvent, loadTowerQueue  };