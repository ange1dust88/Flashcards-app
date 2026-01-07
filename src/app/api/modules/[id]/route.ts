import { NextResponse } from "next/server";
import {
  getModuleById,
  updateModuleHeader,
  updateModuleWordList,
} from "@/app/firebase/modules";
import { getUserByUid } from "@/app/firebase/users";
import { db } from "@/app/firebase/config";
import { deleteDoc, doc } from "firebase/firestore";

export async function GET(_: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const module = await getModuleById(id);

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const author = await getUserByUid(module.authorUid);

    return NextResponse.json({
      module,
      author: author
        ? {
            uid: author.uid,
            username: author.username,
            photoURL: author.photoURL,
          }
        : null,
    });
  } catch (err) {
    console.error("API MODULE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { title, description, imageUrl, wordList } = body;

    const module = await getModuleById(params.id);
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    if (title || description || imageUrl) {
      await updateModuleHeader(params.id, {
        title,
        description,
        imageUrl,
      });
    }

    if (Array.isArray(wordList)) {
      await updateModuleWordList(params.id, wordList);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE MODULE API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("Delete module:", id);

    const moduleRef = doc(db, "modules", id);
    await deleteDoc(moduleRef);

    console.log("Module deleted");

    return NextResponse.json({ success: true, message: "Module deleted" });
  } catch (err: any) {
    console.error("Erorr:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete module" },
      { status: 500 }
    );
  }
}
