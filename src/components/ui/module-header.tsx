"use client";

import { useUserStore } from "@/store/userStore";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/app/firebase/uploadToCloudinary";
import { Spinner } from "./spinner";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { updateModuleHeader } from "@/app/firebase/modules";
import { addFavourite } from "@/app/firebase/favorites";

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

  const handleImageChange = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setNewPicture(url);
      onImageChange?.(url);
    } catch (err) {
      console.error("Picture upload failed:", err);
      alert("Picture upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    console.log(moduleId);
    if (!moduleId) return;
    setSaving(true);
    try {
      await updateModuleHeader(moduleId, {
        title,
        description,
        imageUrl: newPicture,
      });
      alert("Module header updated!");
    } catch (err) {
      console.error("Failed to update module header:", err);
      alert("Failed to update module header");
    } finally {
      setSaving(false);
    }
  };

  const addToFavourites = async () => {
    if (!uid) return;
    if (!moduleId) return;
    try {
      await addFavourite(uid, moduleId);
    } catch (err) {
      console.error("Failed to add module to favourites:", err);
      alert("Failed to add module to favourites");
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
            />
            <Textarea
              className="resize-none h-full"
              value={description}
              maxLength={200}
              onChange={(e) => setDescription?.(e.target.value)}
              placeholder="Module description..."
            />
            <Button
              variant={"secondary"}
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-neutral-400 break-words break-all">
              {description}
            </p>
          </>
        )}
      </div>

      {!isEdit && (
        <div className="absolute bottom-4 right-4">
          {uid === authorUid ? (
            <Button
              onClick={() => router.push(`/modules/${moduleId}/edit`)}
              variant="dark"
            >
              Edit
            </Button>
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
