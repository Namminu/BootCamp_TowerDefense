const BASE_URL = 'http://localhost:8080/api';

//---- 회원가입 모달 관련
document.getElementById('registerButton').addEventListener('click', async () => {
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

			// 확인 버튼 클릭 이벤트
			document.getElementById('modal_RegisterButton').addEventListener('click', async () => {
				const userId = document.getElementById('registerUsername').value.trim();
				const password = document.getElementById('registerPassword').value.trim();
				const confirmPassword = document.getElementById('confirmPassword').value.trim();
				const nickName = document.getElementById('nickName').value.trim();

				// 입력값 검증
				if (!userId || !password || !confirmPassword || !nickName) {
					alert('빈칸을 확인해주세요.');
					return;
				}

				// 비밀번호 일치 여부 확인
				if (password !== confirmPassword) {
					alert('비밀번호가 일치하지 않습니다.');
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
						alert(result.message || '회원가입이 완료되었습니다.');
						registerOverlay.style.display = 'none';
						registerModal.classList.remove('show');
						document.documentElement.style.overflow = 'auto';
						document.body.style.overflow = 'auto';
					} else {
						const errorResult = await response.json().catch(() => null);
						console.log(errorResult);

						if (errorResult?.errorMessage) {
							alert(errorResult?.errorMessage);
						} else {
							alert('회원가입에 실패했습니다.');
						}
					}
				} catch (err) {
					alert('서버와 통신 중 오류가 발생했습니다.');
					console.error('Register Submit Error:', err);
				}
			});
		}
	} catch (err) {
		console.error('Register Modal Load Fail', err);
	}
});

//---- 로그인 모달 관련
document.getElementById('loginButton').addEventListener('click', async () => {
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

			// 회원가입 링크 클릭 이벤트
			document.getElementById('registerLink').addEventListener('click', async (e) => {
				e.preventDefault();

				// 로그인 모달 닫기
				loginOverlay.style.display = 'none';
				loginModal.classList.remove('show');
				document.documentElement.style.overflow = 'auto';
				document.body.style.overflow = 'auto';

				// 회원가입 모달 열기
				try {
					const response = await fetch('/htmls/modalHTMLs/registerModal.html');
					if (!response.ok) throw new Error('Register Modal Response Error');

					const registerModalHtml = await response.text();
					modalContainer.innerHTML = registerModalHtml;

					const registerOverlay = document.getElementById('registerOverlay');
					const registerModal = document.getElementById('registerModal');

					if (registerOverlay && registerModal) {
						// 회원가입 모달 표시 및 스크롤 막기
						document.documentElement.style.overflow = 'hidden';
						document.body.style.overflow = 'hidden';
						registerOverlay.style.display = 'flex';
						registerModal.classList.add('show');

						// 닫기 버튼 이벤트
						document.getElementById('closeRegister').addEventListener('click', () => {
							registerOverlay.style.display = 'none';
							registerModal.classList.remove('show');
							document.documentElement.style.overflow = 'auto';
							document.body.style.overflow = 'auto';
						});

						// 배경 클릭시 닫기
						registerOverlay.addEventListener('click', (e) => {
							if (e.target === registerOverlay) {
								registerOverlay.style.display = 'none';
								registerModal.classList.remove('show');
								document.documentElement.style.overflow = 'auto';
								document.body.style.overflow = 'auto';
							}
						});
					}
				} catch (err) {
					console.error('Register Modal Load Fail:', err);
				}
			});

			// 로그인 버튼 클릭 이벤트 추가
			document.getElementById('modal_LoginButton').addEventListener('click', async () => {
				const userId = document.getElementById('userId').value.trim();
				const password = document.getElementById('password').value.trim();

				if (!userId || !password) {
					alert('빈칸을 확인해주세요.');
					return;
				}

				try {
					const response = await fetch(`${BASE_URL}/sign-in`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ userId, password }),
						credentials: 'include',
					});

					const result = await response.json();
					console.log(result);

					if (response.ok) {
						// 토큰을 헤더에서 추출 및 저장
						const authHeader = response.headers.get('authorization');
						if (authHeader) {
							const token = authHeader.split(' ')[1];
							sessionStorage.setItem('authToken', token); // 세션 스토리지에 토큰 저장
							alert(result.message || '로그인이 완료되었습니다.');

							// 로그인 모달 닫기
							loginOverlay.style.display = 'none';
							loginModal.classList.remove('show');
							document.documentElement.style.overflow = 'auto';
							document.body.style.overflow = 'auto';

							window.location.reload();
						} else {
							alert('로그인에 실패했습니다. 다시 시도해주세요.');
						}
					} else {
						if (result?.errorMessage) {
							alert(result.errorMessage);
						} else {
							alert('로그인에 실패했습니다. 다시 시도해주세요.');
						}
					}
				} catch (err) {
					alert('서버와 통신 중 오류가 발생했습니다.');
					console.error('Login Error:', err);
				}
			});
		}
	} catch (err) {
		console.error('Login Modal Load Fail:', err);
	}
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

				// 입력값 검증
				if (!userId || !password || !confirmPassword || !nickName) {
					alert('모든 필드를 입력해주세요.');
					return;
				}

				// 비밀번호 일치 여부 확인
				if (password !== confirmPassword) {
					alert('비밀번호가 일치하지 않습니다.');
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
						alert(result.message || '회원가입이 완료되었습니다.');
						registerModal.style.display = 'none';
					} else {
						const errorResult = await response.json().catch(() => null);
						alert(errorResult?.message || '회원가입에 실패했습니다.');
					}
				} catch (err) {
					alert('서버와 통신 중 오류가 발생했습니다.');
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

// 페이지 로드 시 토큰 체크 및 버튼 상태 설정
document.addEventListener('DOMContentLoaded', () => {
	const token = sessionStorage.getItem('authToken');
	const loginButton = document.getElementById('loginButton');
	const registerButton = document.getElementById('registerButton');
	const logoutButton = document.getElementById('logoutButton');

	if (token) {
		// 토큰이 있으면 로그인/회원가입 버튼 숨기고 로그아웃 버튼 표시
		loginButton.style.display = 'none';
		registerButton.style.display = 'none';
		logoutButton.style.display = 'block';

		// 로그아웃 버튼 클릭 이벤트
		logoutButton.addEventListener('click', () => {
			sessionStorage.removeItem('authToken');
			loginButton.style.display = 'block';
			registerButton.style.display = 'block';
			logoutButton.remove();
			window.location.reload();
		});
	} else {
		// 토큰이 없으면 로그인/회원가입 버튼 표시
		loginButton.style.display = 'block';
		registerButton.style.display = 'block';
		if (document.getElementById('logoutButton')) {
			document.getElementById('logoutButton').remove();
		}
	}
});

// 지금 안쓰이고 있음.
// async function setUserNameInPage(userName) {
// 	document.getElementById('loginButton').style.display = 'none';
// 	document.getElementById('registerButton').style.display = 'none';

// 	const nav = document.querySelector('nav');
// 	const userInfo = document.createElement('span');
// 	userInfo.id = 'userInfo';
// 	userInfo.textContent = `안녕하세요, ${userName}!`;
// 	userInfo.style.marginLeft = '30px';
// 	userInfo.style.fontSize = '16px';
// 	nav.appendChild(userInfo);
// }
