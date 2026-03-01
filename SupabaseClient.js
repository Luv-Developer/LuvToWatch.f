import { createClient } from "@supabase/supabase-js/dist/index.cjs";

const SUPABASEURL = import.meta.env.VITE_SUPABASE_URL
const SUPABASEKEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASEURL,SUPABASEKEY)

