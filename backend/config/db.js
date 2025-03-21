const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB 연결 성공: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB 연결 오류: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 