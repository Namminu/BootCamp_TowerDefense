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

export function drawGridAndPath(ctx, cellSize, path) {
	const canvasWidth = ctx.canvas.width;
	const canvasHeight = ctx.canvas.height;

	// 배경 이미지로 채우기
	const grassImage = new Image();
	grassImage.src = './images/path/grass.png';
	ctx.drawImage(grassImage, 0, 0, canvasWidth, canvasHeight);

	// path를 이미지로 채우기
	const pathImage = new Image();
	pathImage.src = './images/path/cheese4.png';

	path.forEach((point) => {
		const cellX = point.x * cellSize.WIDTH;
		const cellY = point.y * cellSize.HEIGHT;
		ctx.drawImage(pathImage, cellX, cellY, 280 / 2.5, 320 / 2.5);
	});

	// 그리드 선 그리기
	ctx.strokeStyle = 'grey'; // 그리드 선 색상
	ctx.lineWidth = 1;

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
}
