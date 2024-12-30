const token = localStorage.getItem('authToken');
// 모달 HTML 파일 로드
export async function loadRegisterModal() {
    try {
        const response = await fetch(`htmls/modalHTMLs/registerModal.html`);
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

export function showRegisterModal() {
    const modal = document.getElementById('registerModal');

    modal.style.display = 'flex';
    modal.classList.add('show');
}

export function setOffRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}


// document.getElementById('closeRegister').addEventListener('click', () => {
//     setOffModal('registerModal');
// });