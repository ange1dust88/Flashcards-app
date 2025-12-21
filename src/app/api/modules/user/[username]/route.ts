import { NextResponse } from "next/server";
import { getModulesByUsername } from "@/app/firebase/modules";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const modules = await getModulesByUsername(username);

    return NextResponse.json({ modules });
  } catch (err) {
    console.error("API USER MODULES ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
