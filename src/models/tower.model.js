const towers = {};


export const createTower = (uuid) => {
    towers[uuid] = [];
}

//유저 스테이지 보기.
export const getTower = (uuid) => {
    return towers[uuid];
}


export const setTower = (uuid, x, y, range, attackPower, cost, cooldown, level) => { //여기서, 공속, 사거리, 그런걸 확인해야함.피버타입인걸 확인해야 겠는데.
    return towers[uuid].push({ x, y, range, attackPower, cost, cooldown, level });
}

export const removeTower = (uuid, x, y) => {
    const index = towers[uuid].findIndex((tower) => tower.x === x && tower.y === y );
  if (index !== -1) {//-1이면 없는거니까 뭐..
    towers[uuid].splice(index, 1)[0];
    return true;
  }
  return false;
};


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

export const canPlaceTower = (uuid, x,y) => {
  // 타워를 돌려서 타워 너비 안에 있는지 확인. 이건 클라랑 상의해 보기.

}

export const canRangeTower = (uuid, x,y ,towerid) => {
  // 타워를 돌려서 타워의  공격 범위 안에 있는지 확인. 이건 클라랑 상의해 보기.

}