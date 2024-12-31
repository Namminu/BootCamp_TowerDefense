export const baseHitEnemyCheck = (userId, daethSheets) => {
	const currentRound = getUserData(userId).round;

	if (currentRound === 1 && !daethSheets) {
		//가장 처음에 한번 부르는 용.
		return true;
	}

    daethSheets = daethSheets.filter((item) => item.killer === 'killbase');
    const targetRound = currentRound - 1;

    //if(daethSheets.monster)
};
