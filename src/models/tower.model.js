const towers = {};
const towersqueue = {};
const attackSheets = {};

//타워 만들기.
export const createTower = (uuid) => {
    towers[uuid] = [];
}


//유저 보기.
export const getTower = (uuid) => {
    return towers[uuid];
}

//타워 추가
export const setTower = (uuid, type, x, y, level, timestamp) => { //여기서, 공속, 사거리, 그런걸 확인해야함.피버타입인걸 확인해야 겠는데.
    return towers[uuid].push({ type, x, y, level, timestamp });
}



//타워 판매
export const removeTower = (uuid, x, y) => {
    const index = towers[uuid].findIndex((tower) => tower.x === x && tower.y === y );
  if (index !== -1) {//-1이면 없는거니까 뭐..
    towers[uuid].splice(index, 1)[0];
    return true;
  }
  return false;
};

//레벨 업 타워
export const upTower = (uuid, x, y, level) => {
    const index = towers[uuid].findIndex((tower) => tower.x === x && tower.y === y );
  if (index !== -1) {//-1이면 없는거니까 뭐..
    if(towers[uuid][index].level + 1 === level);
    {
      towers[uuid][index].level += 1;
      return true;
    }
    
  }
  return false;
};

//타워 인벤토리
export const createTowerQueue = (uuid) => {
  towersqueue[uuid] = [];
}

//타워 인벤토리 가져오기.
export const getTowerQueue = (uuid) => {
  return towersqueue[uuid];
}

//타워 인벤토리 추가. //여기서 5개 이하면 뭐 추가되게 로직을 짜기.
export const setTowerQueue = (uuid, towers) => { //towers는 에셋.
  while (towersqueue[uuid].length < 5) {
    const towerDataIndex = Math.floor(Math.random() * (towers.data.length));
    towersqueue[uuid].push({towerDataIndex});
  }
  
}

//타워인벤토리의 타워 지정하면, 그 타워가 사라짐.
export const removeTowerQueue = (uuid, index) => {
if (index !== -1) {//-1이면 없는거니까 뭐..
  towersqueue[uuid].splice(index, 1)[0];
  return true;
}
return false;
};


//때린 기록 빈 객체 생성
export const createTowerAttackSheet = (uuid) => {
  attackSheets[uuid] = [];
}


//때린 기록 주기
export const getowerAttackSheet = (uuid) => {
  return attackSheets[uuid];
}



// 타워를 돌려서 타워 너비 안에 있는지 확인. 이건 클라랑 상의해 보기.
export const canPlaceTower = (uuid, x,y) => {
  

}


// 타워를 돌려서 타워의  공격 범위 안에 있는지 확인. 이건 클라랑 상의해 보기.
export const canRangeTower = (uuid, x,y ,towerid) => {


}