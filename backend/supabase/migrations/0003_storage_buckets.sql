-- SaaS Schedulr — storage buckets (idempotent)

insert into storage.buckets (id, name, public)
values
  ('avatars',      'avatars',      true),
  ('event-assets', 'event-assets', false)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- avatars: public read, authenticated users manage their own folder
-- ------------------------------------------------------------
drop policy if exists "avatars: public read"   on storage.objects;
create policy "avatars: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

drop policy if exists "avatars: owner insert"  on storage.objects;
create policy "avatars: owner insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: owner update"  on storage.objects;
create policy "avatars: owner update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: owner delete"  on storage.objects;
create policy "avatars: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------
-- event-assets: private, owner-only
-- ------------------------------------------------------------
drop policy if exists "event-assets: owner all" on storage.objects;
create policy "event-assets: owner all"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'event-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'event-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
