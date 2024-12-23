const stage = {};

export const createStage = (uuid) => {
    stage[uuid] = [];
}

//유저 스테이지 보기.
export const getStage = (uuid) => {
    return stage[uuid];
}

export const setStage = (uuid, id, timestamp, itemId) => {
    return stage[uuid].push({ id, timestamp, itemId });
}