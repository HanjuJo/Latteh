const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 모든 질문 조회
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sort = '-createdAt' } = req.query;
    const query = { isDeleted: false };

    if (category) {
      query.categories = category;
    }

    const questions = await Question.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'nickname profileImage level')
      .populate('accepted.answer');

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 질문 생성
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      content,
      categories,
      tags,
      isAnonymous,
      offeredPoints,
      timeRestriction
    } = req.body;

    // 포인트 확인
    const user = await User.findById(req.user.id);
    if (offeredPoints > user.points.available) {
      return res.status(400).json({ message: '사용 가능한 포인트가 부족합니다.' });
    }

    const question = new Question({
      title,
      content,
      author: req.user.id,
      categories,
      tags,
      isAnonymous,
      offeredPoints,
      timeRestriction
    });

    await question.save();

    // 포인트 차감
    if (offeredPoints > 0) {
      user.points.available -= offeredPoints;
      await user.save();
    }

    // 통계 업데이트
    user.statistics.questionsAsked += 1;
    await user.save();

    await question.populate('author', 'nickname profileImage level');

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 질문 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'nickname profileImage level')
      .populate('accepted.answer')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'nickname profileImage level'
        }
      });

    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }

    // 조회수 증가
    question.viewCount += 1;
    await question.save();

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 질문 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '질문을 수정할 권한이 없습니다.' });
    }

    const {
      title,
      content,
      categories,
      tags,
      isAnonymous
    } = req.body;

    question.title = title;
    question.content = content;
    question.categories = categories;
    question.tags = tags;
    question.isAnonymous = isAnonymous;

    await question.save();

    await question.populate('author', 'nickname profileImage level');

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 질문 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: '질문을 삭제할 권한이 없습니다.' });
    }

    question.isDeleted = true;
    await question.save();

    res.json({ message: '질문이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 질문 투표
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }

    const upvoteIndex = question.votes.upvotes.indexOf(req.user.id);
    const downvoteIndex = question.votes.downvotes.indexOf(req.user.id);

    if (voteType === 'up') {
      if (upvoteIndex === -1) {
        question.votes.upvotes.push(req.user.id);
        if (downvoteIndex !== -1) {
          question.votes.downvotes.splice(downvoteIndex, 1);
        }
      } else {
        question.votes.upvotes.splice(upvoteIndex, 1);
      }
    } else if (voteType === 'down') {
      if (downvoteIndex === -1) {
        question.votes.downvotes.push(req.user.id);
        if (upvoteIndex !== -1) {
          question.votes.upvotes.splice(upvoteIndex, 1);
        }
      } else {
        question.votes.downvotes.splice(downvoteIndex, 1);
      }
    }

    await question.save();

    res.json({
      upvotes: question.votes.upvotes.length,
      downvotes: question.votes.downvotes.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 