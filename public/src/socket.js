import { gameStart, setRound, spawnMonster } from './game.js';

let somewhere = localStorage.getItem('authToken');

const socket = io('http://localhost:8080', {
	query: {
		token: somewhere, // 토큰이 저장된 어딘가에서 가져와야 합니다!
	},
});

// 전역 상태 관리
let gameData = {
	userData: null,
};

socket.on('response', (data) => {
	console.log('response : ', data);
  if(data.handlerId===11)
    setRound(data.nextRoundInfo, data.unlockMonsters);
});

socket.on('connection', (data) => {
	console.log('connection: ', data);

	if (data.message) {
		console.log(data.message);
	}

	// 클라이언트에서 userData.model.js의 userData를 사용하기 위한 로직
	if (data.userData) {
		gameData.userData = data.userData;
	}

  setRound(data.initRoundInfo, data.unlockMonsters);
  gameStart();
});

// gameData 사용을 위한 getter 함수들
export const getUserData = () => gameData.userData;

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

// const sendEvent = async (handlerId, payload) => {
//   socket.emit('event', {
//     token: somewhere,
//     handlerId,
//     payload,
//   });
// };

const sendEvent = (handlerId, payload) => {
	return new Promise((resolve, reject) => {
		socket.emit('event', {
			token: somewhere,
			handlerId,
			payload,
		});

		socket.once('response', (data) => {
			if (data.status === 'success') resolve(data);
			else reject(new Error(data.message));
		});
	});
};


// 서버에게 생성주기가 완료되면 생성하라는 데이터를 받는다.
socket.on("spawnMonster", (data) => {
	console.log("서버로부터 몬스터 생성 명령 수신", data);
	spawnMonster(); // 클라이언트의 spawnMonster 함수 호출
});

export { sendEvent, loadTowerQueue };
