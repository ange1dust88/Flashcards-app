import { NextResponse } from "next/server";
import { updateUserBanner } from "@/app/firebase/users";

interface Body {
  uid: string;
  bannerURL: string;
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { uid, bannerURL } = body;

    await updateUserBanner(uid, bannerURL);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update user banner API error:", err);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}
