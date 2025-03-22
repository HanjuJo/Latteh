const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Latteh API',
      version: '1.0.0',
      description: 'Latteh 프로젝트의 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:10000',
        description: '개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // API 라우트 파일 경로
};

const specs = swaggerJsdoc(options);

module.exports = specs; 