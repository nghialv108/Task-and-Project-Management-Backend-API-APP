const mongoose = require('mongoose');
const { ROLES } = require('./workspace.model');

// ─── WorkspaceMember ──────────────────────────────────────────────────────────
// Bảng trung gian many-to-many giữa User và Workspace.
// Role sống ở đây để 1 user có thể có role khác nhau ở từng workspace.
const workspaceMemberSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    workspaceId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Workspace',
      required: true,
    },
    role: {
      type:    String,
      enum:    ROLES,
      default: 'member',
    },
    joinedAt: {
      type:    Date,
      default: Date.now,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => { delete ret.__v; return ret; },
    },
  }
);

// Mỗi user chỉ có 1 record per workspace
workspaceMemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });
// Query thành viên của 1 workspace
workspaceMemberSchema.index({ workspaceId: 1, isActive: 1 });
// Query tất cả workspace của 1 user
workspaceMemberSchema.index({ userId: 1, isActive: 1 });

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMemberSchema);

module.exports = { WorkspaceMember };
