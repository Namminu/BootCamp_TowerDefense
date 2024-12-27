import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ** 회원가입 API **
router.post('/sign-up', async (req, res) => {
  try {
    const { userId, password} = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { nickName },
    });
    if (existingUser) {
      return res.status(400).json({
        errorMessage: "닉네임이 이미 존재합니다.",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const nickName = 'test001'; // 닉네임 임시 설정
    await prisma.users.create({
      data: {
        userId, 
        password: hashedPassword,
        nickName, 
      },
    });

    return res.status(201).json({
      message: '회원가입이 완료되었습니다',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: '서버 에러' }); // 서버 에러 메시지 반환
  }
});

// ** 로그인 API **
router.post('/sign-in', async (req, res) => {
  try {
    const { userId, password } = req.body;
    // 유저 데이터에서 입력된 username으로 유저 검색
    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
    }

    // 비밀번호가 일치하면 JWT 생성
    const token = jwt.sign(
      {
        userId: user.userId, // JWT 페이로드에 사용자 키 포함 여기서 유저 id(유저 구분을 위한 uuid) 넣기.
      },
      process.env.JWT_KEY, // 비밀 키를 사용하여 서명
      { expiresIn: '1h' } // 토큰 유효 기간을 1시간으로 설정
    );
    // 성공 시 authorization 헤더에 토큰 추가
    res.setHeader('authorization', `Bearer ${token}`);

    return res.status(200).json({
      message: '로그인 되었습니다',
    });
  } catch (error) {
    console.error(error); // 에러를 콘솔에 출력
    return res.status(500).json({ errorMessage: '서버 에러' }); // 서버 에러 메시지 반환
  }
});

//토큰 확인겸 유저 정보 조회.
router.get('/users', async (req, res, naxt) => {
  const { authorization } = req.headers;
  try {
    const [tokenType, token] = authorization.split(' ');

    if (!token || tokenType !== 'Bearer')
      return res.status(401).json({ errorMessage: '로그인부터 해주세요' });
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //여기서 decoded 안에있는 유저 찾아서 비교.
    const user = await prisma.users.findUnique({
      where: {
        userId: decoded.userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다' });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.error('JWT 검증 실패:', error.message);

    // 에러 종류에 따른 적절한 메시지 반환
    const isTokenExpired = error.name === 'TokenExpiredError'; // 토큰 만료 여부 확인
    const errorMessage = isTokenExpired
      ? '토큰이 만료되었습니다. 다시 로그인해주세요.' // 토큰 만료 메시지
      : '토큰 검증 실패'; // 일반 검증 실패 메시지

    // 검증 실패 응답
    return res
      .status(401)
      .json({ message: errorMessage, error: error.message });
  }
});

export default router;
