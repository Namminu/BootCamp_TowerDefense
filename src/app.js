import express from "express";
import bodyParser from "body-parser";
import { createServer} from 'http';
import initSocket from "./init/socket.js";
import userRouter from "./routes/user-router.js";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));  
const __filename = fileURLToPath(import.meta.url); 


const app= express(); 
const server= createServer(app);

const PORT = 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));;


app.use(cors({
    origin: (origin, callback) => {
      callback(null, true); // 모든 Origin 허용
    },
    credentials: true, // 인증 정보 허용
    methods: ['GET', 'POST', 'PATCH','PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
    exposedHeaders: ['Authorization'], // 클라이언트가 Authorization 헤더를 접근할 수 있도록 설정
  }));

app.get("/",(req,res)=>{return res.sendFile(path.join(publicPath , "index.html"))});
app.use("/api", [userRouter]);

initSocket(server);  //웹소켓 서버 연결.

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });

//npx nodemon src/app.js 실행 키임 ㅇㅇ