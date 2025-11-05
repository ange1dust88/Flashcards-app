"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import ComboBox from "@/components/ui/ComboBox";
import { fetchChatGPTResponse } from "@/app/AI/config";
import { CardData, parseAIResponseToCards } from "@/app/AI/parseAIResponse";
import { Spinner } from "./spinner";

interface AIfeaturesTypes {
  wordsList: string[];
  removeEmptyCards: () => void;
  onGeneratedCards: (cards: CardData[]) => void;
}

const levels = [
  { value: "a1", label: "A1 (Beginner)" },
  { value: "a2", label: "A2 (Elementary)" },
  { value: "b1", label: "B1 (Intermediate)" },
  { value: "b2", label: "B2 (Upper-Intermediate)" },
  { value: "c1", label: "C1 (Advanced)" },
  { value: "c2", label: "C2 (Proficient)" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "polish", label: "Polish" },
  { value: "ukrainian", label: "Ukrainian" },
  { value: "russian", label: "Russian" },
  { value: "spanish", label: "Spanish" },
];

const styles = [
  { value: "simple", label: "Simple & clear (beginner friendly)" },
  { value: "neutral", label: "Neutral & formal" },
  { value: "casual", label: "Casual / conversational" },
  { value: "academic", label: "Academic style" },
];

const examplesCount = [
  { value: "1", label: "1 Example" },
  { value: "2", label: "2 Examples" },
  { value: "3", label: "3 Examples" },
];

const exampleTemplate = `
mindset, a person's way of thinking (мышление)
She adopted a positive _______ to overcome the challenges she faced at work.
Changing his _______ from a fixed to a growth perspective helped him become more successful.
The team's _______ was focused on collaboration and achieving their common goals.;
`;

function AIfeatures({
  wordsList,
  removeEmptyCards,
  onGeneratedCards,
}: AIfeaturesTypes) {
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [translationLang, setTranslationLang] = useState("");
  const [style, setStyle] = useState("");
  const [examples, setExamples] = useState("3");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = Boolean(
    language && translationLang && level && style && examples
  );

  useEffect(() => {
    if (isDialogOpen) {
      setErrors({});
    }
  }, [isDialogOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!language) newErrors.language = "Please select target language";
    if (!translationLang)
      newErrors.translationLang = "Please select translation language";
    if (!level) newErrors.level = "Please select level";
    if (!style) newErrors.style = "Please select style";
    if (!examples) newErrors.examples = "Please select examples count";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const GenerateDefinitions = async () => {
    removeEmptyCards();
    const terms = wordsList.filter((t) => t.trim() !== "");

    if (!terms.length) {
      alert("Please add at least one word to generate cards.");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    const prompt = `
      Take the terms below and for each term add:
      - Definition in ${language}
      - Translation into ${translationLang}
      - ${examples} example${
      examples !== "1" ? "s" : ""
    } in ${language} (do NOT translate these examples)
      Definition should correspond to ${level.toUpperCase()} level.
      Style: ${style}.
      Separate each card AFTER EXAMPLES by a semicolon.
      Follow this format:
      ${exampleTemplate}

      Here is the list:
      ${terms.join(", ")}
    `;

    try {
      const result = await fetchChatGPTResponse([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ]);

      const newCards = parseAIResponseToCards(result);
      onGeneratedCards(newCards);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Something went wrong while generating. Try again later.");
    } finally {
      setIsLoading(false);
      setLevel("");
      setLanguage("");
      setTranslationLang("");
      setStyle("");
      setExamples("");
    }
  };

  return (
    <div className="mt-8">
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setErrors({});
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            AI Fill Settings
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[450px]">
          <DialogHeader>
            <DialogTitle>AI Generation Settings</DialogTitle>
            <DialogDescription>
              Configure how AI should generate your flashcards
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Language */}
            <div className="grid gap-2">
              <Label>Target language</Label>
              <ComboBox
                options={languages}
                placeholder="Select target language..."
                onChange={(val) => {
                  setLanguage(val);
                  setErrors((e) => ({ ...e, language: "" }));
                }}
              />
              {errors.language && (
                <span className="text-red-500 text-sm">{errors.language}</span>
              )}
            </div>

            {/* Translation */}
            <div className="grid gap-2">
              <Label>Translation language</Label>
              <ComboBox
                options={languages}
                placeholder="Select translation language..."
                onChange={(val) => {
                  setTranslationLang(val);
                  setErrors((e) => ({ ...e, translationLang: "" }));
                }}
              />
              {errors.translationLang && (
                <span className="text-red-500 text-sm">
                  {errors.translationLang}
                </span>
              )}
            </div>

            {/* Level */}
            <div className="grid gap-2">
              <Label>Level</Label>
              <ComboBox
                options={levels}
                placeholder="Select level..."
                onChange={(val) => {
                  setLevel(val);
                  setErrors((e) => ({ ...e, level: "" }));
                }}
              />
              {errors.level && (
                <span className="text-red-500 text-sm">{errors.level}</span>
              )}
            </div>

            {/* Examples */}
            <div className="grid gap-2">
              <Label>Examples per card</Label>
              <ComboBox
                options={examplesCount}
                placeholder="Select examples count..."
                onChange={(val) => {
                  setExamples(val);
                  setErrors((e) => ({ ...e, examples: "" }));
                }}
              />
              {errors.examples && (
                <span className="text-red-500 text-sm">{errors.examples}</span>
              )}
            </div>

            {/* Style */}
            <div className="grid gap-2">
              <Label>Style</Label>
              <ComboBox
                options={styles}
                placeholder="Select style..."
                onChange={(val) => {
                  setStyle(val);
                  setErrors((e) => ({ ...e, style: "" }));
                }}
              />
              {errors.style && (
                <span className="text-red-500 text-sm">{errors.style}</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={GenerateDefinitions}
              disabled={isLoading || !isFormValid}
              className="min-w-[100px]"
            >
              {isLoading ? <Spinner className="w-4 h-4" /> : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AIfeatures;
