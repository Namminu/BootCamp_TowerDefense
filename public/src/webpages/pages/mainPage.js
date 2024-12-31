const BASE_URL = 'http://localhost:8080/api';
// 회원가입 버튼
document.getElementById('registerButton').addEventListener('click', async () => {
    console.log("회원가입 버튼 클릭");
    await openRegisterModal();
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
                        } else alert('로그인에 성공했지만 토큰을 받을 수 없습니다.');
                    } else alert(result.message || '로그인에 실패했습니다.');
                } catch (error) {
                    alert('서버와 통신 중 오류가 발생했습니다.');
                    console.error(error);
                }
            });

            // 로그인 모달 닫기 버튼
            document.getElementById('closeLogin').addEventListener('click', () => {
                console.log("setoff loginModal click");
                loginModal.style.display = 'none';
            });

            // 회원가입 링크 이벤트
            const registerLink = document.getElementById('registerLink'); // 정확한 선택자 사용
            if (registerLink) {
                registerLink.addEventListener('click', async (event) => {
                    event.preventDefault();
                    loginModal.style.display = 'none';
                    await openRegisterModal();
                });
            } else {
                console.error("아이디가 없으신가요? 링크를 찾을 수 없습니다.");
            }
        }
    } catch (err) {
        console.error("LogIn Modal Load Fail", err);
    }
});

// 게임 시작 버튼
document.getElementById('playButton').addEventListener('click', () => {
    console.log("Play Start");

    document.getElementById('header').style.display = 'none';
    document.querySelector('.banner').style.display = 'none';
    document.querySelector('.section').style.display = 'none';
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
                    alert("모두 입력해주세요!");
                    return;
                }

                try {
                    const response = await fetch(`${BASE_URL}/sign-up`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, password, confirmPassword, nickName })
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
                    alert("회원가입 중 서버에 에러가 발생했습니다.");
                    console.error(err);
                }
            });
            // 회원가입 모달 닫기 버튼
            document.getElementById('closeRegister').addEventListener('click', () => {
                console.log("setoff RegisterModal click");
                registerModal.style.display = 'none';
            });
        }
    } catch (err) {
        console.error("Register Modal Load Fail", err);
    }
}