import { Tower } from "./tower.js";

export class TowerControl {
    constructor() {
      this.towers = []; // 설치된 타워들을 관리하는 배열
    }

    addTower(x, y, cost) {
        const newTower = new Tower(x, y, cost);
        this.towers.push(newTower);
        return newTower;
      }

    drawAndUpdateTowers(ctx, towerImage) {
        this.towers.forEach((tower) => {
          tower.draw(ctx, towerImage);
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