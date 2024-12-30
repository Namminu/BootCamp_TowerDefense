import { resetGame } from "../../game.js";

// 게임 오버 모달창 html 파일 로드
export async function initModal() {
    try {
        const response = await fetch('/htmls/modalHTMLs/gameOverModal.html');
        const modalHtml = await response.text();

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        console.log("Modal HTML Load Success");
    } catch (err) {
        console.error("Modal HTML Load Failed : ", err);
    }
}

// 게임 오버 모달창 설정
export function showModal(message, userName, highScore, currentRound, time) {
    const modal = document.getElementById('gameOverModal');

    document.getElementById('message').textContent = `${message}`;
    document.getElementById('userName').textContent = `이름 : ${userName}`;
    document.getElementById('highScore').textContent = `최고 기록 : ${highScore}Round ${time}sec`;
    document.getElementById('currentRound').textContent = `현재 기록 : ${currentRound}Round ${time}sec`;

    modal.style.display = 'flex';
    modal.classList.add('show');

    document.getElementById('restartButton').addEventListener('click', () => {
        console.log('재시작 버튼 클릭');
        closeModal();
        resetGame(); // 게임 재시작
    });

    document.getElementById('mainButton').addEventListener('click', () => {
        console.log('메인화면 이동');
        location.reload();
    });
}

// 재시작 눌렀을 경우 모달 숨기기
function closeModal() {
    const modal = document.getElementById('gameOverModal');

    modal.style.display = 'none';
    modal.classList.remove('show');
}