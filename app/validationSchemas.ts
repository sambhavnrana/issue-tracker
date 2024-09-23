import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required.').max(255),
  description: z.string().max(65535).optional(),
});

export const issueSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255),
  description: z.string().min(1, 'Description is required').max(65535),
  status: z.string().optional(),
  assignedToUserId: z.string().optional().nullable(),
  projectId: z.string().min(1, 'Project ID is required'),
  organizationId: z.string().min(1, 'Organization is required'),
});

export const patchIssueSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255).optional(),
  description: z.string().min(1, 'Description is required').max(65535).optional(),
  assignedToUserId: z.string().optional().nullable(),
});
