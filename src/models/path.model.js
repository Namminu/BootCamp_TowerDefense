const paths = {}; // { uuid: path }
const monsterPaths = {}; // { uuid: path }

const startPoint = { x: 0, y: 0 };
const endPoint = { x: 16, y: 4 };
const cellSize = { WIDTH: 280 / 2.5, HEIGHT: 320 / 2.5 };

export const initPath = (uuid) => {
	paths[uuid] = generatePath(startPoint, endPoint);
	monsterPaths[uuid] = setMonsterPathFromGeneratedPath(paths[uuid]);
};

export const getPath = (uuid) => {
	return paths[uuid];
};

export const getMonsterPath = (uuid) => {
	return monsterPaths[uuid];
};

function setMonsterPathFromGeneratedPath(path) {
	// generatePath 결과를 기반으로 몬스터 경로 설정
	const generatedPath = path;
	if (!generatedPath || generatedPath.length === 0) {
		console.error('Path generation failed or empty.');
		return [];
	}

	// 캔버스 좌표로 변환
	return generatedPath.map((point) => ({
		x: point.x * cellSize.WIDTH,
		y: point.y * cellSize.HEIGHT,
	}));
}

export function generatePath(start, end, minlength = 40) {
	let path = [];
	const visited = new Set(); // 방문한 좌표를 저장하는 Set
	let currentX = start.x;
	let currentY = start.y;

	// 시작점 추가
	path.push({ x: currentX, y: currentY });
	visited.add(`${currentX},${currentY}`); // 시작 지점을 방문 처리

	// 이동 가능한 방향 (상하좌우)
	const directions = [
		{ x: 1, y: 0 }, // 오른쪽
		{ x: -1, y: 0 }, // 왼쪽
		{ x: 0, y: 1 }, // 아래쪽
		{ x: 0, y: -1 }, // 위쪽
	];

	// 경로 생성
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

		const nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

		// 중간 좌표 추가
		path.push(nextMove.mid);
		visited.add(`${nextMove.mid.x},${nextMove.mid.y}`); // 방문 처리

		// 최종 좌표 추가
		currentX = nextMove.final.x;
		currentY = nextMove.final.y;
		path.push({ x: currentX, y: currentY });
		visited.add(`${currentX},${currentY}`); // 방문 처리
	}

	return path;
}
