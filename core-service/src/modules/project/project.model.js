const mongoose = require('mongoose');
const { PROJECT_VISIBILITY } = require('../../shared/interfaces/enums');

const milestoneSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  dueDate:  { type: Date,   default: null },
  isCompleted: { type: Boolean, default: false },
}, { _id: true });

const projectSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    visibility:  {
      type:    String,
      enum:    Object.values(PROJECT_VISIBILITY),
      default: PROJECT_VISIBILITY.PRIVATE,
    },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerId:     { type: mongoose.Schema.Types.ObjectId, required: true },
    members:     [{ type: mongoose.Schema.Types.ObjectId }],   // userId list
    milestones:  [milestoneSchema],
    isArchived:  { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { transform: (_, ret) => { delete ret.__v; return ret; } },
  }
);

projectSchema.index({ workspaceId: 1, isArchived: 1 });

module.exports = mongoose.model('Project', projectSchema);
