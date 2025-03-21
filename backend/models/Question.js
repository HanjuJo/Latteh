const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '질문 제목은 필수입니다'],
    trim: true,
    maxlength: [200, '질문 제목은 200자 이내로 입력하세요']
  },
  content: {
    type: String,
    required: [true, '질문 내용은 필수입니다'],
    maxlength: [5000, '질문 내용은 5000자 이내로 입력하세요']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: String,
    required: [true, '최소 하나의 카테고리를 선택하세요']
  }],
  tags: [{
    type: String,
    trim: true
  }],
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
  status: {
    type: String,
    enum: ['open', 'answered', 'closed'],
    default: 'open'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public'
  },
  answerCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
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
  accepted: {
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null
    },
    acceptedAt: Date
  },
  aiRecommended: {
    type: Boolean,
    default: false
  },
  offeredPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  timeRestriction: {
    hasTimeLimit: {
      type: Boolean,
      default: false
    },
    expiresAt: Date
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드: 답변 목록
QuestionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question',
  justOne: false
});

// 투표 수 계산 메서드
QuestionSchema.methods.getVoteCount = function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
};

// 인덱스 설정
QuestionSchema.index({ title: 'text', content: 'text', categories: 1, tags: 1 });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ author: 1, createdAt: -1 });
QuestionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Question', QuestionSchema); 