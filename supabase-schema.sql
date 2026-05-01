-- CreatorDev AI - Supabase Schema

-- Tabela de perfis de usuário
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  timezone text default 'UTC+0',
  avatar text,
  plan text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Policy: usuários só podem ver/atualizar seus próprios dados
create policy "Users can select own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Função para criar perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar perfil no cadastro
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabela de gerações de conteúdo
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  platform text not null,
  content text not null,
  repo_name text,
  tone text,
  template text,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table public.generations enable row level security;

create policy "Users can see own generations"
  on generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on generations for insert
  with check (auth.uid() = user_id);

-- Tabela de dores/problemas
create table if not exists public.pains (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table public.pains enable row level security;

create policy "Users can see own pains"
  on pains for select
  using (auth.uid() = user_id);

create policy "Users can insert own pains"
  on pains for insert
  with check (auth.uid() = user_id);

create policy "Users can update own pains"
  on pains for update
  using (auth.uid() = user_id);

create policy "Users can delete own pains"
  on pains for delete
  using (auth.uid() = user_id);

-- Tabela de projetos gerados a partir das dores
create table if not exists public.pain_projects (
  id uuid default gen_random_uuid() primary key,
  pain_id uuid references public.pains not null,
  user_id uuid references auth.users not null,
  description text not null,
  title text,
  functions text[],
  features text[],
  endpoints text[],
  database text[],
  architecture text,
  auth text,
  deployment text,
  is_ai_generated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table public.pain_projects enable row level security;

create policy "Users can see own pain projects"
  on pain_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own pain projects"
  on pain_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own pain projects"
  on pain_projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own pain projects"
  on pain_projects for delete
  using (auth.uid() = user_id);