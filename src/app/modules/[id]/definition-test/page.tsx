"use client";

import React, { useEffect, useState } from "react";
import { getModuleById } from "@/app/firebase/modules";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Module } from "@/app/firebase/modules";
import { toast } from "sonner";

interface DefinitionTestProps {
  params: Promise<{ id: string }>;
}

export default function DefinitionTest({ params }: DefinitionTestProps) {
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchModule = async () => {
      try {
        const data = await getModuleById(id);
        if (!data) throw new Error("Module not found");
        setModuleData(data);
      } catch (err) {
        console.error("❌ Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const cards = moduleData?.wordList ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cards.length) return;

    const current = cards[index];
    const userAnswer = answer.trim().toLowerCase();
    const correct =
      current.term.toLowerCase() === userAnswer ||
      current.definition.toLowerCase().includes(userAnswer);

    setIsCorrect(correct);
    if (correct) {
      toast("Correct!");
    } else if (!correct) {
      toast(`Wrong! Correct answer: ${current.term}`);
    }
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      setIsCorrect(null);
      setAnswer("");
      setIndex((i) => (i + 1) % cards.length);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        No words found in this module.
      </div>
    );
  }

  const current = cards[index];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center py-12">
      <div className="container">
        <div className="flex flex-col gap-2 p-8 border border-neutral-800 bg-neutral-900 rounded-lg py-16">
          <div className="grid grid-cols-[1fr_1fr]">
            <div>
              <p className="whitespace-pre-wrap text-lg font-medium">
                {current.definition}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className=" flex flex-col justify-center w-full gap-2"
            >
              <Input
                placeholder="Type the correct term..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                minLength={2}
              />
              <Button type="submit" className="w-full" variant="secondary">
                Check
              </Button>
            </form>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              {index + 1} / {cards.length} | Score: {score}
            </div>

            <Button
              onClick={() => {
                setIndex(0);
                setScore(0);
                setAnswer("");
                setIsCorrect(null);
              }}
            >
              Restart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
