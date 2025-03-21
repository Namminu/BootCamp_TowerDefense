import { setRound, spawnMonster, initGame } from './game.js';

let somewhere = sessionStorage.getItem('authToken');

const socket = io('http://localhost:8080', {
	query: {
		token: somewhere,
	},
});

socket.on('response', (data) => {
	console.log('response : ', data);
	if (data.handlerId === 11) setRound(data.nextRoundInfo, data.unlockMonsters);
	if (data.handlerId === 2) setRound(data.initRoundInfo, data.unlockMonsters);
});

socket.on('connection', (data) => {
	console.log('connection: ', data);

	if (data.message) {
		console.log(data.message);
	}

	// 클라이언트에서 userData.model.js의 userData를 사용하기 위한 로직
	if (data.userData) {
		initGame(data.userData);
	}

	sendEvent(2);
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
	return new Promise((resolve, reject) => {
		const listener = (data) => {
			//console.log(`response : `, data);
			if (data.handlerId === handlerId) {
				if (data.status === 'success') {
					resolve(data);
				} else {
					reject(new Error(data.message || 'Unknown error'));
				}
			}
		};

		// 한 번만 실행될 리스너 등록
		socket.once('response', listener);

		// // 이벤트 전송
		socket.emit('event', {
			token: somewhere,
			handlerId,
			payload,
		});

		// socket.once('response', (data) => {
		// 	if (data.status === 'success') resolve(data);
		// 	else reject(new Error(data.message));
		// });
	});
};

// 서버에게 생성주기가 완료되면 생성하라는 데이터를 받는다.
socket.on('spawnMonster', (data) => {
	// 이벤트 큐로 관리하고 있기 때문에 1라운드에 요청한 데이터가 그대로 출력돼서 로그를 찍지 않는 게 나아보입니다.
	// console.log('서버로부터 몬스터 생성 명령 수신', data);
	spawnMonster(); // 클라이언트의 spawnMonster 함수 호출
});

export { sendEvent, loadTowerQueue };
