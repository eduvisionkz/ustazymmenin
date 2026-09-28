-- After creating your Email/Password user in Authentication → Users,
-- replace the email below and run this query in SQL Editor.
insert into public.site_admins(user_id)
select id from auth.users where email='YOUR_EMAIL_HERE'
on conflict(user_id) do nothing;
