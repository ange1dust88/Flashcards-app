"use client"

import { Button } from "@/components/ui/button";
import CreateCard from "@/components/ui/create-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { User } from "../firebase/users";
import { createModule } from "../firebase/modules";


interface CardData {
  term: string;
  definition: string;
  imageUrl?: string;
}

function CreateModule() {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [cards, setCards] = useState<CardData[]>([
    { term: "", definition: "", imageUrl: "" },
  ]);

  const handleCardChange = (
    index: number,
    field: "term" | "definition" | "imageUrl",
    value: string
  ) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      )
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

    const mockAuthor: User = {
      email: "test@example.com",
      username: "TestUser",
      photoURL: "",
      bannerURL: "",
      createdAt: ""
    };

    await createModule(
      crypto.randomUUID(), 
      title,
      description,
      cards,
      mockAuthor
    );

    console.log("✅ Module created:", { title, description, cards });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="bg-neutral-950 container">
        <div className="p-4">
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

          {/* Title & Description */}
          <div className="flex flex-col gap-1">
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
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <span className="text-red-500 text-sm">{descriptionError}</span>
            )}
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
    </div>
  );
}

export default CreateModule;
