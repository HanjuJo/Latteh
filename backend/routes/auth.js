const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, nickname, userType } = req.body;

    // 이메일 중복 확인
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 닉네임 중복 확인
    user = await User.findOne({ nickname });
    if (user) {
      return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' });
    }

    // 새 사용자 생성
    user = new User({
      email,
      password,
      name,
      nickname,
      userType
    });

    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        userType: user.userType,
        level: user.level,
        points: user.points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        userType: user.userType,
        level: user.level,
        points: user.points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 소셜 로그인 (카카오)
router.post('/kakao', async (req, res) => {
  try {
    const { kakaoId, email, nickname } = req.body;

    let user = await User.findOne({ 'socialAuth.kakao.id': kakaoId });

    if (!user) {
      user = new User({
        email,
        nickname,
        name: nickname,
        socialAuth: {
          kakao: {
            id: kakaoId
          }
        },
        password: Math.random().toString(36).slice(-8)
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        userType: user.userType,
        level: user.level,
        points: user.points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 현재 사용자 정보 조회
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        userType: user.userType,
        level: user.level,
        points: user.points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 