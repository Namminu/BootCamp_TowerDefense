// 모달 HTML 파일 로드
export async function loadModal(modalFile) {
    try {
        const response = await fetch(`htmls/modalHTMLs/${modalFile}.html`);
        const modalHtml = await response.text();

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;

        const modalElement = modalContainer.firstElementChild;
        modalElement.style.display = 'none';

        document.body.appendChild(modalContainer);
    } catch (err) {
        console.error(err);
    }
}

export function showLogInModal() {
    const modal = document.getElementById('loginModal');

    modal.style.display = 'flex';
    modal.classList.add('show');
}

export function showRegisterModal() {
    const modal = document.getElementById('registerModal');

    modal.style.display = 'flex';
    modal.classList.add('show');
}

export function setOffModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// document.getElementById('closeLogin').addEventListener('click', () => {
//     setOffModal('loginModal');
// });
// document.getElementById('closeRegister').addEventListener('click', () => {
//     setOffModal('registerModal');
// });