"use client";
import React, { useRef, useState } from "react";
import { Input } from "./input";
import { toast } from "sonner";

interface CreateCardProps {
  index: number;
  term: string;
  definition: string;
  imageUrl?: string;
  onChange: (field: "term" | "definition" | "imageUrl", value: string) => void;
  onDelete: () => void;
}

function CreateCard({
  index,
  term,
  definition,
  imageUrl,
  onChange,
  onDelete,
}: CreateCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
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
      onChange("imageUrl", data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded flex flex-col px-4 py-2 border border-neutral-800 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span>{index}</span>

        <span
          onClick={onDelete}
          className="flex justify-center items-center cursor-pointer h-7 w-7 bg-neutral-900 rounded-[50%] hover:bg-neutral-800 transition-color duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            className="h-5 w-5"
          >
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
          </svg>
        </span>
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
        <div className="flex justify-end items-center">
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
