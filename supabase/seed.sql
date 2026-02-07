-- ============================================
-- 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Seed Data
-- Optional: Initial seed data for development
-- ============================================

-- Note: This file is optional and used for development/testing
-- Do not run in production unless you want sample data

-- ============================================
-- Sample Languages Reference (for frontend)
-- ============================================
-- This is just documentation - languages are stored in projects table

/*
Languages supported:
- javascript
- typescript
- python
- java
- csharp
- cpp
- c
- go
- rust
- swift
- kotlin
- ruby
- php
- html
- css
- react
- vue
- angular
- nextjs
- nodejs
- dart
- flutter
- sql
- graphql
- other
*/

-- ============================================
-- Admin/System Notifications Template
-- ============================================

-- You can insert system-wide announcements like this:
-- INSERT INTO public.notifications (user_id, type, title, message, icon)
-- SELECT id, 'system', 'Welcome to CODE-With-PRATIK!', 'Start sharing your amazing projects with the world.', '🚀'
-- FROM public.users
-- WHERE is_blocked = FALSE;

-- ============================================
-- Development Test User (only for local dev)
-- ============================================

-- Uncomment to add a test user in development:
/*
INSERT INTO public.users (
    id,
    email,
    username,
    full_name,
    photo_url,
    bio,
    provider,
    email_verified,
    is_blocked,
    total_points,
    created_at
) VALUES (
    'test-user-uuid-12345',
    'test@example.com',
    'testuser',
    'Test User',
    NULL,
    'This is a test user for development purposes.',
    'email',
    TRUE,
    FALSE,
    500,
    NOW()
) ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- Sample Project (only for local dev)
-- ============================================

-- Uncomment to add a sample project:
/*
INSERT INTO public.projects (
    id,
    user_id,
    title,
    slug,
    short_description,
    long_description,
    primary_language,
    visibility,
    ai_enabled,
    view_count,
    created_at
) VALUES (
    uuid_generate_v4(),
    'test-user-uuid-12345',
    'Sample React Project',
    'sample-react-project',
    'A sample React project to demonstrate the platform features.',
    '# Sample Project

This is a sample project created for demonstration purposes.

## Features
- React 18
- Tailwind CSS
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
