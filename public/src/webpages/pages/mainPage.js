const BASE_URL = 'http://localhost:8080/api';
// 회원가입 버튼
document.getElementById('registerButton').addEventListener('click', () => {
    console.log("회원가입 버튼 클릭");
});

// 로그인 버튼
document.getElementById('loginButton').addEventListener('click', () => {
    console.log("로그인 버튼 클릭");
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