import { Tower } from "./tower.js";
import towerData from "../assets/tower.json" with { type: "json" };

export class TowerControl {
  constructor(ctx, towerImages) {
    this.id = 1;
    this.ctx = ctx; // 캔버스 컨텍스트
    this.canvas = ctx.canvas; // 캔버스
    this.towerImages = towerImages.map((ele) => ele.image); // 타워 이미지 배열
    this.towerId = towerImages.map((ele) => ele.id); // 타워 이미지 아이디 배열
    this.towers = []; // 설치된 타워들을 관리하는 배열
    this.towerInventory = [];
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getTowerInventory() {
    // console.log(`towerImages: ${this.towerImages}`);
    if (this.towerInventory.length === 5) {
      return this.towerInventory;
    }

    while (this.towerInventory.length < 5) {
      const index = this.getRandomNumber(0, this.towerImages.length - 1);
      this.towerInventory.push({
        image: this.towerImages[index],
        name: towerData.data[index].name,
        cost: towerData.data[index].cost,
      });
    }

    console.log(`towerInventory: ${JSON.stringify(this.towerInventory)}`);
  }

  drawInventory(ctx, canvas) {
    // 인벤토리 관련 변수
    const towerPadding = 20; // 타워 간 간격
    const startX = towerPadding; // 첫 번째 타워 시작 위치
    let currentX = startX;

    this.getTowerInventory();
    // 인벤토리 영역 설정
    const inventoryHeight = 250; // 인벤토리 높이
    const inventoryY = canvas.height - inventoryHeight; // 인벤토리 위치
    ctx.fillStyle = "rgba(255, 222, 150, 0.5)";
    ctx.fillRect(0, inventoryY, canvas.width, inventoryHeight);

    const imageWidth = 78;
    const imageHeight = 150;

    this.towerInventory.forEach((tower, index) => {
      ctx.drawImage(tower.image, currentX, inventoryY, imageWidth, imageHeight);

      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`${tower.cost}G`, currentX, inventoryY + imageHeight + 20);
      ctx.fillText(`${tower.name}`, currentX, inventoryY + imageHeight + 40);

      // 영역 업데이트
      currentX += imageWidth + towerPadding;
    });
  }

  buyInventoryTower(x, y, inventoryIndex) {
    const towerName = this.towerInventory[inventoryIndex].name;

    // console.log("towerData.data:", towerData.data);
    // console.log("Searching for towerName:", towerName);

    const index = towerData.data.findIndex((data) => data.name === towerName);

    console.log("index:", index);

    const image = this.towerImages[index];
    const damage = towerData.data[index].damage;
    const range = towerData.data[index].range;
    const cost = towerData.data[index].cost;
    const type = towerData.data[index].type;
    const id = this.id;
    const newTower = new Tower(
      this.ctx,
      x,
      y,
      damage,
      range,
      cost,
      image,
      type,
      id
    );
    // this.towers.push(newTower);

    this.id++;

    return newTower;
  }

  addTower(x, y) {
    const index = this.getRandomNumber(0, this.towerImages.length - 1);
    const image = this.towerImages[index];
    const damage = towerData.data[index].damage;
    const range = towerData.data[index].range;
    const cost = towerData.data[index].cost;
    const type = towerData.data[index].type;
    const id = this.id;
    const newTower = new Tower(
      this.ctx,
      x,
      y,
      damage,
      range,
      cost,
      image,
      type,
      id
    );
    this.towers.push(newTower);

    this.id++;

    return newTower;
  }

  drawAndUpdateTowers() {
    this.towers.forEach((tower) => {
      tower.draw();
      tower.updateCooldown();
    });
  }

  attackMonstersInRange(monsters, score, userGold, monsterLevel) {
    this.towers.forEach((tower) => {
      monsters.forEach((monster) => {
        const distance = Math.sqrt(
          Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
        );
        if (distance < tower.range) {
          tower.attack(monster);
          if (monster.hp <= 0) {
            score += monsterLevel;
            userGold += 10;
          }
        }
      });
    });
  }
}
