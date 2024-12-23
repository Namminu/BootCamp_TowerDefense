import { Monster } from "./monster.js";

const NUM_OF_MONSTERS = 5;

export class MonsterControl {
  constructor() {
    this.monsters = []; // 몬스터 배열
    this.monsterLevel = 1; // 몬스터 레벨
    this.monsterPath = []; // 몬스터 경로
    this.monsterSpawnInterval = 2000; // 몬스터 소환 주기
    this.monsterImages = []; // 몬스터 이미지 배열
  }

  // 몬스터 이미지 로딩
  loadMonsterImages() {
    for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
      const img = new Image();
      img.src = `./images/monster${i}.png`;
      this.monsterImages.push(img);
    }
  }

  // 몬스터 생성
  spawnMonster() {
    this.monsters.push(new Monster(this.monsterPath, this.monsterImages, this.monsterLevel));
  }

  // 몬스터 경로 생성
  generateRandomMonsterPath() {
    const path = [];
    let currentX = 0;
    let currentY = Math.floor(Math.random() * 21) + 500;

    path.push({ x: currentX, y: currentY });

    while (currentX < 1800) {
      currentX += Math.floor(Math.random() * 100) + 50;
      if (currentX > 1800) {
        currentX = 1800;
      }

      currentY += Math.floor(Math.random() * 200) - 100;
      if (currentY < 100) {
        currentY = 100;
      }
      if (currentY > 900) {
        currentY = 900;
      }

      path.push({ x: currentX, y: currentY });
    }

    path[path.length - 1].y = path[0].y;
    path.sort((a, b) => a.x - b.x); // 경로 정렬

    this.monsterPath = path; // 생성된 경로 저장
  }
}