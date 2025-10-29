"use client";

import React from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchChatGPTResponse } from "@/app/AI/config";
import { CardData, parseAIResponseToCards } from "@/app/AI/parseAIResponse";

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
  const [level, setLevel] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [translationLang, setTranslationLang] = React.useState("");
  const [style, setStyle] = React.useState("");
  const [examples, setExamples] = React.useState("3");

  const GenerateDefinitions = async () => {
    const terms = wordsList.filter((t) => t.trim() !== "");
    removeEmptyCards();

    if (!terms.length) {
      console.warn("⚠️ No terms provided!");
    }
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
        ${terms.join(", ")}`;

    console.log(prompt);

    const result = await fetchChatGPTResponse([
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]);

    console.log(result);
    const newCards = parseAIResponseToCards(result);

    // Передаем результат обратно в родителя
    onGeneratedCards(newCards);
  };

  return (
    <div className="mt-8">
      <div className="flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"dark"}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
              >
                <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM224 256C224 238.3 238.3 224 256 224L320 224C337.7 224 352 238.3 352 256L352 512L384 512C401.7 512 416 526.3 416 544C416 561.7 401.7 576 384 576L256 576C238.3 576 224 561.7 224 544C224 526.3 238.3 512 256 512L288 512L288 288L256 288C238.3 288 224 273.7 224 256z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" text-sm">
            <DropdownMenuLabel>Profile picture guidelines</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ul className="space-y-1 text-neutral-300 p-2">
              <li>• Avoid nudity, violence, or hate symbols</li>
              <li>• Recommended size: 150x150px for best quality</li>
              <li>• Square or centered images work best</li>
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <div>
            <DialogTrigger asChild>
              <Button variant="outline">AI Fill Settings</Button>
            </DialogTrigger>

            <DialogContent className="w-[450px]">
              <DialogHeader>
                <DialogTitle>AI Generation Settings</DialogTitle>
                <DialogDescription>
                  Configure how AI should generate your flashcards
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 py-2">
                <div className="grid gap-2">
                  <Label>Target language</Label>
                  <ComboBox
                    options={languages}
                    placeholder="Select target language..."
                    searchPlaceholder="Search language..."
                    onChange={(val) => setLanguage(val)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Translation language</Label>
                  <ComboBox
                    options={languages}
                    placeholder="Select translation language..."
                    searchPlaceholder="Search language..."
                    onChange={(val) => setTranslationLang(val)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Level</Label>
                  <ComboBox
                    options={levels}
                    placeholder="Select level..."
                    searchPlaceholder="Search level..."
                    onChange={(val) => setLevel(val)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Examples per card</Label>
                  <ComboBox
                    options={examplesCount}
                    placeholder="Select examples count..."
                    searchPlaceholder="Search count..."
                    onChange={(val) => setExamples(val)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Style</Label>
                  <ComboBox
                    options={styles}
                    placeholder="Select style..."
                    searchPlaceholder="Search style..."
                    onChange={(val) => setStyle(val)}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={GenerateDefinitions}>Generate</Button>
              </DialogFooter>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default AIfeatures;
