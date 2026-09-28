import {createClient} from '@supabase/supabase-js';
// Dashboard → Project Settings → API Keys. Insert only the public URL and publishable key.
// NEVER insert a service_role or secret key into browser code.
export const SUPABASE_URL='PASTE_PROJECT_URL';
export const SUPABASE_PUBLISHABLE_KEY='PASTE_PUBLISHABLE_KEY';
export const configured=SUPABASE_URL.startsWith('https://')&&!SUPABASE_PUBLISHABLE_KEY.startsWith('PASTE_');
export const supabase=createClient(configured?SUPABASE_URL:'https://placeholder.supabase.co',configured?SUPABASE_PUBLISHABLE_KEY:'placeholder',{auth:{persistSession:true,autoRefreshToken:true}});
