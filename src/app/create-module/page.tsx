"use client";

import { Button } from "@/components/ui/button";
import CreateCard from "@/components/ui/create-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useRef, useState } from "react";
import { createModule } from "../firebase/modules";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useUserStore } from "@/store/userStore";
import { uploadToCloudinary } from "../firebase/uploadToCloudinary";
import { Spinner } from "@/components/ui/spinner";

interface CardData {
  term: string;
  definition: string;
  imageUrl?: string;
}

function CreateModule() {
  const [user] = useAuthState(auth);
  const { username } = useUserStore();
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [cards, setCards] = useState<CardData[]>([
    { term: "", definition: "", imageUrl: "" },
  ]);
  const [coverImage, setCoverImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleCardChange = (
    index: number,
    field: "term" | "definition" | "imageUrl",
    value: string
  ) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const addCard = () => {
    setCards([...cards, { term: "", definition: "", imageUrl: "" }]);
  };

  const handleCreate = async () => {
    let isError = false;

    if (!title) {
      setTitleError("Title can't be empty");
      isError = true;
    } else {
      setTitleError("");
    }

    if (!description) {
      setDescriptionError("Description can't be empty");
      isError = true;
    } else {
      setDescriptionError("");
    }

    if (isError) return;

    await createModule(
      crypto.randomUUID(),
      title,
      description,
      cards,
      username || "",
      user?.uid || "",
      coverImage
    );

    setTitle("");
    setDescription("");
    setCards([{ term: "", definition: "", imageUrl: "" }]);
    setCoverImage("");
    //add notif
    alert("Module created");
    console.log("Module created:", { title, description, cards });
  };

  return (
    <div className="flex h-screen justify-center items-start mt-16">
      <div className="bg-neutral-950 container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Create a new flashcard set</h2>
          <div className="flex gap-2">
            <Button variant={"secondary"} onClick={handleCreate}>
              Create
            </Button>
            <Button>Create and practice</Button>
          </div>
        </div>

        {/* Title & Description & cover image */}
        <div className="grid grid-cols-[minmax(0,5fr)_1fr] gap-8">
          <div className=" flex flex-col gap-1">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            {titleError && (
              <span className="text-red-500 text-sm">{titleError}</span>
            )}

            <Textarea
              placeholder="Add a description..."
              className="resize-none h-full"
              value={description}
              maxLength={200}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <span className="text-red-500 text-sm">{descriptionError}</span>
            )}
          </div>

          {/* Cover image upload */}
          <div
            className="relative rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 flex justify-center items-center p-2 aspect-square cursor-pointer relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={coverImage || "/exampleImage.jpg"}
              alt="cover"
              className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
              <span className="text-sm text-white">
                {uploading ? "" : "Change"}
              </span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                <Spinner />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const url = await uploadToCloudinary(file);
                  setCoverImage(url);
                } catch (err) {
                  console.error("Cover upload failed:", err);
                  alert("Cover upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>
        </div>

        {/* Flashcards */}
        <div className="mt-8 flex flex-col gap-4">
          {cards.map((card, i) => (
            <CreateCard
              key={i}
              index={i + 1}
              term={card.term}
              definition={card.definition}
              imageUrl={card.imageUrl}
              onChange={(field, value) => handleCardChange(i, field, value)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button onClick={addCard}>Add a card</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateModule;
