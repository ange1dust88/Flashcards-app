"use client";

import { useUserStore } from "@/store/userStore";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Spinner } from "./spinner";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ModuleHeaderTypes {
  title: string;
  description: string;
  imageUrl?: string;
  authorUid?: string;
  moduleId?: string;
  isEdit?: boolean;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  onImageChange?: (url: string) => void;
}

export default function ModuleHeader({
  title,
  description,
  imageUrl,
  authorUid,
  moduleId,
  isEdit = false,
  setTitle,
  setDescription,
  onImageChange,
}: ModuleHeaderTypes) {
  const { uid } = useUserStore();
  const router = useRouter();
  const [newPicture, setNewPicture] = useState<string>(imageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    return data.url;
  };

  const handleImageChange = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setNewPicture(url);
      onImageChange?.(url);
    } catch (err) {
      toast.error("Picture upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!moduleId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl: newPicture,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update module");
      }

      toast.success("Module updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update module header");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!moduleId) {
      toast.error("Module ID is missing");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete module");
      }

      toast.success("Module deleted successfully!");

      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete module");
    } finally {
      setDeleting(false);
    }
  };

  const addToFavourites = async () => {
    if (!uid || !moduleId) return;

    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUid: uid, moduleId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      toast.success("Module added to favourites!");
    } catch (err) {
      toast.error("Failed to add module to favourites");
    }
  };

  return (
    <div className="relative bg-neutral-900 p-4 mt-8 border border-neutral-800 rounded-lg w-full flex gap-6 ">
      <div
        className={`relative flex-shrink-0 h-56 w-56 overflow-hidden rounded-lg ${
          isEdit ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (isEdit) fileInputRef.current?.click();
        }}
      >
        {(uploading || saving) && (
          <div className="absolute h-full flex justify-center items-center w-full bg-black/30">
            <Spinner />
          </div>
        )}

        {isEdit && (
          <>
            <div className="text-transparent flex justify-center items-center absolute h-full w-full hover:bg-black/30 hover:text-white transition-all duration-200">
              Change image
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageChange(file);
              }}
            />
          </>
        )}

        <img
          src={newPicture || "/exampleImage.jpg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        {isEdit ? (
          <>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle?.(e.target.value)}
              placeholder="Module title..."
              disabled={saving}
            />
            <Textarea
              className="resize-none h-full"
              value={description}
              maxLength={200}
              onChange={(e) => setDescription?.(e.target.value)}
              placeholder="Module description..."
              disabled={saving}
            />
            <Button
              variant={"secondary"}
              onClick={handleSaveChanges}
              disabled={saving}
              className="w-fit"
            >
              {saving ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-neutral-400 break-words">{description}</p>
          </>
        )}
      </div>

      {!isEdit && (
        <div className="absolute bottom-4 right-4">
          {uid === authorUid ? (
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/modules/${moduleId}/edit`)}
                variant="dark"
                disabled={deleting}
              >
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={deleting}>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your module and remove data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteModule}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <Spinner className="mr-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Button onClick={addToFavourites} variant="dark">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
              >
                <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
              </svg>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
