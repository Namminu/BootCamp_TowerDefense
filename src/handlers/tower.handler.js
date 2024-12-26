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



setTower(userId, payload.x, payload.y, payload.level);

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


export const atteckTower = (userId,payload)=> {

    // 위치 동기화가 된다면. 여기서 타워 공격을 관리하고, 서버에 보내주는 형식으로 해도 괜찮을듯. 검증은 필요 없으니까.
    //타워가 있는지 확인, 사거리가 되는지 확인. 된다면성공 보네주고, 성공이면 저장하게.
    //이건 때리면 즉시.
}


export const killTower = (userId,payload)=> {

    //타워가 있는지 확인, 사거리가 되는지 확인,체력이 공격을 맞아 알맞게 피가 까였는지, 전부 가져와서 공격 속도가 되는지 확인, 성공시 다음으로.
    //애는 리스트를 받고, 그 리스트에 있는 타워를 한번에 가져온뒤(뭐 있음 그 목록안에 있는거만 가져오는. 아냐 타워 개수가 수천개 되는게 아니잖아. 그냥 해도 될듯.). 사거리, 공격 속도 확인.
}