// 몬스터 데이터 asssets/monster.json 파일에서 가져오기
// 현재 하드코딩 되어 있는 부분들 (이동 속도, 공격력, 체력 등) 변경

export class Monster {
  constructor(path, level, monsterConfig) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }

    this.monsterNumber = Math.floor(Math.random() * monsterConfig.length); // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)

    // monster.json 데이터 가져오기
    const monsterData = monsterConfig[this.monsterNumber];

    console.log(monsterData);

    this.id = monsterData.id;
    this.name = monsterData.name;

    this.path = path; // 몬스터가 이동할 경로
    this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
    this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
    this.width = 80; // 몬스터 이미지 가로 길이
    this.height = 80; // 몬스터 이미지 세로 길이
    this.level = level; // 몬스터 레벨

    // 이미지 로드
    this.image = new Image();
    this.image.src = monsterData.image;

    // monster.json 데이터 기반으로 초기화
    this.maxHp = monsterData.hp * level;
    this.hp = this.maxHp;
    this.attackPower = monsterData.damage * level;
    this.speed = monsterData.speed;
    this.gold = monsterData.gold;
    this.isDead = false; // 몬스터가 죽었는지 여부

    // 따로 정보를 보내줘야 한다.
    // class round
    // Gold
    // const deadMonsterData  = { id: "monsterId", coordinate: {x,y} ,"상태이상 걸린 정보": { slow: "timestamp 형식" } ,"태어난 시간": "timestamp 형식"}
    // basehp

    // this.speed = 2; // 몬스터의 이동 속도
  }
  //생성 시간 추가해서 경로와 속도를 계산 살아있어야 할 시간보다 오래살아 있다면 ..버그를 쓴거겠지.
  // init(level) {
  //   this.maxHp = 100 + 10 * level; // 몬스터의 현재 HP
  //   this.hp = this.maxHp; // 몬스터의 현재 HP
  //   this.attackPower = 200 + 1 * level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  // }

  move(base) {
    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      // 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < this.speed) {
        // 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
        this.currentIndex++;
      } else {
        // 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
        this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
        this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
      }
      return false;
    } else {
      const isDestroyed = base.takeDamage(this.attackPower); // 기지에 도달하면 기지에 데미지를 입힙니다!
      this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
      return isDestroyed;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(
      `(레벨 ${this.level}) ${this.hp}/${this.maxHp}`,
      this.x,
      this.y - 5
    );
  }

  dead() {
    this.isDead = true; // 몬스터를 죽음 상태로 표시
  }
}
