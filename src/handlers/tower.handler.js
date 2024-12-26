// 여기선 유저의 타워를 확인하고, 골드를 확인하고, 몬스터 잡을때 그 타워의 거리를 확인함.
// 여기서 유저 골드도 확인해야 할듯. 알맞게 설치가 되고 있는지.
// 몬스터 잡을때 올리면 되고.
import { getGameAssets } from "../init/assets.js";
import { getTower, getTowerQueue, removeTower, removeTowerQueue, setTower, setTowerQueue, upTower } from "../models/tower.model.js";
import { getUserData } from "../models/userData.model.js";

//페이로드는 1. 인덱스. 2. 타입번호 3. 좌표 4.타임스템프.
export const buyTower = (userId, payload) => {

    const { towers } = getGameAssets();
    const currentUserData = getUserData(userId);
    let currentTowersQueue = getTowerQueue(userId);
    const selectedTower = null;
    console.log()

    const selectedTowerInQueue = currentTowersQueue[payload.index];

    if (selectedTowerInQueue && selectedTowerInQueue.type === payload.type) {
        selectedTower = towers.data.find(tower => tower.type === payload.type);
        if (!selectedTower) {
            return { status: 'fail', message: "타워를 찾을 수 없음" };
        }

        if (currentUserData.gold < selectedTower.cost) {
            return { status: 'fail', message: "돈이 부족함" }; 
        }
        

    }

    const towerWidth = 220 / 1.5;
    const towerHeight = 270 / 1.5;
    const newTowerCenterX = payload.x + towerWidth / 2;
    const newTowerCenterY = payload.y + towerHeight / 2;

    let currentTowers = getTower(userId);

     for (const tower of currentTowers) {

    const towerCenterX = tower.x + tower.width / 2;
    const towerCenterY = tower.y + tower.height / 2;

    const distance = Math.sqrt(
        Math.pow(towerCenterX - newTowerCenterX, 2) +
          Math.pow(towerCenterY - newTowerCenterY, 2)
      );

    // 두 타워의 중심 간 거리가 타워 너비 이상이어야 설치 가능
    if (distance < 250) {
        return { status: 'fail', message: '타워가 겹쳐서 설치할 수 없습니다.' };
    }
  }

  removeTowerQueue(userId, payload.index);
  

  currentUserData.gold -= selectedTower.cost;
  setUserGold(userId, currentUserData.gold);
  setTowerQueue(userId, towers);
  setTower(userId, payload.type, payload.x, payload.y, level = 1, payload.timestamp );

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