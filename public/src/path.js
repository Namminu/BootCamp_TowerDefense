function generatePath(start, end) {
	const path = [];
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
	while (currentX !== end.x || currentY !== end.y) {
		// 가능한 이동 방향 필터링
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
			// 이동 가능한 방향이 없으면 경로 생성 중단
			break;
		}

		// 무작위로 가능한 이동 방향 중 선택
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

function drawPathInConsole(start, end, path) {
	const gridWidth = Math.max(start.x, end.x) + 1; // 그리드의 너비
	const gridHeight = Math.max(start.y, end.y) + 1; // 그리드의 높이
	const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('■')); // '■'으로 채운 2D 배열 생성

	// 경로를 그리드에 표시
	path.forEach((point) => {
		grid[point.y][point.x] = '□'; // 경로를 '□'으로 표시
	});

	// 그리드를 콘솔에 출력
	grid.forEach((row) => {
		console.log(row.join(' ')); // 각 행을 출력
	});
}

// 사용 예시
const startPoint = { x: 0, y: 0 };
const endPoint = { x: 10, y: 5 };

const generatedPath = generatePath(startPoint, endPoint);
console.log('Generated Path:', generatedPath);
drawPathInConsole(startPoint, endPoint, generatedPath);
