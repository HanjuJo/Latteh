const mongoose = require('mongoose');

const EbookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '전자책 제목은 필수입니다'],
    trim: true,
    maxlength: [200, '전자책 제목은 200자 이내로 입력하세요']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, '부제목은 300자 이내로 입력하세요']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    required: [true, '표지 이미지는 필수입니다']
  },
  description: {
    type: String,
    required: [true, '설명은 필수입니다'],
    maxlength: [2000, '설명은 2000자 이내로 입력하세요']
  },
  categories: [{
    type: String,
    required: [true, '최소 하나의 카테고리를 선택하세요']
  }],
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: [true, '가격은 필수입니다'],
    min: [0, '가격은 0 이상이어야 합니다']
  },
  currency: {
    type: String,
    enum: ['KRW', 'USD'],
    default: 'KRW'
  },
  pages: {
    type: Number,
    min: 1
  },
  readTime: {
    type: Number, // 분 단위
    default: 0
  },
  language: {
    type: String,
    default: 'ko'
  },
  tableOfContents: [{
    title: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience'
    }
  }],
  contentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  samples: [{
    title: String,
    content: String,
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience'
    }
  }],
  purchaseCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, '리뷰는 1000자 이내로 입력하세요']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  fileUrl: {
    type: String
  },
  fileSize: {
    type: Number // 바이트 단위
  },
  fileFormat: {
    type: String,
    enum: ['PDF', 'EPUB', 'MOBI'],
    default: 'PDF'
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

// 인덱스 설정
EbookSchema.index({ title: 'text', description: 'text', categories: 1, tags: 1 });
EbookSchema.index({ author: 1, createdAt: -1 });
EbookSchema.index({ purchaseCount: -1 });
EbookSchema.index({ averageRating: -1 });
EbookSchema.index({ price: 1 });
EbookSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Ebook', EbookSchema); 