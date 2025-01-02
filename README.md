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

## 게임 소개
내배캠 타워디펜스는 귀여운 고양이 타워들을 배치하여 쥐들의 침입을 막는 전략 게임입니다.
다양한 특성을 가진 타워들을 적절히 배치하고 업그레이드하여 최대한 오래 버텨보세요!

![image](https://github.com/user-attachments/assets/ca189996-d165-4839-9da9-d43b623e5d24)

## 게임 특징
- 다양한 타워! => 각기 다른 특성을 가진 고양이 타워들로 전략적 플레이<br>

![image](https://github.com/user-attachments/assets/4780cb66-578e-4297-83f3-c31bf093fad0)

<br>

- 타워 강화! => 골드를 모아 타워를 강화하고 더 강력한 공격력 획득<br>

![image](https://github.com/user-attachments/assets/d56179ff-1957-4ba2-ae67-c1883b60c572)

<br>

- 웨이브 시스템! => 라운드가 진행될수록 더욱 강력해지는 적들과의 전투<br>

![image](https://github.com/user-attachments/assets/5ccb99a6-13da-4e3c-94dd-3a149747be5b)

<br>

- 랭킹 시스템! => 다른 플레이어들과 기록을 비교하며 경쟁<br>

![image](https://github.com/user-attachments/assets/e40553d9-82f1-4b5b-96ff-1dd83adeefa5)

<br>

# 프로젝트 개발 과정
## 와이어 프레임

![image](https://github.com/user-attachments/assets/536dd174-1b16-484b-b3af-c61717440db9)

<br>

## 파일 구조

``` txt
📦 
.gitignore
.prettierrc
├─ README.md
├─ package.json
├─ prisma
│  └─ schema.prisma
public
│  ├─ assets
│  │  ├─ monster.json
│  │  ├─ monster_unlock.json
│  │  └─ tower.json
│  ├─ htmls
index.html
login.html
modalHTMLs
│  │  │  ├─ gameOverModal.html
│  │  │  ├─ loginModal.html
│  │  │  └─ registerModal.html
register.html
│  │  └─ test.html
│  ├─ images
│  └─ src
│     ├─ base.js
│     ├─ constants.js
│     ├─ game.js
│     ├─ grid.js
│     ├─ monster.js
│     ├─ path.js
│     ├─ socket.js
│     ├─ tower.js
│     ├─ towerControl.js
│     └─ webpages
│        ├─ modals
│        │  ├─ gameOverModal.js
│        │  ├─ loginModal.js
│        │  └─ registerModal.js
│        └─ pages
│           ├─ common.js
│           └─ mainPage.js
├─ src
│  ├─ app.js
│  ├─ handlers
│  │  ├─ base.hanlder.js
│  │  ├─ game.handler.js
│  │  ├─ handlerMapping.js
│  │  ├─ helper.js
│  │  ├─ monster.handler.js
│  │  ├─ register.handler.js
│  │  ├─ round.handler.js
│  │  └─ tower.handler.js
│  ├─ init
│  │  ├─ assets.js
│  │  └─ socket.js
│  ├─ middlewares
│  │  └─ auth.middleware.js
│  ├─ models
│  │  ├─ rank.model.js
│  │  ├─ roundInfo.model.js
│  │  ├─ tower.model.js
│  │  ├─ user.model.js
│  │  └─ userData.model.js
│  ├─ routes
│  │  ├─ rank.router.js
│  │  └─ user.router.js
│  └─ utils
│     └─ prisma
│        └─ index.js
└─ yarn.lock
```
<br>

## 패킷 구조
https://docs.google.com/spreadsheets/d/1ofOjLuqbQLizO0p6cQfGeLKSvWPgz5VZdwNqiwrR-ps/edit?usp=sharing
### 공통 패킷

| 필드 명          | 타입     | 설명                         |
| ------------- | ------ | -------------------------- |
| userId        | INT    | 요청을 보내는 유저의 ID             |
| handlerId     | INT    | 요청을 처리할 서버 핸들러의 ID         |
| clientVersion | STRING | 현재 클라이언트 버전 (”1.0.0”) (고정) |
| payload       | JSON   | 요청 내용                      |

### 이벤트별 패킷 예시

| 필드 명      | 타입   | 설명                   |
| --------- | ---- | -------------------- |
| type      | INT  | 타워 에셋에서 정의된 타워의 Type |
| x         | JSON | 타워의 설치 좌표            |
| y         | JSON | 타워의 설치 좌표            |
| timestamp | DATE | 타워가 설치된 시각           |
| index     | INT  | 타워 배열에서의 인덱스 값       |

## 필수 기능 리스트
``` txt
1. 회원가입 / 로그인 기능
client| public/src/webpages/pages/mainPage.js
회원가입과 로그인 기능 관리하는 js

2. 유저 별 게임 데이터 관리
server| src/models/userData.model.js

3. 클라이언트가 서버로부터 수신하는 이벤트 종류 정의 및 코드 구현
4. 클라이언트가 서버로 송신하는 이벤트 종류 정의 및 코드 구현
client| public/src/socket.js
server| src/register.handler.js

5. 유저 별 최고 기록 스코어 저장
server| src/rank.model.js
```
<br>

## 필수 기능 구현
1. 회원가입 / 로그인 기능<br>
![image](https://github.com/user-attachments/assets/e5ba5383-e073-4406-8440-54c8034b1fb8)


2. 유저별 게임 데이터 관리<br>
```js
const userData = {};

export const createUserData = (uuid) => {
	userData[uuid] = {};
};

export const getUserData = (uuid) => {
	return userData[uuid];
};

export const setUserData = (uuid, round, timestamp, gold) => {
	userData[uuid] = { round, timestamp, gold };
};
```

3. 클라이언트가 서버로부터 수신하는 이벤트<br>
(웹소켓 이벤트 명세서 표를 첨부할 테니 반드시!! 본인 파트 작성해주세요)

| 핸들러 ID | 핸들러 함수명           | payload                                                             | 역할                                                      |
| ------ | ----------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| 2      | gameStart         | none                                                                | 유저 라운드를 생성                                              |
| 3      | gameOver          | timestamp,round                                                     | 게임 종료 시 최종 검증                                           |
| 5      | createTower       | type, x, y, timestamp, index                                        | 서버에 타워 기록                                               |
| 6      | sellingTower      | x, y, type                                                          | 서버에 타워 삭제                                               |
| 7      | upgradeTower      | type, x, y, level                                                   | 유저 타워 데이터 갱신                                            |
| 8      | updateUserGold    | monster.gold                                                        | 유저 골드 업데이트                                              |
| 11     | moveRoundHandler  | round, score, monsterkill, gold, timenow, 등등 점수 검증에 필요한 것들.         | 라운드 넘어갈때 시간 저장(시간 확인용), 점수, 몬스터 킬수 등등 저장해서 게임 엔드에서 검증용. |
| 12     | stopCreateMonster |                                                                     | 몬스터의 생성 주기를 막기 위함                                       |
| 13     | monsterCreate     | round                                                               | roundInfo의 생성주기를 round로 가져와서 계산 후 생성주기마다 클라에게 송신        |
| 14     | attackTower       | atteckerX ,atteckerY , hitEntity ,x ,y , timestemp , feverTriggered | 타워가 타격할때 정보를 서버에 저장.                                    |
| 20     | setBaseInitHp     |                                                                     | 게임 최초 시작 시 Base 의 디폴트 체력을 받아와 설정하기 위함                   |

5. 클라이언트가 서버로 송신하는 이벤트<br>
(웹소켓 이벤트 명세서 표를 첨부할 테니 반드시!! 본인 파트 작성해주세요)

| 핸들러ID | data                               |
| ----- | ---------------------------------- |
| 2     | initRoundInfo, unlockMonsters      |
| 3     | message, userName, highScore, time |
| 5     |                                    |
| 6     |                                    |
| 7     |                                    |
| 8     |                                    |
| 11    | nextRoundInfo, unlockMonsters      |
| 12    |                                    |
| 13    |                                    |
| 14    |                                    |
| 20    | baseInitHp                         |

## 도전 기능 리스트
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

## 도전 기능 구현
1. 타워 환불 & 업그레이드 기능<br>

![image](https://github.com/user-attachments/assets/d56179ff-1957-4ba2-ae67-c1883b60c572)

<br>

### addEventListener로 클릭 이벤트 감지
#### 환불 버튼 
- 클라이언트: 타워 객체 삭제 후 골드 환불, 서버로 데이터 송신 
- 서버: 클라이언트로부터 수신받은 데이터 검증, 검증 결과 반환
#### 업그레이드 버튼
- 클라이언트 : 타워 데이터 업데이트, 골드 차감, 서버로 데이터 송신
- 서버: 클라이언트로부터 수신받은 데이터 검증, 검증 결과 반환

3. 그리드 형식의 맵으로 변경
#### 랜덤 워크 이론이란?
주어진 공간에서 매 순간 랜덤으로, 즉 확률적으로 이동하는 모습을 수학적으로 표현한 알고리즘
#### (1) 기본적인 변수 선언
```js
const path = [];
const visited = new Set(); // 방문한 좌표를 저장하는 Set
let currentX = start.x;
let currentY = start.y;

// 시작점 추가
path.push({ x: currentX, y: currentY });
visited.add(`${currentX},${currentY}`); // 방문한 좌표 추가

// 이동 가능한 방향 (상하좌우)
const directions = [
		{ x: 1, y: 0 },   // 오른쪽
		{ x: -1, y: 0 },  // 왼쪽
		{ x: 0, y: 1 },   // 위쪽
		{ x: 0, y: -1 }   // 아래쪽
];
```
#### (2) 랜덤한 경로 생성
조건 1 : 몬스터가 이미 지나간 좌표는 다시 지나갈 수 없다.
조건 2 : 타워를 설치하기 위해, 몬스터는 반드시 “2칸씩” 움직여야 한다.
```js
while (path.length < minlength) {
	const possibleMoves = directions
		.map((dir) => ({
			dir,
			mid: { x: currentX + dir.x, y: currentY + dir.y }, // 중간 좌표
			final: { x: currentX + dir.x * 2, y: currentY + dir.y * 2 }, // 최종 좌표
		}))
		.filter(
			(move) =>
				!visited.has(`${move.mid.x},${move.mid.y}`) && // 중간 좌표 미방문
				!visited.has(`${move.final.x},${move.final.y}`) && // 최종 좌표 미방문
				move.final.x >= Math.min(start.x, end.x) &&
				move.final.x <= Math.max(start.x, end.x) && // x 범위 체크
				move.final.y >= Math.min(start.y, end.y) &&
				move.final.y <= Math.max(start.y, end.y), // y 범위 체크
		);
		if (possibleMoves.length === 0) {
	// 더 이상 이동할 수 없는 경우 경로를 재생성
	return generatePath(start, end, minlength);
}
```

4. 피버 타임 기능
![image](https://github.com/user-attachments/assets/7434e522-e685-4142-990d-4aad956ffce0)

