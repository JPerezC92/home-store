import { createZodDto } from 'nestjs-zod';
import { insertLinkSchema, updateLinkSchema } from '../schemas/link-validation.schema';

// DTO for creating a link
export class CreateLinkDto extends createZodDto(insertLinkSchema) {}

// DTO for updating a link
export class UpdateLinkDto extends createZodDto(updateLinkSchema) {}
