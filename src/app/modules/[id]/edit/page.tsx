"use client";

import React, { useEffect, useState, use } from "react";
import { getModuleById, updateModuleWordList } from "@/app/firebase/modules";
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
  const [title, setTitle] = useState<any>("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<any>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      const data = await getModuleById(id);
      if (data) {
        setModule(data);
        setCards(data.wordList || []);
        setTitle(data.title);
        setDescription(data.description);
        setCoverImage(data.imageUrl);
      }
    };
    fetchModule();
  }, [id]);

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

  const handleSaveCards = async () => {
    const validCards = cards.filter(
      (c) => c.term.trim() !== "" && c.definition.trim() !== ""
    );

    if (validCards.length === 0) return alert("Add at least one valid card.");

    setSaving(true);
    try {
      await updateModuleWordList(id, validCards);
      setCards(validCards);
      alert("Cards updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update cards");
    } finally {
      setSaving(false);
    }
  };

  if (!module) return <Spinner />;

  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="container mt-16 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Edit module</h1>

        <ModuleHeader
          title={title}
          description={description}
          imageUrl={coverImage}
          isEdit={true}
          moduleId={id}
          setTitle={setTitle}
          setDescription={setDescription}
          onImageChange={setCoverImage}
        />

        <div className="flex flex-col gap-4">
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
