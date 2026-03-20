import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mangaId, title, coverImage, status = "Plan to Read", total } = body;

    // Upsert — update if exists, insert if not
    const { data, error } = await supabase
      .from("library_entries")
      .upsert(
        {
          user_id: user.id,
          manga_id: String(mangaId),
          title,
          cover_image: coverImage,
          status,
          total: total ?? null,
          progress: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,manga_id", ignoreDuplicates: false }
      )
      .select()
      .single();

    if (error) {
      console.error("Library upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Library POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mangaId, status, progress, rating, notes } = body;

    if (!mangaId) {
      return NextResponse.json({ error: "Manga ID required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from("library_entries")
      .update(updateData)
      .eq("user_id", user.id)
      .eq("manga_id", String(mangaId))
      .select()
      .single();

    if (error) {
      console.error("Library PATCH error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Library PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mangaId = searchParams.get('mangaId');

    if (!mangaId) {
      return NextResponse.json({ error: "Manga ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("library_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("manga_id", mangaId);

    if (error) {
      console.error("Library DELETE error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Library DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
