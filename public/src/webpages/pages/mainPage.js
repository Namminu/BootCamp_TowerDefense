const BASE_URL = 'http://localhost:8080/api';
let isLogin = false;
// 회원가입 버튼
document.getElementById('registerButton').addEventListener('click', async () => {
    console.log("회원가입 버튼 클릭");
    try {
        const response = await fetch('/htmls/modalHTMLs/registerModal.html');
        if (!response.ok) throw new Error('Register Modal Response Error');

        const registerModalHtml = await response.text();
        const modalContainer = document.getElementById('modalConatiner');
        if (!modalContainer) throw new Error('Register Modal modalContainer Error');

        modalContainer.innerHTML = registerModalHtml;

        const registerModal = document.getElementById('registerModal');
        if (registerModal) registerModal.style.display = 'block';
    } catch (err) {
        console.error("Register Modal Load Fail");
    }
});

// 로그인 버튼
document.getElementById('loginButton').addEventListener('click', async () => {
    console.log("로그인 버튼 클릭");
    try {
        const response = await fetch('/htmls/modalHTMLs/loginModal.html');
        if (!response.ok) throw new Error('LogIn Modal Response Error');

        const logInModalHtml = await response.text();
        const modalContainer = document.getElementById('modalConatiner');
        if (!modalContainer) throw new Error('LogIn Modal modalContainer Error');

        modalContainer.innerHTML = logInModalHtml;

        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';

            document.getElementById('modal_LoginButton').addEventListener('click', async () => {
                console.log("로그인 버튼 클릭 - 모달");

                const userId = document.getElementById('userId').value.trim();
                const password = document.getElementById('password').value.trim();

                if (!userId || !password) {
                    alert('아이디와 비밀번호를 모두 입력해주세요.');
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

                    if (response.ok) {
                        const authHeader = response.headers.get('authorization');
                        if (authHeader) {
                            const token = authHeader.split(' ')[1];
                            localStorage.setItem('authToken', token);
                            alert(result.message || '로그인 성공!');
                            loginModal.style.display = 'none';
                            isLogin = true;
                        } else alert('로그인에 성공했지만 토큰을 받을 수 없습니다.');
                    } else alert(result.message || '로그인에 실패했습니다.');
                } catch (error) {
                    alert('서버와 통신 중 오류가 발생했습니다.');
                    console.error(error);
                }

                // 로그인 모달 닫기 버튼
                document.getElementById('closeLogin').addEventListener('click', () => {
                    console.log("setoff loginModal click");
                    loginModal.style.display = 'none';
                });

                // 회원가입 링크 이벤트
                const registerLink = document.getElementById('registerLink'); // 정확한 선택자 사용
                if (registerLink) {
                    registerLink.addEventListener('click', (event) => {
                        alert("안타깝다...");
                        // event.preventDefault();
                        // loginModal.style.display = 'none';
                    });
                } else {
                    console.error("아이디가 없으신가요? 링크를 찾을 수 없습니다.");
                }
            });
        }
    } catch (err) {
        console.error("LogIn Modal Load Fail", err);
    }
});

// 게임 시작 버튼
document.getElementById('playButton').addEventListener('click', () => {
    if (isLogin) {
        console.log("Play Start");

        document.getElementById('header').style.display = 'none';
        document.querySelector('.banner').style.display = 'none';
        document.querySelector('.section').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';

        import('../../socket.js');
        import('../../game.js');
    } else {
        alert("로그인 먼저 진행해주세요!");
    }
});
