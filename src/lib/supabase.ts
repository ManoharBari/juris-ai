import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. DB features will be disabled.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DBReport {
    id: string;
    user_id?: string;
    file_name: string;
    analysis_result: any;
    created_at: string;
}
