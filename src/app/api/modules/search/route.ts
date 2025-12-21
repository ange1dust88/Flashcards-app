import { NextResponse } from "next/server";
import { getAllModules } from "@/app/firebase/modules";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase();

    if (!query) {
      return NextResponse.json({ modules: [] });
    }

    const url = new URL(req.url);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const lastDocId = url.searchParams.get("lastDocId") || undefined;

    const { modules, lastDoc } = await getAllModules(
      pageSize,
      lastDocId as any
    );

    const filtered = modules.filter((m) =>
      m.title.toLowerCase().includes(query)
    );

    return NextResponse.json({ modules: filtered });
  } catch (err) {
    console.error("SEARCH MODULES ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
