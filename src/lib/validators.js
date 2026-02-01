import { z } from 'zod';

// USER & AUTH
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be letters/numbers only"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// PROJECT UPLOAD (Fixed Logic)
export const projectSchema = z.object({
  title: z.string().min(3, "Title too short (min 3 chars)"), // 5 se 3 kiya
  short_description: z.string().min(5, "Description too short"),
  long_description: z.string().min(10, "Detail description too short"), // 20 se 10 kiya
  primary_language: z.string().min(1, "Please select a language"),
  
  // FIX: Allow empty string OR valid URL
  repo_url: z.string().optional().or(z.literal('')), 
  
  view_task: z.string().url("Valid YouTube URL required"),
  
  // Convert string to boolean/string automatically
  visibility: z.any().optional(), 
  ai_helpers: z.any().optional(),
});

// AI CHAT
export const aiChatSchema = z.object({
  message: z.string().min(1),
  ai_name: z.string(),
  project_context: z.string().optional(),
  history: z.array(z.any()).optional(),
});
