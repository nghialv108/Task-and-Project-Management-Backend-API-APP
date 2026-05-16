const { z } = require('zod');
const { PROJECT_VISIBILITY } = require('../../shared/interfaces/enums');

const createProjectSchema = z.object({
  name:        z.string().min(2).max(100),
  description: z.string().max(1000).optional().default(''),
  visibility:  z.enum(Object.values(PROJECT_VISIBILITY)).optional().default('private'),
});

const updateProjectSchema = z.object({
  name:        z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  visibility:  z.enum(Object.values(PROJECT_VISIBILITY)).optional(),
  isArchived:  z.boolean().optional(),
});

const milestoneSchema = z.object({
  title:   z.string().min(1).max(200),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

const memberSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

module.exports = { createProjectSchema, updateProjectSchema, milestoneSchema, memberSchema };
