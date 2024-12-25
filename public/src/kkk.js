  canvas.addEventListener("click", (event) => { //실제로 설치
    if (isPlacingTower && previewTower) {
      if (canPlaceTower(previewTower.x, previewTower.y)) {
        towers.push(new Tower(previewTower.x, previewTower.y, previewTower.cost, previewTower.type, previewTower.image)); 
        isPlacingTower = false;
        previewTower = null;
        document.body.style.cursor = "default"; // 기본 커서로 복원
      } else {
        console.log("이 위치에는 타워를 배치할 수 없습니다. 다른 위치를 선택하세요."); // 배치 불가 경고
      }
    }});


    // 우클릭으로 타워 배치 취소
canvas.addEventListener("contextmenu", (event) => {
    if (isPlacingTower) {
      event.preventDefault(); // 우클릭 기본 메뉴 방지
      isPlacingTower = false;
      previewTower = null;
      document.body.style.cursor = "default"; // 커서 복원
    }
  });
  

  draw(ctx, isPreview = false, canPlace = true) {
    if (isPreview) {
      ctx.globalAlpha = 0.5; // 투명도 설정


      if (!canPlace) {
        // 설치가 불가능할 경우 빨간색 오버레이
        ctx.globalAlpha = 0.5; // 오버레이 투명도
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }ctx.globalAlpha = 1.0;
    } else {
      // 정식 타워를 그릴 때는 원래 이미지 사용
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }