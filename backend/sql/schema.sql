create extension if not exists "uuid-ossp";

create table if not exists users (
  id bigserial primary key,
  name text not null,
  email text not null unique,
  username text not null unique,
  password_hash text not null,
  status text not null check (status in ('pending', 'active', 'blocked')),
  role text not null check (role in ('admin', 'support', 'read')),
  created_at timestamptz not null default now()
);

create table if not exists groups (
  id bigserial primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists user_groups (
  user_id bigint not null references users(id) on delete cascade,
  group_id bigint not null references groups(id) on delete cascade,
  primary key (user_id, group_id)
);

create table if not exists secrets (
  id bigserial primary key,
  title text not null,
  type text not null,
  username text not null,
  email text not null,
  site text not null,
  group_id bigint references groups(id),
  visibility text not null,
  notes text,
  expires_at timestamptz,
  password_iv text not null,
  password_tag text not null,
  password_ciphertext text not null,
  created_by bigint references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_secrets_group on secrets (group_id);
create index if not exists idx_secrets_title on secrets (title);
create index if not exists idx_secrets_email on secrets (email);
create index if not exists idx_secrets_expires on secrets (expires_at);

create table if not exists audit_logs (
  id bigserial primary key,
  user_id bigint references users(id),
  action text not null,
  secret_id bigint references secrets(id),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user on audit_logs (user_id);
create index if not exists idx_audit_logs_created_at on audit_logs (created_at);
