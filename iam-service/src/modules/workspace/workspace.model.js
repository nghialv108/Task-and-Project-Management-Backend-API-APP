const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
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
    // Giới hạn dung lượng file (bytes), mặc định 5GB
    storageQuota: {
      type:    Number,
      default: 5 * 1024 * 1024 * 1024,
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

module.exports = { Workspace };
