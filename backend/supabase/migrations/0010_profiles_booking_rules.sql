ALTER TABLE public.profiles ADD COLUMN buffer_before TEXT NOT NULL DEFAULT '15 min';
ALTER TABLE public.profiles ADD COLUMN buffer_after TEXT NOT NULL DEFAULT '0 min';
ALTER TABLE public.profiles ADD COLUMN min_notice TEXT NOT NULL DEFAULT '2 hours';
ALTER TABLE public.profiles ADD COLUMN daily_limit TEXT NOT NULL DEFAULT 'No limit';
