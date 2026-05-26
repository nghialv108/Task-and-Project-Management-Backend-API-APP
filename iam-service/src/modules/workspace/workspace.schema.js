const { z } = require('zod');
const { ROLES } = require('./workspace.model');

const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional().default(''),
});

const updateWorkspaceSchema = z.object({
  name:        z.string().min(2).max(80).optional(),
  description: z.string().max(500).optional(),
  logoUrl:     z.string().url().optional().nullable(),
});

const addMemberSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  role:   z.enum(ROLES).optional().default('member'),
});

const updateMemberRoleSchema = z.object({
  role: z.enum(ROLES, {
    errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }),
  }),
});

module.exports = {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
};
