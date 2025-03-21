const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, '답변 내용은 필수입니다'],
    maxlength: [10000, '답변 내용은 10000자 이내로 입력하세요']
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experienceType: {
    type: String,
    enum: ['직접 경험', '간접 경험', '전문 지식'],
    required: [true, '경험 유형은 필수입니다']
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'audio', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  votes: {
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  comments: [{
    content: {
      type: String,
      required: true,
      maxlength: [1000, '댓글은 1000자 이내로 입력하세요']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiConfidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  reviewedByAuthor: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      required: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'actioned', 'dismissed'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 투표 수 계산 메서드
AnswerSchema.methods.getVoteCount = function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
};

// 인덱스 설정
AnswerSchema.index({ question: 1, createdAt: -1 });
AnswerSchema.index({ author: 1, createdAt: -1 });
AnswerSchema.index({ isAccepted: 1 });
AnswerSchema.index({ content: 'text' });

module.exports = mongoose.model('Answer', AnswerSchema); 