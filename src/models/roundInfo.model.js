const roundInfo = {};

// 기본 몬스터 소환 주기
const default_duration = 500;

// 기본 몬스터 소환 수
const default_count = 10;

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
export const createRoundInfo = (id) => {
	const round = id;
	roundInfo[round] = {
		round : id,
		duration: default_duration,
		count: default_count + round,
		time: default_time,
	};
	return roundInfo[id];
};

export const getRoundInfo = (id) => {
	return roundInfo[id];
};
