import { Monster } from './monster.js';
import monsterData from '../assets/monster.json' with { type: 'json' };

class MonsterController {
	NUM_OF_MONSTERS = monsterData.data.length;
    monsterImages = {};
    monsterHitImages = {};
    monsterDieImages = {};

	unlockedMonsters = [];
    monsters = [];
    
    round = 0;
    duration = 3;
    remain_duration = duration;
    count_of_spawn;
    timer = 0;

    monsterLevel = 1;
    killCount = 0;
    
    path = null;

	constructor(ctx) {
		this.ctx = ctx;
        
        for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
            const img = new Image();
            img.src = `images/monster${i}.png`;
            this.monsterImages[i] = img;
        }
	}
    
    // 라운드 초기값 세팅, roundInfo, path, base 선행 필요
    setRound(round, duration, count, timer, unlockedMonsters, path, base){
        this.round = round;
        this.duration = duration;
        this.count_of_spawn = count;
        this.timer = timer;
        this.unlockedMonsters = unlockedMonsters;
        this.path = path;
        this.base = base;
    }    

	spawnMonster() {
        console.log('몬스터가 생성되었습니다!');

        // unlockedMonster 중에서 선택하여 몬스터 스폰
        let rand = Math.floor(Math.random()*this.unlockedMonsters.length);
        const monster_data = this.unlockedMonsters[rand];
        const img = this.monsterImages[monster_data.monster_id];
        const x = -100;
        const y = 100;

        const monster = new Monster(this.path);
        this.monsters.push(monster);
    }

	update(gameSpeed, deltaTime) {
		if (this.remain_duration <= 0) {
			this.spawnMonster();
			this.remain_duration = this.duration;
		}
		this.remain_duration -= deltaTime;
        this.timer -= deltaTime;

		// 각 객체의 좌표,이미지 업데이트
		this.monsters.forEach(monster => {
			monster.update(gameSpeed, deltaTime);
		});

        this.monsters.map(monster => monster.move(base));
		this.monsters = this.monsters.filter(monster => !monster.isDead);
	}

	draw() {
		this.monsters.forEach(monster => monster.draw());
	}

    // sprite.x, sprite.y 필요
	collideWith(sprite) {
		const collidedItem = this.enemies.find(enemy => enemy.collideWith(sprite));
		return this.enemies.some(enemy => enemy.collideWith(sprite));
	}

	reset() {
		this.monsters = [];
	}

	unlockMonsters(unlockMonsters) {
		this.unlockMonsters = unlockMonsters;
	}

    
	collideWithAttack(attack) {
		const collidedMonsters = this.monsters.filter(monster => monster.collideWithAttack(attack));
		return this.monsters.some(monster => monster.collideWithAttack(attack));
	}

    collideWith(sprite) {
		const collidedMonsters = this.monsters.filter(enemy => enemy.collideWith(sprite));
		return this.enemies.some(enemy => enemy.collideWith(sprite));
	}
}

export default MonsterController;
