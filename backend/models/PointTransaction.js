const mongoose = require('mongoose');

const PointTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['적립', '사용', '환불', '보상', '출금'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  source: {
    type: {
      type: String,
      enum: ['answer', 'experience', 'ebook', 'admin', 'question', 'system', 'withdrawal'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'source.model'
    },
    model: {
      type: String,
      enum: ['Answer', 'Experience', 'Ebook', 'User', 'Question', null]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  isCashable: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  metadata: {
    withdrawalInfo: {
      bankCode: String,
      accountNumber: String,
      accountHolder: String,
      taxWithheld: Number
    },
    paymentInfo: {
      transactionId: String,
      provider: String
    },
    levelBenefit: {
      multiplier: Number,
      basePoints: Number
    }
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
PointTransactionSchema.index({ user: 1, createdAt: -1 });
PointTransactionSchema.index({ type: 1, createdAt: -1 });
PointTransactionSchema.index({ status: 1 });
PointTransactionSchema.index({ createdAt: 1 });
PointTransactionSchema.index({ 'source.type': 1, 'source.id': 1 });

module.exports = mongoose.model('PointTransaction', PointTransactionSchema); 