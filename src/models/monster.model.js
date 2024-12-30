const monsters = {};
let paths = [];
/*
현재 접속중인 유저의 몬스터터 정보
monsters
{
    uuid123 : [ { id, monster_id, x, y }, { monster_id, x, y }
}

paths
{
    uuid123 : path[]
}
*/

export const createMonster = (uuid) => {
    const monster = new Monster(path, level)
	monsters[uuid].push();
};

export const moveMonster = (uuid, id) => {
};

export const cratePath = (uuid) => {
    paths[uuid] = generateRandomMonsterPath();
}


class Monster {
    constructor(path, level){
		this.id = monsterData.id;
		this.name = monsterData.name;

		this.path = path; // 몬스터가 이동할 경로
		this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
		this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
		this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
		this.width = 80; // 몬스터 이미지 가로 길이
		this.height = 80; // 몬스터 이미지 세로 길이
		this.level = level; // 몬스터 레벨

    }
}

function generateRandomMonsterPath() {
	//몬스터 경로이동 함수. 경로를 만드는것. 이걸 정하고 나중에 길 생성하는것.
	const path = [];
	let currentX = 0;
	let currentY = Math.floor(Math.random() * 21) + 400; // 400 ~ 420 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

	path.push({ x: currentX, y: currentY });

	while (currentX < 1800) {
		// 마지막 x가 1600이 될 때까지 진행
		currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
		if (currentX > 1800) {
			currentX = 1800; // 마지막 x는 1600
		}

		currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
		// y 좌표에 대한 clamp 처리
		if (currentY < 100) {
			currentY = 100;
		}
		if (currentY > 900) {
			currentY = 900;
		}

		path.push({ x: currentX, y: currentY });
	}

	// 마지막 경로의 y를 시작 y와 동일하게 설정
	path[path.length - 1].y = path[0].y;

	// 경로 정렬 (x 기준으로 오름차순 정렬)
	path.sort((a, b) => a.x - b.x);

	return path;
}