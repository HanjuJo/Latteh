const mongoose = require('mongoose');

const AITrainingDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experienceData: [{
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience'
    },
    weight: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 5.0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  answerData: [{
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    },
    weight: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 5.0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  responsePatterns: [{
    category: String,
    keyPhrases: [String],
    tonePreferences: {
      formality: {
        type: Number,
        min: 0,
        max: 1.0,
        default: 0.5
      },
      enthusiasm: {
        type: Number,
        min: 0,
        max: 1.0,
        default: 0.5
      },
      detail: {
        type: Number,
        min: 0,
        max: 1.0,
        default: 0.5
      }
    }
  }],
  customTrainingText: {
    type: String,
    maxlength: [50000, '사용자 정의 학습 데이터는 50000자 이내로 입력하세요']
  },
  specialExpertise: [{
    field: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1.0,
      default: 0.7
    }
  }],
  performanceMetrics: {
    userAcceptRate: {
      type: Number,
      min: 0,
      max: 1.0,
      default: 0
    },
    audienceApprovalRate: {
      type: Number,
      min: 0,
      max: 1.0,
      default: 0
    },
    responseUsageCount: {
      type: Number,
      default: 0
    },
    avgResponseTime: {
      type: Number, // 밀리초 단위
      default: 0
    }
  },
  modelVersion: {
    type: String,
    default: '1.0.0'
  },
  lastTrained: {
    type: Date,
    default: Date.now
  },
  trainingStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
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
AITrainingDataSchema.index({ user: 1 });
AITrainingDataSchema.index({ 'specialExpertise.field': 1 });
AITrainingDataSchema.index({ trainingStatus: 1 });
AITrainingDataSchema.index({ modelVersion: 1 });

module.exports = mongoose.model('AITrainingData', AITrainingDataSchema); 