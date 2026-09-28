import {createClient} from '@supabase/supabase-js';
// Dashboard → Project Settings → API Keys. Insert only the public URL and publishable key.
// NEVER insert a service_role or secret key into browser code.
export const SUPABASE_URL='https://xrhntbwzusqddgsfrpar.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY='sb_publishable_jfZGTtZ8FzQ3JH1sIrZp3A_ldor9Ke8';
export const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_PUBLISHABLE_KEY.startsWith('PASTE_');
export const supabase=createClient(configured?SUPABASE_URL:'https://placeholder.supabase.co',configured?SUPABASE_PUBLISHABLE_KEY:'placeholder',{auth:{persistSession:true,autoRefreshToken:true}});
