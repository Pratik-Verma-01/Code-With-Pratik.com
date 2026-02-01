import { z } from 'zod';

// USER & AUTH
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"), // Can be email or username
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// PROJECT UPLOAD
export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  short_description: z.string().max(160, "Short description max 160 chars"),
  long_description: z.string().min(20, "Please provide more detail (Markdown supported)"),
  primary_language: z.string().min(1, "Select a language"),
  repo_url: z.string().url().optional().or(z.literal('')),
  view_task: z.string().url("Valid YouTube URL required for the Gate"),
  visibility: z.enum(['public', 'private']),
  ai_helpers: z.boolean().default(true),
});

// AI CHAT REQUEST (Server Validation)
export const aiChatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000),
  ai_name: z.enum(['Nova', 'Astra', 'Zen', 'Echo', 'Lumen', 'Atlas']),
  project_context: z.string().optional(), // Content of the project they are discussing
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string()
    })
  ).optional().default([]),
});
