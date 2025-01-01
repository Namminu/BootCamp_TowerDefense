const BASE_URL = 'http://localhost:8080/api';

// 게임 시작 버튼
document.getElementById('playButton').addEventListener('click', () => {
	const token = sessionStorage.getItem('authToken');

	if (!token) {
		alert('로그인 후 이용해주세요!');
		return;
	}

	console.log('Play Start');

	document.getElementById('header').style.display = 'none';
	document.querySelector('.banner').style.display = 'none';
	document.querySelector('.content').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'block';

	import('../../socket.js');
	import('../../game.js');
});
