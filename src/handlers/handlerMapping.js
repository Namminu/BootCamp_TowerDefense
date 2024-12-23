import { gameEnd, gameStart } from "./game.handler.js";
import { moveStageHandler } from "./stage.handler.js";


const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    5: createTower, //타워 만들때. 어디에 무슨타워를 생성했는지. 
    6: sellingTower, //타워를 판매할때.
    7: upgradeTower, //업그레이드 할때. 
    8: killMonsters, //몬스터를 죽일때.
    11: moveRoundHandler, //라운드를 이동할때.
}

export default handlerMappings