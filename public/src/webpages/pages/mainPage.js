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

async function openRegisterModal() {
	try {
		const response = await fetch('/htmls/modalHTMLs/registerModal.html');
		if (!response.ok) throw new Error('Register Modal Response Error');

		const registerModalHtml = await response.text();
		const modalContainer = document.getElementById('modalConatiner');
		if (!modalContainer) throw new Error('Register Modal modalContainer Error');

		modalContainer.innerHTML = registerModalHtml;

		const registerModal = document.getElementById('registerModal');
		if (registerModal) {
			registerModal.style.display = 'block';

			document.getElementById('modal_RegisterButton').addEventListener('click', async () => {
				const userId = document.getElementById('registerUsername').value.trim();
				const password = document.getElementById('registerPassword').value.trim();
				const confirmPassword = document.getElementById('confirmPassword').value.trim();
				const nickName = document.getElementById('nickName').value.trim();

				if (!userId || !password || !confirmPassword || !nickName) {
					alert('모두 입력해주세요!');
					return;
				}

				try {
					const response = await fetch(`${BASE_URL}/sign-up`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userId, password, confirmPassword, nickName }),
					});

					if (response.ok) {
						const result = await response.json();
						if (!result) console.log('result error', result);

						alert(result.message || '회원가입이 완료되었습니다.');
						registerModal.style.display = 'none';
					} else {
						const errorResult = await response.json().catch(() => null);
						alert(errorResult?.message || '회원가입에 실패했습니다.');
					}
				} catch (err) {
					alert('회원가입 중 서버에 에러가 발생했습니다.');
					console.error(err);
				}
			});
			// 회원가입 모달 닫기 버튼
			document.getElementById('closeRegister').addEventListener('click', () => {
				console.log('setoff RegisterModal click');
				registerModal.style.display = 'none';
			});
		}
	} catch (err) {
		console.error('Register Modal Load Fail', err);
	}
}

async function setUserNameInPage(userName) {
	document.getElementById('loginButton').style.display = 'none';
	document.getElementById('registerButton').style.display = 'none';

	const nav = document.querySelector('nav');
	const userInfo = document.createElement('span');
	userInfo.id = 'userInfo';
	userInfo.textContent = `안녕하세요, ${userName}!`;
	userInfo.style.marginLeft = '30px';
	userInfo.style.fontSize = '16px';
	nav.appendChild(userInfo);
}
