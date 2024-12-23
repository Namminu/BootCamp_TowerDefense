export class Tower {
  constructor(x, y, cost, type) {
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = 40 ; // 타워 공격력 (레벨에 비례)
    this.range = 300; // 타워 사거리 (레벨에 따라 증가)
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.type = type; // 타워 타입 (노말, 앵그리, 세드)
    this.level = 1; // 타워 레벨
  }

  draw(ctx, towerImage) {
    // 타워 이미지 그리기
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);

    // 광선 그리기
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(
        this.target.x + this.target.width / 2,
        this.target.y + this.target.height / 2
      );

      // 타입에 따른 광선 색상
      let beamColor;
      switch (this.type) {
        case "angry":
          beamColor = "red";
          break;
        case "sad":
          beamColor = "blue";
          break;
        case "normal":
        default:
          beamColor = "gray";
          break;
      }

      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  attack(monster) {
    // 타워가 공격하는 메소드
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