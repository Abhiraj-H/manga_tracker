import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { GraphQLClient } from 'graphql-request';

export const dynamic = 'force-dynamic';

const anilistClient = new GraphQLClient('https://graphql.anilist.co');

const SEARCH_QUERY = `
query ($search: String) {
  Media (search: $search, type: MANGA, sort: POPULARITY_DESC) {
    id
    title {
      romaji
      english
    }
    coverImage {
      large
    }
    chapters
  }
}
`;

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    const rawTitles = text.split('\n')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const results = {
      imported: 0,
      failed: [] as string[]
    };

    for (const title of rawTitles) {
      try {
        const response: any = await anilistClient.request(SEARCH_QUERY, { search: title });
        const media = response?.Media;

        if (!media) {
          results.failed.push(title);
          continue;
        }

        const mangaId = String(media.id);
        const displayTitle = media.title.english || media.title.romaji;

        // Upsert — skip if already exists (ignoreDuplicates: true)
        const { error } = await supabase
          .from("library_entries")
          .upsert(
            {
              user_id: user.id,
              manga_id: mangaId,
              title: displayTitle,
              cover_image: media.coverImage.large,
              status: 'Plan to Read',
              total: media.chapters || null,
              progress: 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,manga_id", ignoreDuplicates: true }
          );

        if (!error) {
          results.imported++;
        }

      } catch (err) {
        console.error(`Failed to import ${title}:`, err);
        results.failed.push(title);
      }

      // Respect AniList rate limits (max 90 req/min)
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
