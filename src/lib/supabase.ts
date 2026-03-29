import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Article {
  id: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;
  article_body: string;
  summary: string;
  slug: string;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  primary_category: string | null;
  tags: string[] | null;
  related_artists: string[] | null;
  published_at: string;
  content_type: string | null;
  is_featured: boolean;
  noindex: boolean;
}

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('content_articles')
    .select(`
      id, headline, subheadline, hero_image_url,
      summary, slug, meta_description, og_image_url,
      primary_category, tags, published_at, content_type,
      is_featured, noindex, canonical_url
    `)
    .eq('status', 'published')
    .eq('publish_to_public', true)
    .not('slug', 'is', null)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('content_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('publish_to_public', true)
    .single();

  if (error) return null;
  return data;
}
