// 여기선 유저의 타워를 확인하고, 골드를 확인하고, 몬스터 잡을때 그 타워의 거리를 확인함.
// 여기서 유저 골드도 확인해야 할듯. 알맞게 설치가 되고 있는지.
// 몬스터 잡을때 올리면 되고.
import { getTower, setTower } from "../models/tower.model";

export const createTower = (userId, payload) => {

let currentTowers = getTower(userId);

const width = 78; // 타워 너비
const height = 150; // 타워 높이

const newTowerX = payload.x;
const newTowerY = payload.y;

const isTooClose = currentTowers.some((tower) => {
    const dx = tower.x - newTowerX;
    const dy = tower.y - newTowerY;

    const distance = Math.sqrt(dx * dx + dy * dy); // 유클리드 거리 계산
    return distance < (width / 2 + height / 2); // 겹침 여부 확인
});

if (isTooClose) {
    return { status: 'fail', message: "타워가 너무 가까워서 배치할 수 없습니다." };
}

//유저 돈.

setTower(userId, payload.x, payload.y ,payload.range, payload.attackPower, payload.cost, payload.cooldown, payload.level);

};

export const sellingTower = (userId, payload) => {



};

export const upgradeTower = (userId, payload) => {



};

export const killMonsters = (userId, payload) => {



};