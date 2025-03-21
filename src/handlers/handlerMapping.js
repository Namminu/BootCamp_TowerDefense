import { gameOver, gameStart, updateUserGold } from './game.handler.js';
import { atteckTower, buyTower, sellingTower, upgradeTower } from './tower.handler.js';
import { monsterCreate, stopCreateMonster } from './monster.handler.js';
import { moveRoundHandler } from './round.handler.js';
import { setBaseInitHp } from './base.hanlder.js';
// import { moveStageHandler } from "./stage.handler.js";

const handlerMappings = {
	2: gameStart, // 게임 첫 시작
	3: gameOver, // 모든 게임이 끝났을 때
	5: buyTower, // 타워 만들때. 어디에 무슨타워를 생성했는지.
	6: sellingTower, // 타워를 판매할때.
	7: upgradeTower, // 업그레이드 할때.
	8: updateUserGold, // 유저 골드 업데이트
	11: moveRoundHandler, // 라운드를 이동할때.
	12: stopCreateMonster, // 몬스터 생성 중지 핸들러
	13: monsterCreate, // 몬스터 생성 핸들러
	14: atteckTower,
	20: setBaseInitHp
	// 라운드 종료 핸들러?
};

export default handlerMappings;

//
