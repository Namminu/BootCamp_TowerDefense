# 타워 디펜스 - 귀여운 고양이가 세상을 구한다
## 게임 화면 - 와이어 프레임
![image](https://github.com/user-attachments/assets/c4616cd6-8b79-4a91-a89f-27b1dcc6aca0)

## 게임 화면 - 구현된 모습(12-26 UPDATE)
![image](https://github.com/user-attachments/assets/9c1fa121-377c-4949-9aab-138c3b478138)
![image](https://github.com/user-attachments/assets/836f2ca0-1afc-4c7c-9124-06ec5407f0d0)

## 개발 체크 리스트
- [x] 피버 타임 구현 ✅ 2024-12-25 => 데미지 1.5배, 사정거리 1.2배
- [x] 피버 타임 게이지 바 구현 ✅ 2024-12-25
- [x] 첫 타워는 중간값에. 그 다음에 구매하는 타워는 좌표를 지정해서 설치해야 한다. ✅ 2024-12-25
- [x] 타워 설치할 때 범위 표시 ✅ 2024-12-25 => 마우스오버를 하면 범위가 표시되게
- [ ] 설치가 안 될 때는 색깔로 알 수 있게 구현
- [x] 타워 구매 UI 제작(랜덤한 타워가 아래쪽 UI에 생성되도록) ✅ 2024-12-25
- [ ] 타워 자세히 보기 UI 제작(타워 정보 표시, 업그레이드와 판매 버튼 출력)
- [ ] 필요한 핸들러 이벤트가 있다면 이삭님께 보고(타워가 몬스터를 공격할 때 사거리, 데미지 검증. 근데 이러려면 서버가 몬스터 id랑 체력을 알고 있어야 하는 거 아닌가??)
- [ ] 타워 스프라이트 스케치

## 코드 픽스 리스트
- [ ] 피버 타임이 발동했을 때 화면의 색이 변한다거나, 커다란 알림창이 상단에 생성된다거나 변하는 게 있었으면 좋겠다.
- [ ] 타워 자세히 보기 UI창이 다른 타워 이미지와 겹칠 때 이벤트 리스너가 중복될 것 같아서 조건문으로 다 분기점을 만들어줘야 할 듯
- [x] 업그레이드 가격도 표기하기 ✅ 2024-12-26
- [x] 실제 플레이를 해보니까 업그레이드 기능에 자잘한 버그가 있는 것 같음(업그레이드에 필요한 돈이 없을 때 생기는 버그였음!) ✅ 2024-12-26