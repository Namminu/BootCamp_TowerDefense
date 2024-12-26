import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

// 랭킹 조회 API
router.get('/rank', authmiddlewares, async (res, req) => {
    try {
        // highScores 테이블 조회
        const rankers = await prisma.highScores.findMany({
            select: {
                userId: true,
                highScore: true
            }
        });

        // highScore 컬럼명 Round 로 가공
        const transformRankers = rankers.map(rank => ({
            UserId: rankers.userId,
            Round: rank.highScore
        }));

        return res.status(200).json({ message: "test message", data: transformRankers })
    } catch (err) {
        console.error(err); // 에러를 콘솔에 출력
        return res.status(500).json({ message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    }
});

export default router;