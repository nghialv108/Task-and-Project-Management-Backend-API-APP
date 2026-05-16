const mongoose = require('mongoose');

const ROLES = ['admin', 'manager', 'member'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    password: {
      type:     String,
      required: true,
      select:   false,   // không trả password trong query mặc định
    },
    fullName: {
      type:  String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type:    String,
      default: null,
    },
    role: {
      type:    String,
      enum:    ROLES,
      default: 'member',
    },
    workspaceId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Workspace',
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
    // Dùng cho forgot password flow
    resetPasswordToken:   { type: String,  default: null, select: false },
    resetPasswordExpires: { type: Date,    default: null, select: false },

    // Lưu refresh token hash để invalidate khi logout
    refreshTokenHash: { type: String, default: null, select: false },

    lastLoginAt: { type: Date, default: null },
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

userSchema.index({ workspaceId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES };
