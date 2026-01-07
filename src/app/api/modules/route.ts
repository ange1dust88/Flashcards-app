import { NextRequest, NextResponse } from "next/server";
import { getAllModules, createModule } from "@/app/firebase/modules";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const lastDocId = url.searchParams.get("lastDocId") || undefined;

    const { modules, lastDoc } = await getAllModules(
      pageSize,
      lastDocId as any
    );

    return NextResponse.json({
      modules,
      lastDoc: lastDoc?.id || null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, cards, coverImage, username, uid } = body;

    if (!title || !description || !cards || !uid || !username) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const moduleId = crypto.randomUUID();

    await createModule(
      moduleId,
      title,
      description,
      cards,
      username,
      uid,
      coverImage
    );

    return NextResponse.json({ success: true, moduleId });
  } catch (err) {
    console.error("Failed to create module:", err);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
