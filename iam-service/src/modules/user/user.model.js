const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: true,
      select:   false,
    },
    fullName: {
      type:     String,
      required: true,
      trim:     true,
    },
    avatarUrl: {
      type:    String,
      default: null,
    },
    isVerified: {
      type:    Boolean,
      default: false,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    resetPasswordToken:   { type: String, default: null, select: false },
    resetPasswordExpires: { type: Date,   default: null, select: false },
    refreshTokenHash:     { type: String, default: null, select: false },
    lastLoginAt:          { type: Date,   default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.refreshTokenHash;
        return ret;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
