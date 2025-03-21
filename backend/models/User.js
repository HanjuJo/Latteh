const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, '유효한 이메일 주소를 입력하세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다'],
    select: false
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다'],
    trim: true,
    maxlength: [50, '이름은 50자 이내로 입력하세요']
  },
  nickname: {
    type: String,
    required: [true, '닉네임은 필수입니다'],
    unique: true,
    trim: true,
    maxlength: [30, '닉네임은 30자 이내로 입력하세요']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  bio: {
    type: String,
    maxlength: [500, '자기소개는 500자 이내로 입력하세요']
  },
  userType: {
    type: String,
    enum: ['직접 경험자', '간접 경험자', '경험 탐색자'],
    default: '경험 탐색자'
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  points: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  expertise: [{
    type: String,
    trim: true
  }],
  badges: [{
    name: String,
    description: String,
    image: String,
    acquiredAt: Date
  }],
  socialAuth: {
    google: {
      id: String,
      token: String
    },
    kakao: {
      id: String,
      token: String
    },
    naver: {
      id: String,
      token: String
    }
  },
  settings: {
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      morningContent: {
        type: Boolean,
        default: true
      },
      afternoonContent: {
        type: Boolean,
        default: true
      },
      eveningContent: {
        type: Boolean,
        default: true
      }
    },
    privacySettings: {
      showLevel: {
        type: Boolean,
        default: true
      },
      showExpertise: {
        type: Boolean,
        default: true
      }
    }
  },
  statistics: {
    questionsAsked: {
      type: Number,
      default: 0
    },
    answersProvided: {
      type: Number,
      default: 0
    },
    experiencesShared: {
      type: Number,
      default: 0
    },
    ebooksPublished: {
      type: Number,
      default: 0
    },
    bestAnswerCount: {
      type: Number,
      default: 0
    }
  },
  aiAssistant: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    trainingData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AITrainingData'
    },
    responseStyle: {
      type: String,
      enum: ['친절함', '전문적', '간결함', '유머러스'],
      default: '친절함'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
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

// 비밀번호 암호화
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 확인 메서드
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 레벨 업데이트 메서드
UserSchema.methods.updateLevel = function() {
  const { questionsAsked, answersProvided, experiencesShared, ebooksPublished, bestAnswerCount } = this.statistics;
  const totalActivity = questionsAsked + (answersProvided * 2) + (experiencesShared * 3) + (ebooksPublished * 5) + (bestAnswerCount * 3);
  
  if (totalActivity >= 500) {
    this.level = 5;
  } else if (totalActivity >= 200) {
    this.level = 4;
  } else if (totalActivity >= 100) {
    this.level = 3;
  } else if (totalActivity >= 30) {
    this.level = 2;
  } else {
    this.level = 1;
  }
  
  return this.level;
};

module.exports = mongoose.model('User', UserSchema); 