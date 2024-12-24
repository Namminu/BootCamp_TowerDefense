import { Tower } from "./tower.js";
import towerData from "../assets/tower.json" with { type: "json" };

export class TowerControl {
  constructor(ctx, towerImages) {
    this.ctx = ctx; // 캔버스 컨텍스트
    this.canvas = ctx.canvas; // 캔버스
    this.towerImages = towerImages.map((ele) => ele.image); // 타워 이미지 배열
    this.towerId = towerImages.map((ele) => ele.id); // 타워 이미지 아이디 배열
    this.towers = []; // 설치된 타워들을 관리하는 배열
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  addTower(x, y) {
    const index = this.getRandomNumber(0, this.towerImages.length - 1);
    const image = this.towerImages[index];
    const damage = towerData.data[index].damage;
    const range = towerData.data[index].range;
    const cost = towerData.data[index].cost;
    const newTower = new Tower(this.ctx, x, y, damage, range, cost, image);
    this.towers.push(newTower);
    return newTower;
  }

  drawAndUpdateTowers() {
    this.towers.forEach((tower) => {
      tower.draw();
      tower.updateCooldown();
    });
  }

  attackMonstersInRange(monsters) {
    this.towers.forEach((tower) => {
      monsters.forEach((monster) => {
        const distance = Math.sqrt(
          Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
        );
        if (distance < tower.range) {
          tower.attack(monster);
        }
      });
    });
  }
}
