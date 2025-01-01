const roundInfo = {};

// 기본 몬스터 소환 주기
const default_duration = 3000;

// 기본 몬스터 소환 수
const default_count = 5;

// 기본 라운드 진행시간
const default_time = 20000;

/*
{
    1 : { round, duration, count, time },
    2 : { round, duration, count, time },
    3 : { round, duration, count, time },
    4 : { round, duration, count, time },
    5 : { round, duration, count, time },
    6 : { round, duration, count, time }
}
*/

// 라운드 생성
export const createRoundInfo = (userId, round) => {
	roundInfo[userId] = {
		round: round,
		duration: default_duration - Math.floor(round / 10),
		count: default_count,
		time: default_time,
	};
	return roundInfo[userId];
};

export const getRoundInfo = (userId) => {
	return roundInfo[userId];
};
