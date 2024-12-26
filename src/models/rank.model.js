import { prisma } from "../utils/prisma/index.js";

/*
그럼 문제는 userid 로 users 테이블에서 id 특정을 어떻게 하냐인데

users 테이블에 먼저 접근해서 id찾고,
그 id로 highscores 테이블에 userId:id 조회하고
데이터가 있는지 봐서 없으면 create -> 최고기록
데이터 있으면 highscore 가져와서 비교
*/

// DB - HighScores 테이블에 접근, 유저의 최고 기록 갱신 함수
export const updateHighScore = async (userId, currentRound) => {
    // 테이블 안에서 highScore 찾는 과정
    const user_Id = await prisma.users.findUnique({
        where: { userId },
        select: { id: true }
    });
    const userHighScore = await prisma.highScores.findFirst({
        where: { userId: user_Id.id },
        select: { highScore: true }
    });

    // HighScores 테이블에 정보가 없을 경우 데이터 새로 생성 
    if (!userHighScore) {
        await prisma.highScores.create({
            data: {
                userId: user_Id.id,
                highScore: currentRound
            }
        });
        return { updated: false, currentHighScore: userHighScore };
    }

    // 현재 라운드와 비교 후 갱신 여부 확인
    if (userHighScore < currentRound) {
        // DB에 최고기록 업데이트
        await prisma.highScores.update({
            where: { userId: userId },
            data: { highScore: userHighScore }
        });
        // 최고기록 갱신 시 return
        return { updated: true, currentHighScore: currentRound };
    }

    // 최고기록 갱신 아닐 시 return
    return { updated: false, currentHighScore: userHighScore };
};