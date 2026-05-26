const { Workspace } = require('./workspace.model');

const findById   = (id)   => Workspace.findById(id);
const findBySlug = (slug) => Workspace.findOne({ slug });
const findByOwner = (ownerId) => Workspace.find({ ownerId });

const create = (data) => Workspace.create(data);

const updateById = (id, data) =>
  Workspace.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Workspace.findByIdAndDelete(id);

const incrementStorageUsed = (id, bytes) =>
  Workspace.findByIdAndUpdate(id, { $inc: { storageUsed: bytes } }, { new: true });

module.exports = {
  findById, findBySlug, findByOwner,
  create, updateById, deleteById, incrementStorageUsed,
};
