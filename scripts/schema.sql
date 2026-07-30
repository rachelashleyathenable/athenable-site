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
