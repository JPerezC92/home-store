import { z } from 'zod';

// Schema for creating a new link
export const insertLinkSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .describe('Link title'),
    url: z
      .string()
      .url('Must be a valid URL')
      .describe('Link URL'),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .describe('Link description'),
  })
  .describe('Create link request');

// Schema for updating an existing link
export const updateLinkSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title must not be empty')
      .max(255, 'Title must be less than 255 characters')
      .optional()
      .describe('Link title'),
    url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .describe('Link URL'),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .describe('Link description'),
  })
  .describe('Update link request');
