const userData = {};
/*
현재 접속중인 유저의 라운드 정보
{
    uuid123 : { round:2, timestamp:1332, gold:0 },
    uuid241 : { round:1, timestamp:1331, gold:0 },
}
*/

export const createUserData = (uuid) => {
	userData[uuid] = {};
};

export const getUserData = (uuid) => {
	return userData[uuid];
};

export const setUserData = (uuid, round, timestamp, gold) => {
	userData[uuid] = {round, timestamp, gold};
};

export const setUserGold = (uuid, gold) => {
	userData[uuid].gold = gold;
};

export const setUserRound = (uuid, round) => {
	userData[uuid].round = round;
};

export const setUserTimestamp = (uuid, timestamp) => {
	userData[uuid].timestamp = timestamp;
};
