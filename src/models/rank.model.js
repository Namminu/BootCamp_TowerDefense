import { prisma } from '../utils/prisma/index.js';

// DB - HighScores 테이블에 접근, 유저의 최고 기록 갱신 함수
export const updateHighScore = async (userId, currentRound) => {
	const usersHighScore = await prisma.highScores.findFirst({
		where: { userId: userId },
		select: { highScore: true },
	});

	// 현재 라운드와 비교 후 값 도출
	if (usersHighScore < currentRound) {
		// DB에 최고기록 업데이트
		await prisma.highScores.update({
			where: { userId: userId },
			data: { highScore: usersHighScore },
		});
		// 최고기록 갱신 시 return
		return { updated: true, currentHighScore: currentRound };
	}

	// 최고기록 갱신 아닐 시 return
	return { updated: false, currentHighScore: usersHighScore };
};
