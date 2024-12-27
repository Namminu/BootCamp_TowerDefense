import { prisma } from "../utils/prisma/index.js";

// DB - HighScores 테이블에 접근, 유저의 최고 기록 갱신 함수
export const updateHighScore = async (userId, currentRound) => {
    // 유저 이름 탐색
    let userName = await prisma.users.findUnique({ where: { id: userId } });
    userName = userName.nickName || 'NULL Name';

    // 테이블 안에서 highScore 찾는 과정
    const userHighScore = await prisma.highScores.findFirst({
        where: { userId: userId },
        select: {
            highScore: true,
            released: true
        }
    });

    // HighScores 테이블에 정보가 없을 경우 데이터 새로 생성 
    if (!userHighScore) {
        await prisma.highScores.create({
            data: {
                userId: userId,
                highScore: currentRound
            }
        });
        return { updated: true, userName, currentHighScore: userHighScore };
    }

    // 현재 라운드와 비교 후 갱신 여부 확인
    if (userHighScore < currentRound) {
        // DB에 최고기록 업데이트
        await prisma.highScores.update({
            where: { userId: userId },
            data: { highScore: userHighScore }
        });
        // 최고기록 갱신 시 return
        return { updated: true, userName, currentHighScore: currentRound };
    }

    // 최고기록 갱신 아닐 시 return
    return { updated: false, userName, currentHighScore: userHighScore };
};
