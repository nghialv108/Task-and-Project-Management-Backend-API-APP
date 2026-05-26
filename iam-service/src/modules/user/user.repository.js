const { User } = require('./user.model');

const findById = (id) =>
  User.findById(id);

const findByIdWithPassword = (id) =>
  User.findById(id).select('+password +refreshTokenHash');

const findByEmail = (email) =>
  User.findOne({ email: email.toLowerCase() });

const findByEmailWithPassword = (email) =>
  User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokenHash');

const findByResetToken = (token) =>
  User.findOne({
    resetPasswordToken:   token,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

const create = (data) =>
  User.create(data);

const updateById = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) =>
  User.findByIdAndDelete(id);

module.exports = {
  findById,
  findByIdWithPassword,
  findByEmail,
  findByEmailWithPassword,
  findByResetToken,
  create,
  updateById,
  deleteById,
};
