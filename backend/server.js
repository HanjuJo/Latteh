const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 환경 변수 설정
dotenv.config();

// 앱 초기화
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 정적 파일 경로 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/latteh', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB에 연결되었습니다'))
.catch(err => console.error('MongoDB 연결 오류:', err));

// GraphQL 스키마 및 리졸버 임포트 (추후 구현)
// const typeDefs = require('./graphql/schema');
// const resolvers = require('./graphql/resolvers');

// REST API 라우트 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answers'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/ebooks', require('./routes/ebooks'));
app.use('/api/points', require('./routes/points'));
app.use('/api/notifications', require('./routes/notifications'));

// Apollo Server 설정 (GraphQL)
const startApolloServer = async () => {
  // GraphQL 스키마 구현 후 주석 해제
  // const server = new ApolloServer({
  //   typeDefs,
  //   resolvers,
  //   context: ({ req }) => ({ req })
  // });
  // await server.start();
  // server.applyMiddleware({ app });
  
  // 서버 시작
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다`);
    // console.log(`GraphQL 서버: http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer(); 