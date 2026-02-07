-- ============================================
-- 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄 Database Schema
-- Migration 001: Initial Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,  -- Firebase UID
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    photo_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    github_url VARCHAR(255),
    twitter_url VARCHAR(255),
    provider VARCHAR(20) DEFAULT 'email',  -- 'email' or 'google'
    email_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    total_points INTEGER DEFAULT 0,
    projects_count INTEGER DEFAULT 0,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Username lowercase constraint
ALTER TABLE public.users 
ADD CONSTRAINT users_username_lowercase 
CHECK (username = LOWER(username));

-- Username format constraint
ALTER TABLE public.users 
ADD CONSTRAINT users_username_format 
CHECK (username ~ '^[a-z0-9_]+$');

-- Create indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_users_total_points ON public.users(total_points DESC);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    short_description VARCHAR(160) NOT NULL,
    long_description TEXT,
    primary_language VARCHAR(50) NOT NULL,
    thumbnail_url TEXT,
    code_archive_url TEXT,
    code_archive_size BIGINT,
    git_repo_url VARCHAR(500),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    ai_enabled BOOLEAN DEFAULT TRUE,
    reward_points INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slug lowercase constraint
ALTER TABLE public.projects 
ADD CONSTRAINT projects_slug_lowercase 
CHECK (slug = LOWER(slug));

-- Create indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_visibility ON public.projects(visibility);
CREATE INDEX idx_projects_primary_language ON public.projects(primary_language);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_view_count ON public.projects(view_count DESC);
CREATE INDEX idx_projects_featured ON public.projects(is_featured) WHERE is_featured = TRUE;

-- Full text search index
CREATE INDEX idx_projects_search ON public.projects 
USING GIN (to_tsvector('english', title || ' ' || COALESCE(short_description, '')));

-- ============================================
-- PROJECT VIEWS TABLE (for unique view tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.project_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ip_hash VARCHAR(64),  -- Hashed IP for anonymous tracking
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint to prevent duplicate views per user per day
CREATE UNIQUE INDEX idx_project_views_unique ON public.project_views(project_id, user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX idx_project_views_project_id ON public.project_views(project_id);
CREATE INDEX idx_project_views_viewed_at ON public.project_views(viewed_at DESC);

-- ============================================
-- REWARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_rewards_type ON public.rewards(type);
CREATE INDEX idx_rewards_created_at ON public.rewards(created_at DESC);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'system',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(10),
    action_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- AI CHAT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_history_user_id ON public.ai_chat_history(user_id);
CREATE INDEX idx_ai_chat_history_project_id ON public.ai_chat_history(project_id);
CREATE INDEX idx_ai_chat_history_created_at ON public.ai_chat_history(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment project view count
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.projects 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment project download count
CREATE OR REPLACE FUNCTION increment_project_downloads(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.projects 
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user points
CREATE OR REPLACE FUNCTION increment_user_points(user_id UUID, points_delta INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET total_points = total_points + points_delta,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's projects count
CREATE OR REPLACE FUNCTION update_user_projects_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.users 
        SET projects_count = projects_count + 1 
        WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.users 
        SET projects_count = projects_count - 1 
        WHERE id = OLD.user_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update projects count
CREATE TRIGGER trigger_update_projects_count
AFTER INSERT OR DELETE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_user_projects_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - USERS
-- ============================================

-- Anyone can read non-blocked user profiles
CREATE POLICY "Users are viewable by everyone" ON public.users
    FOR SELECT USING (is_blocked = FALSE);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow insert during signup (via service role)
CREATE POLICY "Enable insert for service role" ON public.users
    FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- RLS POLICIES - PROJECTS
-- ============================================

-- Anyone can view public projects
CREATE POLICY "Public projects are viewable by everyone" ON public.projects
    FOR SELECT USING (visibility = 'public');

-- Users can view their own private projects
CREATE POLICY "Users can view own private projects" ON public.projects
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own projects
CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- RLS POLICIES - PROJECT VIEWS
-- ============================================

-- Anyone can insert views
CREATE POLICY "Anyone can record views" ON public.project_views
    FOR INSERT WITH CHECK (TRUE);

-- Project owners can view their project's views
CREATE POLICY "Project owners can view views" ON public.project_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_views.project_id 
            AND projects.user_id::text = auth.uid()::text
        )
    );

-- ============================================
-- RLS POLICIES - REWARDS
-- ============================================

-- Users can view their own rewards
CREATE POLICY "Users can view own rewards" ON public.rewards
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow insert via service role
CREATE POLICY "Enable insert for rewards" ON public.rewards
    FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Allow insert via service role
CREATE POLICY "Enable insert for notifications" ON public.notifications
    FOR INSERT WITH CHECK (TRUE);

-- ============================================
-- RLS POLICIES - AI CHAT HISTORY
-- ============================================

-- Users can view their own chat history
CREATE POLICY "Users can view own chat history" ON public.ai_chat_history
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own chat messages
CREATE POLICY "Users can insert own chat messages" ON public.ai_chat_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can delete their own chat history
CREATE POLICY "Users can delete own chat history" ON public.ai_chat_history
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION increment_project_views TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_project_downloads TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_user_points TO authenticated;
