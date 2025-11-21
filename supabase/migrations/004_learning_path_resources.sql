-- Add optional resources field per lesson in a learning path

ALTER TABLE learning_path_posts
ADD COLUMN IF NOT EXISTS resources TEXT;
