import { prisma } from "../utils/prisma/index.js";

// DB - HighScores 테이블에 접근, 유저의 최고 기록 갱신 함수
export const updateHighScore = async (userId, currentRound, elapsedTime) => {
    // 유저 이름 탐색
    const userInfo = await prisma.users.findFirst({ where: { id: userId } });
    if (!userInfo) {
        console.error("update High Score Error : userInfo missing");
        return { updated: false, userName: null, currentHighScore: 0, elapsedTime: 0 };
    }
    const userName = userInfo.nickName || 'NULL Name';

    // 테이블 안에서 highScore 찾기
    const userHighScore = await prisma.highScores.findFirst({
        where: { userId: userId },
        select: {
            highScore: true,
            elapsed: true
        }
    });

    // HighScores 테이블에 정보가 없을 경우 데이터 새로 생성
    if (!userHighScore) {
        await prisma.highScores.create({
            data: {
                userId: userId,
                highScore: currentRound,
                elapsed: elapsedTime
            }
        });
        return { updated: true, userName, currentHighScore: currentRound, elapsedTime };
    }

    const { highScore: userHighScore_round, elapsed: userHighScore_time } = userHighScore;

    // 최고기록 갱신 조건 확인
    if (
        currentRound > userHighScore_round || // 현재 라운드가 더 높거나
        (currentRound === userHighScore_round && elapsedTime < userHighScore_time) // 라운드가 같고 시간이 더 짧을 때
    ) {
        // 최고기록 갱신
        await prisma.highScores.update({
            where: { userId: userId },
            data: {
                highScore: currentRound, // 새로운 최고 라운드
                elapsed: elapsedTime     // 새로운 최고 시간
            }
        });
        return { updated: true, userName, currentHighScore: currentRound, elapsedTime };
    }

    // 최고기록 갱신 아님
    return { updated: false, userName, currentHighScore: userHighScore_round, elapsedTime: userHighScore_time };
};
