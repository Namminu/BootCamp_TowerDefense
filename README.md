# Tower Defense Game

#### 타워 디펜스 게임 팀프로젝트
<br>

## w. 1조

> **team notion**:

https://teamsparta.notion.site/1-c0359d3171d2496dbf830047246ef127

> **team leader**:

https://github.com/Namminu
<br>

> **team member**

https://github.com/cat10ho/sparta
<br>
https://github.com/ppiok-OwO
<br>
https://github.com/dkcp
<br>
https://github.com/ssy1248
<br>
https://github.com/ssini-oh
<br>

## 프로젝트 세팅
```cmd
# IDE : VSCode

# main framword : Express, socketIO

# package manager : yarn

# DB : MYSQL

# ORM : Prisma

```
<br>

## 와이어 프레임
![image](https://github.com/user-attachments/assets/536dd174-1b16-484b-b3af-c61717440db9)

## 파일 구조

조금 있다가 추가


## 필수 기능
``` txt
1. 회원가입 / 로그인 기능
client| public/src/webpages/pages/mainPage.js
회원가입과 로그인 기능 관리하는 js

2. 유저 별 게임 데이터 관리

3. 클라이언트가 서버로부터 수신하는 이벤트 종류 정의 및 코드 구현
4. 클라리언트가 서버로 송신하는 이벤트 종류 정의 및 코드 구현
client| public/src/socket.js
server| src/register.handler.js

5. 유저 별 최고 기록 스코어 저장
server| src/rank.model.js
```
<br>

## 도전 기능
``` txt
1. 타워 환불 기능
client| public/src/tower.js -> sellTower함수를 사용합니다.

2. 특정 타워 업그레이드 기능
client| public/src/tower.js -> upgradeTower함수를 사용합니다.

3. 그리드 형식의 맵으로 변경
client| public/src/path.js -> drawGridAndPath함수를 사용합니다.

4. 피버 타임 기능
client| public/src/tower.js -> feverTime함수를 사용합니다.
```

추가할 기능이있는지 물어볼 것
