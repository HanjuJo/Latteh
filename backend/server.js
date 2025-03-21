const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 환경 변수 로드
dotenv.config();

// DB 연결
connectDB();

const app = express();

// CORS 설정
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hanjujo.github.io', 'https://latteh.onrender.com']
    : ['http://localhost:19006', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// 미들웨어
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 라우터
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Latteh API 서버에 오신 것을 환영합니다!' });
});

// 404 에러 핸들링
app.use((req, res) => {
  res.status(404).json({ message: '요청하신 페이지를 찾을 수 없습니다.' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 10000;

if (require.main === module) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`환경: ${process.env.NODE_ENV}`);
  });

  // 정상적이지 않은 종료 처리
  process.on('unhandledRejection', (err) => {
    console.error('처리되지 않은 Promise 거부:', err);
    server.close(() => process.exit(1));
  });
}

module.exports = app; 