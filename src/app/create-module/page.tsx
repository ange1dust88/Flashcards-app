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
  const [showTitleError, setShowTitleError] = useState(false);

  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [showDescriptionError, setShowDescriptionError] = useState(false);

  const [cards, setCards] = useState<CardData[]>([
    { term: "", definition: "", imageUrl: "" },
  ]);
  const [coverImage, setCoverImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showCardValidation, setShowCardValidation] = useState(false);
  const [validationTimer, setValidationTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }

    return () => {
      if (validationTimer) {
        clearTimeout(validationTimer);
      }
    };
  }, [user, loading, router, validationTimer]);

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

  const showValidationFor10Seconds = () => {
    if (validationTimer) {
      clearTimeout(validationTimer);
    }

    setShowCardValidation(true);
    setShowTitleError(true);
    setShowDescriptionError(true);

    const timer = setTimeout(() => {
      setShowCardValidation(false);
      setShowTitleError(false);
      setShowDescriptionError(false);
      setValidationTimer(null);
    }, 3000);

    setValidationTimer(timer);
  };

  const hideValidationForField = (field: "title" | "description") => {
    if (field === "title" && title.trim()) {
      setShowTitleError(false);
      setTitleError("");
    }
    if (field === "description" && description.trim()) {
      setShowDescriptionError(false);
      setDescriptionError("");
    }
  };

  const validateAllCards = (): boolean => {
    if (cards.length < 6) {
      toast.error("Module must have at least 6 cards");
      return false;
    }
    const hasEmptyFields = cards.some(
      (card) => card.term.trim() === "" || card.definition.trim() === ""
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all term and definition fields");
      return false;
    }

    return true;
  };

  const validateForm = (): boolean => {
    let hasError = false;
    let shouldShowValidation = false;

    if (!title.trim()) {
      setTitleError("Title can't be empty");
      hasError = true;
      shouldShowValidation = true;
    } else {
      setTitleError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description can't be empty");
      hasError = true;
      shouldShowValidation = true;
    } else {
      setDescriptionError("");
    }

    const cardsValid = validateAllCards();
    if (!cardsValid) {
      hasError = true;
      shouldShowValidation = true;
    }

    if (shouldShowValidation) {
      showValidationFor10Seconds();
    }

    if (hasError) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".border-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 0);
      return false;
    }

    return true;
  };

  const createModule = async (redirectToPractice: boolean = false) => {
    if (!validateForm()) {
      return null;
    }

    setShowCardValidation(false);
    setShowTitleError(false);
    setShowDescriptionError(false);
    if (validationTimer) {
      clearTimeout(validationTimer);
      setValidationTimer(null);
    }

    setIsCreating(true);
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
        toast.error(data.error || "Failed to create module");
        return null;
      }

      if (!redirectToPractice) {
        setTitle("");
        setDescription("");
        setCards([{ term: "", definition: "", imageUrl: "" }]);
        setCoverImage("");
        toast.success("Module created successfully!");
      }

      return data.moduleId;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create module");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreate = async () => {
    const moduleId = await createModule(false);
  };

  const handleCreateAndPractice = async () => {
    const moduleId = await createModule(true);
    if (moduleId) {
      router.push(`/modules/${moduleId}`);
    }
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) {
      toast.warning("You must have at least one card.");
      return;
    }

    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEmptyCards = () => {
    setCards((prev) => prev.filter((card) => card.term.trim() !== ""));
  };

  const filledCardsCount = cards.filter(
    (card) => card.term.trim() !== "" && card.definition.trim() !== ""
  ).length;

  return (
    <div className="flex h-screen justify-center items-start mt-16">
      <div className="bg-neutral-950 container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold">Create a new flashcard module</h2>
            <p className="text-sm text-neutral-400 mt-1">
              {filledCardsCount} of {cards.length} cards filled
              {isCreating && <Spinner />}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={"secondary"}
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
            <Button onClick={handleCreateAndPractice} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create and practice"}
            </Button>
          </div>
        </div>

        {/* Title & Description & cover image */}
        <div className="grid grid-cols-[minmax(0,5fr)_1fr] gap-8">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  hideValidationForField("title");
                }}
                placeholder="Title"
                disabled={isCreating}
                className={`transition-colors duration-300 ${
                  showTitleError && titleError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
            </div>

            <div className="relative h-full">
              <Textarea
                placeholder="Add a description..."
                className={`resize-none h-full transition-colors duration-300 ${
                  showDescriptionError && descriptionError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                value={description}
                maxLength={200}
                onChange={(e) => {
                  setDescription(e.target.value);
                  hideValidationForField("description");
                }}
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Cover image upload */}
          <div
            className="relative rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 flex justify-center items-center p-2 aspect-square cursor-pointer group"
            onClick={() => !isCreating && fileInputRef.current?.click()}
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
              disabled={isCreating}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || isCreating) return;

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
                  toast.error("Cover upload failed");
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
              onDelete={() => !isCreating && removeCard(i)}
              showValidation={showCardValidation}
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
