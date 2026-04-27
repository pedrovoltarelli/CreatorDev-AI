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