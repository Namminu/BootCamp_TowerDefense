//그리드를 화면에 그릴 함수
export function drawGrid(ctx, cellSize) {
	const canvasWidth = 1920;
	const canvasHeight = 720;

	ctx.strokeStyle = 'black'; // 그리드 색상
	ctx.lineWidth = 1;

	// 수평선 그리기
	for (let y = 0; y <= canvasHeight; y += cellSize.HEIGHT) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvasWidth, y);
		ctx.stroke();
	}

	// 마지막 수평선: 캔버스의 하단 끝에 추가
	ctx.beginPath();
	ctx.moveTo(0, canvasHeight);
	ctx.lineTo(canvasWidth, canvasHeight);
	ctx.stroke();

	// 수직선 그리기
	for (let x = 0; x <= canvasWidth; x += cellSize.WIDTH) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
		ctx.stroke();
	}

	// 마지막 수직선: 캔버스의 우측 끝에 추가
	ctx.beginPath();
	ctx.moveTo(canvasWidth, 0);
	ctx.lineTo(canvasWidth, canvasHeight);
	ctx.stroke();
}
