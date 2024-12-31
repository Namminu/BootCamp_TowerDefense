import { getGameAssets } from "../init/assets.js";
import { getMonsterPath } from "./path.model.js";
import { getUserData } from "./userData.model.js";

const monsterPool = {}; // { uuid: [Monster, Monster, ...] }

let increment = 1;

class Monster {
    constructor(path, level, monsterJson) {
        this.path = path;
        this.currentIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
        this.level = level;

        this.id = increment++;
        this.monster_id = monsterJson.id;
        this.name = monsterJson.name;
		this.damage = monsterJson.damage * (1+level*0.1);
		this.maxHp = monsterJson.hp * (1+level*0.1);
		this.hp = this.maxHp;
		this.speed = monsterJson.speed;
		this.gold = monsterJson.gold;
        this.monsterIdelImageIndex = 0;
        this.idleImage = monsterJson.imageSet.idle;
        this.hitImage = monsterJson.imageSet.hit;
		this.isDead = false;
        this.width = monsterJson.width;
        this.height = monsterJson.height;
    }

    move(){
        if(this.currentIndex < this.path.length - 1){
            const nextPoint = this.path[this.currentIndex + 1];
            const deltaX = nextPoint.x - this.x;
            const deltaY = nextPoint.y - this.y;
            const dist = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            if(dist < this.speed ** 2)
                this.currentIndex++;
            else {
                this.x += (deltaX / dist) * this.speed;
                this.y += (deltaY / dist) * this.speed;
            }
            return false;
        }else {
            //base에 도달
            this.dead();
            return true;
        }
    }

	dead() {
		this.isDead = true;
	}
}

export const initMonsterPool = (uuid) => {
    monsterPool[uuid] = [];
}

export const addMonster = (uuid) => {
    const round = getUserData(uuid).round;
	const unlockMonsterIds = getGameAssets().monster_unlock.data.find((e) => e.round_id === round).monster_id;
	const unlockMonsters = getGameAssets().monster.data.filter((e) => unlockMonsterIds.includes(e.id));
    const rand = Math.floor(Math.random()*unlockMonsters.length);
    const monsterJson = unlockMonsters[rand];

    const monster = new Monster(getMonsterPath(uuid), round, monsterJson);
    monsterPool[uuid].push(monster);
}

export const updateMonsters = (uuid) => {
    const monsters = monsterPool[uuid];
    
    for(let index = monsters.length-1; index>=0; index--){
        const monster = monsters[index];
        const destroyed = monster.move();
        if(destroyed) monsters.splice(index, 1);
        
        monster.monsterIdelImageIndex++;
        if(monster.monsterIdelImageIndex>=60) monster.monsterIdelImageIndex = 0;
    }

    
    return monsters;
}

