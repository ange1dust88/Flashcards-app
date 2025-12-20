import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();

    const existingUsers = await adminDb
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUsers.empty) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const existingUsername = await adminDb
      .collection("users")
      .where("username", "==", username)
      .get();

    if (!existingUsername.empty) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: username,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      username,
      photoURL: null,
      bannerURL: null,
      createdAt: new Date(),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
