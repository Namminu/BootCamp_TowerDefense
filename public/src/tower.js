export class Tower {
  constructor(x, y, cost, type = 'normal', image, level = 1) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = 40; // 타워 공격력
    this.range = 300; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.type = type;
    this.level = level;
    this.image = image;
  }

  draw(ctx, isPreview = false, canPlace = true) {
    if (isPreview) {
      ctx.globalAlpha = 0.5; // 투명도 설정
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // 투명한 타워 이미지

    //공격범위 표시. 
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2, // 원의 중심 X 좌표 (타워 중심)
      this.y + this.height / 2, // 원의 중심 Y 좌표 (타워 중심)
      this.range, // 반지름 (타워의 공격 범위)
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // 흰색, 투명도 0.5
    ctx.fill();

    if (!canPlace) {
      // 설치가 불가능할 경우 빨간색 오버레이
      ctx.globalAlpha = 0.5; // 오버레이 투명도
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    ctx.globalAlpha = 1.0;
    } else {
      // 정식 타워를 그릴 때는 원래 이미지 사용
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    let beamColor;
    switch (this.type) {
      case 'rage':
        beamColor = 'red'; // 분노 타입일 때 빨간색
        break;
      case 'sadness':
        beamColor = 'blue'; // 슬픔 타입일 때 파란색
        break;
      case 'normal':
      default:
        beamColor = 'gray'; // 기본은 회색
        break;
    }

    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(
        this.target.x + this.target.width / 2,
        this.target.y + this.target.height / 2
      );
      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.attackPower;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}
