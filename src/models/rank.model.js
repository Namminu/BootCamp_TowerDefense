import { prisma } from "../utils/prisma/index.js";

// DB - HighScores 테이블에 접근, 유저의 최고 기록 갱신 함수
export const updateHighScore = async (userId, currentRound, elapsedTime) => {
    // 유저 이름 탐색
    const userInfo = await prisma.users.findUnique({ where: { id: userId } });
    if (!userInfo) console.error("update High Score Error : userInfo missing");
    const userName = userInfo.nickName || 'NULL Name';

    // 테이블 안에서 highScore 찾는 과정
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
        return { updated: true, userName, currentHighScore: userHighScore, elapsedTime };
    }

    const userHighScore_round = userHighScore.highScore;
    const userHighScore_time = userHighScore.elapsed;
    if (!userHighScore_round || !userHighScore_time)
        console.error(`${!userHighScore_round ? `userHighScore_round` : `userHighScore_time`} missing Error`);

    // 현재 라운드와 비교 후 갱신 여부 확인
    if (userHighScore_round < currentRound) {
        // DB에 최고기록 업데이트
        await prisma.highScores.update({
            where: { userId: userId },
            data: { highScore: userHighScore_round }
        });
        // 최고기록 갱신 시 return
        return { updated: true, userName, currentHighScore: currentRound, elapsedTime };
    }

    if (userHighScore_round < currentRound ||   // 라운드로 최고기록 갱신
        (userHighScore_round === currentRound && userHighScore_time < elapsedTime)) {   // 플레이 시간으로 최고기록 갱신
        // DB에 최고기록 업데이트
        await prisma.highScores.update({
            where: { userId: userId },
            data: {
                highScore: userHighScore_round,
                elapsed: userHighScore_time
            }
        });
        return { updated: true, userName, currentHighScore: currentRound, elapsedTime };
    }
    // 최고기록 갱신 아닐 시 return
    return { updated: false, userName, currentHighScore: userHighScore_round, elapsedTime };
};
