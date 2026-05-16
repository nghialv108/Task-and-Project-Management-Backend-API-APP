const { z } = require('zod');
const { ROLES } = require('../user/user.model');

// ─── User Schemas ─────────────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  fullName:  z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url('Invalid URL').optional().nullable(),
});

const updateRoleSchema = z.object({
  role: z.enum(ROLES, { errorMap: () => ({ message: `Role must be one of: ${ROLES.join(', ')}` }) }),
});

// ─── Workspace Schemas ────────────────────────────────────────────────────────
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

module.exports = {
  updateProfileSchema,
  updateRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
};
