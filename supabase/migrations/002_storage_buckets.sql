-- ============================================
-- 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Storage Configuration
-- Migration 002: Storage Buckets
-- ============================================

-- Note: Storage buckets are typically created via Supabase dashboard or CLI
-- This file documents the required bucket configuration

-- ============================================
-- BUCKET: avatars
-- Purpose: User profile pictures
-- Access: Public read, authenticated write
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    TRUE,  -- Public bucket
    2097152,  -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- BUCKET: thumbnails
-- Purpose: Project thumbnail images
-- Access: Public read, authenticated write
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'thumbnails',
    'thumbnails',
    TRUE,  -- Public bucket
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Policies for thumbnails bucket
CREATE POLICY "Thumbnail images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'thumbnails' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their project thumbnails"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'thumbnails' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their project thumbnails"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'thumbnails' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- BUCKET: code-archives
-- Purpose: Project code archives (ZIP files)
-- Access: Public read, authenticated write
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'code-archives',
    'code-archives',
    TRUE,  -- Public bucket (for downloads)
    52428800,  -- 50MB limit
    ARRAY[
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/gzip',
        'application/x-tar',
        'application/x-gzip'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Policies for code-archives bucket
CREATE POLICY "Code archives are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'code-archives');

CREATE POLICY "Authenticated users can upload code archives"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'code-archives' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their code archives"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'code-archives' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their code archives"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'code-archives' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- BUCKET: project-assets
-- Purpose: Additional project assets
-- Access: Public read, authenticated write
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-assets',
    'project-assets',
    TRUE,  -- Public bucket
    10485760,  -- 10MB limit
    ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'application/pdf',
        'text/plain', 'text/markdown', 'text/html', 'text/css', 'text/javascript',
        'application/json'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Policies for project-assets bucket
CREATE POLICY "Project assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-assets');

CREATE POLICY "Authenticated users can upload project assets"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'project-assets' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their project assets"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'project-assets' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their project assets"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'project-assets' 
    AND auth.role() = 'authenticated'
);
