const Project = require('./project.model');

const findById          = (id)               => Project.findById(id);
const findByWorkspace   = (workspaceId, q)   => Project.find({ workspaceId, isArchived: false, ...q });
const findByMember      = (userId)           => Project.find({ members: userId, isArchived: false });

const create  = (data)     => Project.create(data);

const updateById = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Project.findByIdAndDelete(id);

const addMember = (id, userId) =>
  Project.findByIdAndUpdate(id, { $addToSet: { members: userId } }, { new: true });

const removeMember = (id, userId) =>
  Project.findByIdAndUpdate(id, { $pull: { members: userId } }, { new: true });

const addMilestone = (id, milestone) =>
  Project.findByIdAndUpdate(id, { $push: { milestones: milestone } }, { new: true });

const updateMilestone = (id, milestoneId, data) =>
  Project.findOneAndUpdate(
    { _id: id, 'milestones._id': milestoneId },
    { $set: { 'milestones.$': { _id: milestoneId, ...data } } },
    { new: true },
  );

module.exports = {
  findById, findByWorkspace, findByMember,
  create, updateById, deleteById,
  addMember, removeMember,
  addMilestone, updateMilestone,
};
