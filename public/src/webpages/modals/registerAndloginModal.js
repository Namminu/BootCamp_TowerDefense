// 모달 HTML 파일 로드
async function loadModal(modalFile) {
    const response = await fetch(`htmls/modalHTMLs/${modalFile}`);
    const modalHtml = await response.text();
    document.getElementById('modalContainer').innerHTML = modalHtml;
}

// 로그인 모달
const loginModal = document.getElementById('loginModal');
const loginButton = document.getElementById('loginButton');
const closeLogin = document.getElementById('closeLogin');

// 모달 보이기
loginButton.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});
// 모달 숨기기
closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// 회원가입 모달
const registerModal = document.getElementById('registerModal');
const registerButton = document.getElementById('registerButton');
const closeRegister = document.getElementById('closeRegister');

// 모달 보이기
registerButton.addEventListener('click', () => {
    registerModal.style.display = 'flex';
});
// 모달 숨기기
closeRegister.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    } else if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
});