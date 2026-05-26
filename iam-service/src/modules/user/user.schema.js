const { z } = require('zod');

const updateProfileSchema = z.object({
  fullName:  z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url('Invalid URL').optional().nullable(),
});

module.exports = { updateProfileSchema };
