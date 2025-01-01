import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 전체 랭킹 조회 API
router.get('/rank', async (req, res) => {
	try {
		// highScores 테이블 조회
		const rankers = await prisma.highScores.findMany({
			select: {
				userId: true,
				highScore: true,
				elapsed: true
			}
		});
		if (!rankers) return res.status(404).json({ message: "Rank Data Not Found" });

		// highScore 컬럼명 Round 로 가공
		const transformRankers = rankers.map(rank => ({
			UserId: rank.userId,
			Round: rank.highScore,
			Time: rank.elapsed
		}));

		// 데이터 가공 후 정렬 : Round 우선, 같은 경우 Time 비교
		const sortedRankers = transformRankers.sort((a, b) => {
			if (b.Round !== a.Round) return b.Round - a.Round;
			return b.Time - a.Time;
		});

		return res.status(200).json({ message: '전체 랭킹 조회 성공', data: sortedRankers });
	} catch (err) {
		console.error(err); // 에러를 콘솔에 출력
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
	}
});

export default router;
