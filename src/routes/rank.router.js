import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 전체 랭킹 조회 API
router.get('/rank', async (req, res) => {
	try {
		// highScores 테이블과 Users 테이블 조인 조회
		const rankers = await prisma.highScores.findMany({
			select: {
				highScore: true,
				elapsed: true,
				users: {
					select: {
						nickName: true, // userName으로 출력할 값
					}
				}
			}
		});

		if (!rankers) {
			return res.status(404).json({ message: "Rank Data Not Found" });
		}

		// 컬럼명 가공 및 데이터 정리
		const transformRankers = rankers.map(rank => ({
			UserName: rank.users.nickName, // nickName을 UserName으로 매핑
			Round: rank.highScore, // highScore를 Round로 매핑
			Time: rank.elapsed // elapsed 값을 그대로 사용
		}));

		// 데이터 가공 후 정렬: Round 우선, 같은 경우 Time 비교
		const sortedRankers = transformRankers.sort((a, b) => {
			if (b.Round !== a.Round) return b.Round - a.Round;
			return a.Time - b.Time; // 시간은 오름차순으로 정렬
		});

		return res.status(200).json({ message: '전체 랭킹 조회 성공', data: sortedRankers });
	} catch (err) {
		console.error(err); // 에러를 콘솔에 출력
		return res.status(500).json({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
	}
});


export default router;
