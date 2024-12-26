const roundInfo = {};

// 기본 몬스터 소환 주기
const default_duration = 8000;

// 기본 몬스터 소환 수
const default_count = 5;

// 기본 라운드 진행시간
const default_time = 60000;

/*
{
    1 : { duration, count, time },
    2 : { duration, count, time },
    3 : { duration, count, time },
    4 : { duration, count, time },
    5 : { duration, count, time },
    6 : { duration, count, time }
}
*/

// 라운드 생성
export const createRoundInfo = id => {
    const level = id;
    roundInfo[id] = {
        duration: default_duration - (level * 100),
        count: default_count + Math.floor(level / 2),
        time: default_time,
    };
    return roundInfo[id];
};

export const getRoundInfo = id => {
    return roundInfo[id];
};
