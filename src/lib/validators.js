import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

// PROJECT SCHEMA (Updated: No view_task)
export const projectSchema = z.object({
  title: z.string().min(3, "Title too short"),
  short_description: z.string().min(5),
  long_description: z.string().min(10),
  primary_language: z.string().min(1, "Select a language"),
  repo_url: z.string().optional().or(z.literal('')), 
  
  // view_task hata diya
  
  visibility: z.any().optional(), 
  ai_helpers: z.any().optional(),
});
