// 여기선 유저의 타워를 확인하고, 골드를 확인하고, 몬스터 잡을때 그 타워의 거리를 확인함.
// 여기서 유저 골드도 확인해야 할듯. 알맞게 설치가 되고 있는지.
// 몬스터 잡을때 올리면 되고.
import { getTower, removeTower, setTower, upTower } from "../models/tower.model";

export const createTower = (userId, payload) => {

let currentTowers = getTower(userId);

const width = 78; // 타워 너비
const height = 150; // 타워 높이

const newTowerX = payload.x;
const newTowerY = payload.y;

const isTooClose = currentTowers.some((tower) => {
    const dx = tower.x - newTowerX;
    const dy = tower.y - newTowerY;

    const distance = Math.sqrt(dx * dx + dy * dy); 
    return distance < (width / 2 + height / 2); 
});

if (isTooClose) {
    return { status: 'fail', message: "타워가 너무 가까워서 배치할 수 없습니다." };
}

//유저 돈. --> 1. 지금빼기. 2. 타워를 산 돈을 누적해 두기.--> 판매할 수도 있기때문에.

setTower(userId, payload.x, payload.y ,payload.range, payload.attackPower, payload.cost, payload.cooldown, payload.level);

return { status: 'success', message: "타워 배치 성공적." };
};

export const sellingTower = (userId, payload) => {

    const isRemoved = removeTower(userId, payload.x, payload.y);

    if (!isRemoved) {
        return { status: 'fail', message: '타워가 없음' };
    } 
      

    return { status: 'success', message: '판매 완료.' };
};

export const upgradeTower = (userId, payload) => {

    const isUpgrade = upTower(userId, payload.x, payload.y, payload.level); //이 레벨을 올라가고 싶은 레벨임.

    if (!isUpgrade) {
        return { status: 'fail', message: '업그레이드 실패' };
    } 
      

    return { status: 'success', message: '업그레이드 성공' };


};
