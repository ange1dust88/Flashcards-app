"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateCard from "@/components/ui/create-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useUserStore } from "@/store/userStore";
import { Spinner } from "@/components/ui/spinner";
import AIfeatures from "@/components/ui/AIfeatures";
import { CardData } from "../AI/parseAIResponse";
import { toast } from "sonner";

function CreateModule() {
  const [user, loading] = useAuthState(auth);
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

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

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
    let hasError = false;
    if (!title.trim()) {
      setTitleError("Title can't be empty");
      hasError = true;
    } else setTitleError("");

    if (!description.trim()) {
      setDescriptionError("Description can't be empty");
      hasError = true;
    } else setDescriptionError("");

    if (hasError) return;

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          cards,
          coverImage,
          username,
          uid: user?.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Failed to create module");
        return;
      }

      setTitle("");
      setDescription("");
      setCards([{ term: "", definition: "", imageUrl: "" }]);
      setCoverImage("");
      toast("Module created successfully!");
    } catch (err) {
      console.error(err);
      toast("Failed to create module");
    }
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) {
      toast("You must have at least one card.");
      return;
    }

    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEmptyCards = () => {
    setCards((prev) => prev.filter((card) => card.term.trim() !== ""));
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
            className="relative rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 flex justify-center items-center p-2 aspect-square cursor-pointer group"
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
                  setCoverImage(data.url);
                } catch (err) {
                  console.error("Cover upload failed:", err);
                  toast("Cover upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>
        </div>

        <AIfeatures
          wordsList={cards.map((c) => c.term).filter(Boolean)}
          removeEmptyCards={removeEmptyCards}
          onGeneratedCards={(newCards) => setCards(newCards)}
        />

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
              onDelete={() => removeCard(i)}
            />
          ))}
        </div>

        <div className="text-center my-10">
          <Button onClick={addCard}>Add a card</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateModule;
