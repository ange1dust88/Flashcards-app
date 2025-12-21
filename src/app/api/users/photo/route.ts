import { NextResponse } from "next/server";
import { updateUserPhoto } from "@/app/firebase/users";

interface Body {
  uid: string;
  photoURL: string;
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { uid, photoURL } = body;

    await updateUserPhoto(uid, photoURL);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update user photo API error:", err);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}
