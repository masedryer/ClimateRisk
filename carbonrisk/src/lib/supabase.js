import { createClient } from "@supabase/supabase-js";

// Access environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log to verify environment variables are loaded correctly
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "Loaded" : "Not Loaded");

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? localStorage : null,
  },
});
