const BASE_URL = 'http://localhost:8080/api';
// 회원가입 버튼
document.getElementById('registerButton').addEventListener('click', async () => {
	console.log('회원가입 버튼 클릭');
	try {
		const response = await fetch('/htmls/modalHTMLs/registerModal.html');
		if (!response.ok) throw new Error('Register Modal Response Error');

		const registerModalHtml = await response.text();
		const modalContainer = document.getElementById('modalConatiner');
		if (!modalContainer) throw new Error('Register Modal modalContainer Error');

		modalContainer.innerHTML = registerModalHtml;

		const registerOverlay = document.getElementById('registerOverlay');
		const registerModal = document.getElementById('registerModal');

		if (registerOverlay && registerModal) {
			// 모달 열 때 html과 body 모두 스크롤 막기
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';

			registerOverlay.style.display = 'flex';
			registerModal.classList.add('show');

			// 닫기 버튼 이벤트
			document.getElementById('closeRegister').addEventListener('click', () => {
				registerOverlay.style.display = 'none';
				registerModal.classList.remove('show');
				// 모달 닫을 때 스크롤 다시 활성화
				document.documentElement.style.overflow = 'auto';
				document.body.style.overflow = 'auto';
			});

			// 배경 클릭시 닫기
			registerOverlay.addEventListener('click', (e) => {
				if (e.target === registerOverlay) {
					registerOverlay.style.display = 'none';
					registerModal.classList.remove('show');
					// 모달 닫을 때 스크롤 다시 활성화
					document.documentElement.style.overflow = 'auto';
					document.body.style.overflow = 'auto';
				}
			});
		}
	} catch (err) {
		console.error('Register Modal Load Fail');
	}
});

// 로그인 버튼
document.getElementById('loginButton').addEventListener('click', async () => {
	console.log('로그인 버튼 클릭');
	try {
		const response = await fetch('/htmls/modalHTMLs/loginModal.html');
		if (!response.ok) throw new Error('LogIn Modal Response Error');

		const logInModalHtml = await response.text();
		const modalContainer = document.getElementById('modalConatiner');
		if (!modalContainer) throw new Error('LogIn Modal modalContainer Error');

		modalContainer.innerHTML = logInModalHtml;

		const loginOverlay = document.getElementById('loginOverlay');
		const loginModal = document.getElementById('loginModal');

		if (loginOverlay && loginModal) {
			// 모달 열 때 html과 body 모두 스크롤 막기
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';

			loginOverlay.style.display = 'flex';
			loginModal.classList.add('show');

			// 닫기 버튼 이벤트
			document.getElementById('closeLogin').addEventListener('click', () => {
				loginOverlay.style.display = 'none';
				loginModal.classList.remove('show');
				// 모달 닫을 때 스크롤 다시 활성화
				document.documentElement.style.overflow = 'auto';
				document.body.style.overflow = 'auto';
			});

			// 배경 클릭시 닫기
			loginOverlay.addEventListener('click', (e) => {
				if (e.target === loginOverlay) {
					loginOverlay.style.display = 'none';
					loginModal.classList.remove('show');
					// 모달 닫을 때 스크롤 다시 활성화
					document.documentElement.style.overflow = 'auto';
					document.body.style.overflow = 'auto';
				}
			});
		}
	} catch (err) {
		console.error('Login Modal Load Fail:', err);
	}
});

// 게임 시작 버튼
document.getElementById('playButton').addEventListener('click', () => {
	console.log('Play Start');

	document.getElementById('header').style.display = 'none';
	document.querySelector('.banner').style.display = 'none';
	document.querySelector('.content').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'block';

	import('../../socket.js');
	import('../../game.js');
});
