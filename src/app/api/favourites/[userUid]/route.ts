import { NextResponse } from "next/server";
import { getFavouritesByUser } from "@/app/firebase/favorites";

export async function GET(
  _: Request,
  { params }: { params: { userUid: string } }
) {
  try {
    const { userUid } = params;

    const modules = await getFavouritesByUser(userUid);

    return NextResponse.json({ modules });
  } catch (error) {
    console.error("Favourites API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
