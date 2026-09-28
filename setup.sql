-- Run once in Supabase SQL Editor in a NEW project for Жаңыл апай.
create extension if not exists pgcrypto;
create table if not exists public.site_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.memories (
 id uuid primary key default gen_random_uuid(), owner_uid uuid not null references auth.users(id),
 name text not null check (char_length(name) between 2 and 80),
 role text not null check (role in ('Шәкірті','Әріптесі','Ата-ана','Басқа')),
 year text not null default '' check (char_length(year)<=50),
 message text not null check (char_length(message) between 10 and 3000),
 photo_path text,
 status text not null default 'approved' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(),
 constraint photo_owner_path check (photo_path is null or photo_path like owner_uid::text || '/%')
);
create index if not exists idx_memories_status_created on public.memories(status,created_at desc);
alter table public.site_admins enable row level security;
alter table public.memories enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.site_admins where user_id=auth.uid())
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create policy "Admins see own grant" on public.site_admins for select to authenticated using (user_id=auth.uid());
create policy "Approved and own or admin read" on public.memories for select to anon, authenticated
 using (status='approved' or owner_uid=auth.uid() or (select public.is_admin()));
create policy "Visitors propose memories" on public.memories for insert to authenticated
 with check (owner_uid=auth.uid() and status='approved' and (select auth.jwt()->>'is_anonymous')='true');
create policy "Admin moderates" on public.memories for update to authenticated
 using ((select public.is_admin())) with check ((select public.is_admin()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('memory-photos','memory-photos',false,3145728,array['image/jpeg'])
 on conflict(id) do update set public=false,file_size_limit=3145728,allowed_mime_types=array['image/jpeg'];
create policy "Photo upload after memory" on storage.objects for insert to authenticated
 with check(bucket_id='memory-photos' and (storage.foldername(name))[1]=auth.uid()::text
 and exists(select 1 from public.memories m where m.photo_path=name and m.owner_uid=auth.uid() and m.status='approved'));
create policy "Approved or own or admin photo read" on storage.objects for select to anon,authenticated
 using(bucket_id='memory-photos' and exists(select 1 from public.memories m where m.photo_path=name
 and (m.status='approved' or m.owner_uid=auth.uid() or (select public.is_admin()))));
create policy "Admin removes rejected photos" on storage.objects for delete to authenticated
 using(bucket_id='memory-photos' and (select public.is_admin()));
