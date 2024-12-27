export function generatePath(start, end, minlength = 40) {
	let path = [];
	const visited = new Set(); // 방문한 좌표를 저장하는 Set
	let currentX = start.x;
	let currentY = start.y;

	// 시작점 추가
	path.push({ x: currentX, y: currentY });
	visited.add(`${currentX},${currentY}`); // 시작 지점을 방문 처리
    // 시작점의 좌표에서 createMonster 함수 사용?

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
        //최종 좌표에 createBase 함수를 가져가기기
	}

	return path;
}

export function drawGridAndPath(ctx, cellSize, path) {
	const canvasWidth = ctx.canvas.width;
	const canvasHeight = ctx.canvas.height;

	// 배경색으로 채우기
	ctx.fillStyle = '#FFFDF0';
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	// 그리드 선 그리기
	ctx.strokeStyle = 'black'; // 그리드 선 색상
	ctx.lineWidth = 2;

	for (let y = 0; y <= canvasHeight; y += cellSize.HEIGHT) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvasWidth, y);
		ctx.stroke();
	}

	for (let x = 0; x <= canvasWidth; x += cellSize.WIDTH) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
		ctx.stroke();
	}

	// path를 노란색으로 칠하기
	ctx.fillStyle = '#FAC67A';
	path.forEach((point) => {
		const cellX = point.x * cellSize.WIDTH;
		const cellY = point.y * cellSize.HEIGHT;
		ctx.fillRect(cellX, cellY, cellSize.WIDTH, cellSize.HEIGHT);
	});
}

// function drawPathInConsole(start, end, path) {
// 	const gridWidth = Math.max(start.x, end.x) + 1; // 그리드의 너비
// 	const gridHeight = Math.max(start.y, end.y) + 1; // 그리드의 높이
// 	const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('■')); // '■'으로 채운 2D 배열 생성

// 	// 경로를 그리드에 표시
// 	path.forEach((point) => {
// 		grid[point.y][point.x] = '□'; // 경로를 '□'으로 표시
// 	});

// 	// 그리드를 콘솔에 출력
// 	grid.forEach((row) => {
// 		console.log(row.join(' ')); // 각 행을 출력
// 	});
// }

// 사용 예시
// const startPoint = { x: 0, y: 0 };
// const endPoint = { x: 13, y: 4 };

// const generatedPath = generatePath(startPoint, endPoint);
// console.log('Generated Path:', generatedPath);
// drawPathInConsole(startPoint, endPoint, generatedPath);