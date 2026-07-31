create table if not exists leads (
  id serial primary key,
  prenom text not null,
  email text not null,
  pillar text,
  maturity text,
  role text,
  besoin text,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists seo_keywords (
  id serial primary key,
  keyword text not null unique,
  source text not null default 'manual',
  is_priority boolean not null default false,
  last_article_generated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists seo_gsc_metrics (
  id serial primary key,
  keyword_id integer references seo_keywords(id),
  query text not null,
  page_url text,
  metric_date date not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric,
  position numeric,
  synced_at timestamptz not null default now(),
  unique (query, page_url, metric_date)
);

create table if not exists seo_activity_log (
  id serial primary key,
  action_type text not null,
  summary text not null,
  detail jsonb,
  status text not null default 'success',
  related_keyword_id integer references seo_keywords(id),
  related_sanity_doc_id text,
  created_at timestamptz not null default now()
);
