import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ success: true, reports: [] });
        }

        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[History] Fetch error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, reports: data });
    } catch (err: any) {
        console.error("[History] Exception:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
