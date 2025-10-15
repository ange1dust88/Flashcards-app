"use client";
import React, { useRef, useState } from "react";
import { Input } from "./input";
import { uploadToCloudinary } from "@/app/firebase/uploadToCloudinary";

interface CreateCardProps {
  index: number;
  term: string;
  definition: string;
  imageUrl?: string;
  onChange: (field: "term" | "definition" | "imageUrl", value: string) => void;
}

function CreateCard({
  index,
  term,
  definition,
  imageUrl,
  onChange,
}: CreateCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange("imageUrl", url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
      //alert
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded flex flex-col px-4 py-2 border border-neutral-800 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span>{index}</span>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-[3fr_3fr_1fr] gap-8">
        <Input
          placeholder="Enter term"
          value={term}
          onChange={(e) => onChange("term", e.target.value)}
        />
        <Input
          placeholder="Enter definition"
          value={definition}
          onChange={(e) => onChange("definition", e.target.value)}
        />

        {/* Image button */}

        {imageUrl ? (
          <div
            className="flex justify-center cursor-pointer relative group aspect-square w-24 h-24"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className=" object-cover rounded-md border border-neutral-800 group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-md transition-opacity">
              <span className="text-sm text-white">Change</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <>
            <span
              className="justify-self-end flex flex-col justify-center items-center text-muted-foreground transition-colors hover:text-foreground hover:bg-accent cursor-pointer border border-dashed w-22 py-1 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                className="h-5 w-5"
              >
                <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
              </svg>
              <span className="text-sm">
                {uploading ? "Uploading..." : "Image"}
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </>
        )}
      </div>

      {/* Labels */}
      <div className="grid grid-cols-[3fr_3fr_1fr] gap-8 text-neutral-400 text-sm mt-1">
        <span>TERM</span>
        <span>DEFINITION</span>
      </div>
    </div>
  );
}

export default CreateCard;
