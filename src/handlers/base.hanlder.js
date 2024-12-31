import { getUserData } from '../models/userData.model.js';

export const baseHitEnemyCheck = (userId, deathSheets) => {
	const currentRound = getUserData(userId).round;

	if (currentRound === 1 && !deathSheets) {
		//가장 처음에 한번 부르는 용.
		return true;
	}

    const baseHits = deathSheets.filter((item) => item.killer === 'killbase');
    
    if(baseHits.length === 0) {
        return true;
    }

    // 오차 범위 
    const tolerance = 100;

    for (const hit of baseHits) {
        const dx = Math.abs(hit.monsterX - hit.baseX);
        const dy = Math.abs(hit.monsterY - hit.baseY);

        // 두 점 사이의 유클리드 거리 계산
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 거리(충돌 판단 기준)가 허용 오차 이내인지 확인
        if (distance <= tolerance) {
            return true; // 충돌로 간주
        }
    }

    // 충돌 조건을 만족하지 못하면 false 반환
    return false;
};
