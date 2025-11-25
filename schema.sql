-- 1. Tabela de Perfis de Usuário (vinculada ao Login do Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  instagram_handle text,
  avatar_url text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Parceiros (Lojas/Marcas)
create table public.partners (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  contact_info text,
  niche text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Acordos/Parcerias (Deals)
create table public.deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  partner_id uuid references public.partners(id) on delete cascade not null,
  status text check (status in ('active', 'completed', 'cancelled')) default 'active',
  payment_type text, 
  estimated_value numeric,
  start_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Entregáveis (Stories, Reels, etc)
create table public.deliverables (
  id uuid default gen_random_uuid() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('story', 'reel', 'feed', 'tiktok', 'other')),
  due_date date,
  status text check (status in ('pending', 'posted', 'approved')) default 'pending',
  evidence_url text,
  views_count integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- SEGURANÇA (RLS) ---
-- Habilita segurança para ninguém ver os dados de ninguém
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.deals enable row level security;
alter table public.deliverables enable row level security;

-- Políticas de Acesso (Só o dono pode ver/editar seus dados)

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Partners
create policy "Users can CRUD own partners" on public.partners for all using (auth.uid() = user_id);

-- Deals
create policy "Users can CRUD own deals" on public.deals for all using (auth.uid() = user_id);

-- Deliverables
create policy "Users can CRUD own deliverables" on public.deliverables for all using (auth.uid() = user_id);

-- --- AUTOMAÇÃO ---
-- Função para criar perfil automaticamente quando usuário se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger que dispara a função acima
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();