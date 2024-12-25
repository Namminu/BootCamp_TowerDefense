export class Tower {
  constructor(ctx, x, y, damage, range, cost, image, type, id, level = 1) {
    // 코스트랑 타입은 에셋에서 다운받아서 넣어준다.
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.ctx = ctx; // 캔버스 컨텍스트
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 220 / 1.5; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 270 / 1.5; // 타워 이미지 세로 길이
    this.damage = damage; // 타워 공격력
    this.range = range; // 타워 사거리
    this.originalDamage = damage; // 타워 공격력
    this.originalRange = range; // 타워 사거리
    this.cost = cost; // 타워 구입 비용
    this.cooldown = 0; // 타워 공격 쿨타임
    this.beamDuration = 0; // 타워 광선 지속 시간
    this.target = null; // 타워 광선의 목표
    this.type = type; // 타워 타입
    this.id = id;
    this.level = level;
    this.image = image;
    this.feverMode = false;
    this.isMouseOver = false;
    this.isClicked = false;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // 타워 광선 그리기
    let beamColor;
    switch (this.type) {
      case 1:
        beamColor = "blue"; // 원거리일 때 파란색
        break;
      case 2:
        beamColor = "red"; // 근거리일 때 빨간색
        break;
      case 3:
      default:
        beamColor = "gray"; // 기본은 회색
        break;
    }

    if (this.beamDuration > 0 && this.target) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      this.ctx.lineTo(
        this.target.x + this.target.width / 2,
        this.target.y + this.target.height / 2
      );
      this.ctx.strokeStyle = beamColor;
      this.ctx.lineWidth = 10;
      this.ctx.stroke();
      this.ctx.closePath();
      this.beamDuration--;
    }
  }

  drawRangeCircle() {
    // 타워 사정거리를 나타내는 원 그리기
    this.ctx.beginPath();
    this.ctx.arc(
      this.x + this.width / 2, // 타워 중심의 x좌표
      this.y + this.height / 2, // 타워 중심의 y좌표
      this.range, // 사정거리 (반지름)
      0, // 시작 각도
      2 * Math.PI // 끝 각도 (360도)
    );
    this.ctx.strokeStyle = "white"; // 빨간색
    this.ctx.lineWidth = 5; // 선 두께
    this.ctx.stroke(); // 선 그리기
    this.ctx.closePath();
    this.ctx.fillStyle = "rgba(254, 235, 255, 0.67)"; // 투명도 조절
    this.ctx.fill(); // 원 내부 채우기
  }

  attack(monster) {
    // 타워가 타워 사정거리 내에 있는 몬스터를 공격하는 메소드이며 사정거리에 닿는지 여부는 game.js에서 확인합니다.
    if (this.cooldown <= 0) {
      monster.hp -= this.damage;
      this.cooldown = 180; // 3초 쿨타임 (초당 60프레임)
      this.beamDuration = 30; // 광선 지속 시간 (0.5초)
      this.target = monster; // 광선의 목표 설정

      if (this.feverMode) {
        this.cooldown = 90; // 1.5초 쿨타임
      }
    }
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }

  async feverTime() {
    this.feverMode = true;

    this.damage = 1.5 * this.originalDamage;
    this.range = 1.2 * this.originalRange;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.damage = this.originalDamage;
        this.range = this.originalRange;
        this.feverMode = false;

        resolve();
      }, 5000);
    });
  }

  showTowerInfo(tower) {
    const infoX = tower.x - tower.width - 10; // 타워 왼쪽에 표시
    const infoY = tower.y;

    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(infoX, infoY, 150, 100); // 정보창 배경

    this.ctx.fillStyle = "white";
    this.ctx.font = "14px Arial";
    this.ctx.fillText(`ID: ${tower.id}`, infoX + 10, infoY + 20);
    this.ctx.fillText(`Damage: ${tower.damage}`, infoX + 10, infoY + 40);
    this.ctx.fillText(`Range: ${tower.range}`, infoX + 10, infoY + 60);
    this.ctx.fillText(`Level: ${tower.level}`, infoX + 10, infoY + 80);
  }
}
