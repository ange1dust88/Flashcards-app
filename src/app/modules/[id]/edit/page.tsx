"use client";

import React, { useEffect, useState, use } from "react";
import { Spinner } from "@/components/ui/spinner";
import ModuleHeader from "@/components/ui/module-header";
import CreateCard from "@/components/ui/create-card";
import { Button } from "@/components/ui/button";

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

interface CardData {
  term: string;
  definition: string;
  imageUrl?: string;
}

export default function Edit({ params }: ModulePageProps) {
  const { id } = use(params);

  const [module, setModule] = useState<any>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- FETCH MODULE ---------- */
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/modules/${id}`);
        if (!res.ok) throw new Error("Failed to fetch module");

        const data = await res.json();
        const module = data.module;

        if (!module) return;

        setModule(module);
        setCards(module.wordList || []);
        setTitle(module.title || "");
        setDescription(module.description || "");
        setCoverImage(module.imageUrl || "");
      } catch (err) {
        console.error("Edit module fetch error:", err);
      }
    };

    fetchModule();
  }, [id]);

  /* ---------- CARD EDITING ---------- */
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

  const removeCard = (index: number) => {
    if (cards.length <= 1) {
      alert("You must have at least one card.");
      return;
    }
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- SAVE ---------- */
  const handleSaveCards = async () => {
    const validCards = cards.filter(
      (c) => c.term.trim() && c.definition.trim()
    );

    if (!validCards.length) {
      alert("Add at least one valid card.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/modules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordList: validCards,
          title,
          description,
          imageUrl: coverImage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update module");
      }

      alert("Module updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update module");
    } finally {
      setSaving(false);
    }
  };

  if (!module) return <Spinner />;

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="container mt-8 flex flex-col">
        <h1 className="text-2xl font-bold">Edit module</h1>

        <ModuleHeader
          title={title}
          description={description}
          imageUrl={coverImage}
          isEdit
          moduleId={id}
          setTitle={setTitle}
          setDescription={setDescription}
          onImageChange={setCoverImage}
        />

        <div className="flex flex-col gap-4 mt-4">
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

        <div className="flex justify-center gap-4 mt-6 mb-16">
          <Button onClick={addCard}>Add card</Button>
          <Button
            variant="secondary"
            onClick={handleSaveCards}
            disabled={saving}
          >
            {saving ? <Spinner /> : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
