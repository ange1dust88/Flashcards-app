import { addFavourite } from "@/app/firebase/favorites";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userUid, moduleId } = await req.json();

    if (!userUid || !moduleId) {
      return NextResponse.json(
        { error: "Missing userUid or moduleId" },
        { status: 400 }
      );
    }

    await addFavourite(userUid, moduleId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add to favourites API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
