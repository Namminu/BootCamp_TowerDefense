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


async function fetchRanking() {
	try {
	  const response = await fetch(`${BASE_URL}/rank`);
	  if (!response.ok) throw new Error('랭킹 데이터를 불러오지 못했습니다.');
  
	  const data = await response.json();
	  const rankings = data.data; // 랭킹 데이터 추출
	  const rankingList = document.querySelector(".ranking ul");
  
	  // 기존 랭킹 데이터 초기화
	  rankingList.innerHTML = "";
  
	  // 새로운 랭킹 데이터 추가
	  rankings.slice(0, 10).forEach((rank, index) => {
		const li = document.createElement("li");
		li.innerHTML = `
		  <span>${index + 1}</span>
		  <span>${rank.Round} 라운드 ${rank.Time}초</span>
		  <span>${rank.UserName}</span>
		  <span>${rank.createdAt}</span>
		`;
		rankingList.appendChild(li);
	  });
	} catch (error) {
	  console.error(error);
	  alert("랭킹 데이터를 불러오는 데 실패했습니다.");
	}
  }
  
  // 페이지 로드 시 랭킹 데이터를 가져옴
  window.addEventListener("load", fetchRanking);
  