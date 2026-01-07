"use client";

import { use, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Module } from "@/app/firebase/modules";

interface DefinitionTestProps {
  params: Promise<{ id: string }>;
}

interface ModuleApiResponse {
  module: Module;
}

export default function DefinitionTest({ params }: DefinitionTestProps) {
  const { id } = use(params);

  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/modules/${id}`);
        if (!res.ok) throw new Error("Failed to fetch module");

        const data: ModuleApiResponse = await res.json();
        setModuleData(data.module);
      } catch (err) {
        console.error("Failed to fetch module:", err);
        toast("Failed to load module");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const cards = moduleData?.wordList ?? [];
  const current = cards[index];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || finished) return;

    const userAnswer = answer.trim().toLowerCase();
    const correct =
      current.term.toLowerCase() === userAnswer ||
      current.definition.toLowerCase().includes(userAnswer);

    if (correct) {
      toast("Correct!");
      setScore((s) => s + 1);
    } else {
      toast(`Wrong! Correct answer: ${current.term}`);
    }

    setTimeout(() => {
      setAnswer("");
      if (index + 1 >= cards.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 700);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setAnswer("");
    setFinished(false);
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

  if (finished) {
    const percentage = Math.round((score / cards.length) * 100);
    return (
      <div className="h-[calc(100vh-4rem)] bg-neutral-950 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Test Finished!</h1>
        <p className="text-lg text-gray-300 mb-4">
          Your score: {score} / {cards.length} ({percentage}%)
        </p>

        <div className="flex gap-4">
          <Button onClick={handleRestart}>Restart</Button>
          <Button onClick={() => router.push(`/modules/${id}`)}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-neutral-950 text-white flex justify-center items-center py-12">
      <div className="container max-w-3xl">
        <div className="flex flex-col gap-6 p-8 border border-neutral-800 bg-neutral-900 rounded-lg">
          <p className="text-lg font-medium whitespace-pre-wrap">
            {current.definition}
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Type the correct term..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              Check
            </Button>
          </form>

          <div className="flex justify-between text-sm text-gray-400">
            <span>
              {index + 1} / {cards.length}
            </span>
            <span>Score: {score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
