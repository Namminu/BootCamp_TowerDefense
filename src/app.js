import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import userRouter from './routes/user.router.js';
import rankRouter from './routes/rank.router.js'
import path from 'path';
import cors from 'cors';
import { loadGameAssets } from './init/assets.js';


const app = express();
const server = createServer(app);

const PORT = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

app.use(
	cors({
		origin: (origin, callback) => {
			callback(null, true); // 모든 Origin 허용
		},
		credentials: true, // 인증 정보 허용
		methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
		exposedHeaders: ['Authorization'], // 클라이언트가 Authorization 헤더를 접근할 수 있도록 설정
	}),
);

app.get('/', (req, res) => {
	return res.sendFile(path.join(publicPath, '/htmls/index.html'));
});
app.use('/api', [userRouter, rankRouter]);

initSocket(server); //웹소켓 서버 연결.

server.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);

	try {
		const assets = await loadGameAssets(); //여기서 에셋 가져옴
	} catch (e) {
		console.error('Failed to load game assets:', e);
	}
});

//npx nodemon src/app.js 실행 키임 ㅇㅇ
