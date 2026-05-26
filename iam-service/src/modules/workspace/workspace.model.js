const mongoose = require('mongoose');

const ROLES = ['admin', 'manager', 'member'];

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    slug: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    description: {
      type:    String,
      default: '',
    },
    ownerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    logoUrl: {
      type:    String,
      default: null,
    },
    storageQuota: {
      type:    Number,
      default: 5 * 1024 * 1024 * 1024, // 5GB
    },
    storageUsed: {
      type:    Number,
      default: 0,
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

workspaceSchema.index({ ownerId: 1 });

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = { Workspace, ROLES };
