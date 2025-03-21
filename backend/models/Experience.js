const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '경험담 제목은 필수입니다'],
    trim: true,
    maxlength: [200, '경험담 제목은 200자 이내로 입력하세요']
  },
  content: {
    type: String,
    required: [true, '경험담 내용은 필수입니다'],
    maxlength: [20000, '경험담 내용은 20000자 이내로 입력하세요']
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
  visibility: {
    type: String,
    enum: ['public', 'private', 'followers', 'premium'],
    default: 'public'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // 분 단위
    default: 5
  },
  sections: [{
    title: String,
    content: String,
    order: Number
  }],
  summary: {
    type: String,
    maxlength: [500, '요약은 500자 이내로 입력하세요']
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any'],
    default: 'any'
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
  purchaseCount: {
    type: Number,
    default: 0
  },
  relatedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  aiRecommended: {
    type: Boolean,
    default: false
  },
  isEbookContent: {
    type: Boolean,
    default: false
  },
  ebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ebook',
    default: null
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
ExperienceSchema.methods.getVoteCount = function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
};

// 인덱스 설정
ExperienceSchema.index({ title: 'text', content: 'text', categories: 1, tags: 1 });
ExperienceSchema.index({ createdAt: -1 });
ExperienceSchema.index({ author: 1, createdAt: -1 });
ExperienceSchema.index({ timeOfDay: 1, createdAt: -1 });
ExperienceSchema.index({ isPremium: 1, categories: 1 });
ExperienceSchema.index({ viewCount: -1 });
ExperienceSchema.index({ purchaseCount: -1 });

module.exports = mongoose.model('Experience', ExperienceSchema); 