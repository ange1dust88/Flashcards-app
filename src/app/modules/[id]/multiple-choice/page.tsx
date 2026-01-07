"use client";

import { useEffect, useState, use } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Module } from "@/app/firebase/modules";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MultipleChoiceProps {
  params: Promise<{ id: string }>;
}

export default function MultipleChoiceTest({ params }: MultipleChoiceProps) {
  const { id } = use(params);

  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await fetch(`/api/modules/${id}`);
        if (!res.ok) throw new Error("Failed to fetch module");

        const data = await res.json();
        setModuleData(data.module);
      } catch (err) {
        console.error(err);
        toast("Failed to load module");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const cards = moduleData?.wordList ?? [];
  const current = cards[index];

  useEffect(() => {
    if (!current || finished || cards.length < 2) return;

    const correct = current.term;

    const others = cards
      .filter((c) => c.term !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.term);

    setOptions([correct, ...others].sort(() => Math.random() - 0.5));

    setSelected(null);
  }, [index, finished, cards, current]);

  const handleAnswer = (option: string) => {
    if (selected || finished) return;

    setSelected(option);

    const isCorrect = option === current.term;
    if (isCorrect) {
      toast("Correct!");
      setScore((s) => s + 1);
    } else {
      toast(`Wrong! Correct answer: ${current.term}`);
    }

    setTimeout(() => {
      if (index + 1 >= cards.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 800);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
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
          <div className="flex justify-between items-center gap-6">
            <p className="text-lg font-medium whitespace-pre-wrap">
              {current.definition}
            </p>

            {current.imageUrl && (
              <img
                src={current.imageUrl}
                alt=""
                className="h-64 w-auto rounded-lg"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt) => {
              const isCorrect = opt === current.term;
              const isSelected = opt === selected;

              return (
                <Button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selected}
                  variant="outline"
                  className={`justify-start !border-neutral-700 ${
                    selected &&
                    (isCorrect
                      ? "!bg-green-800 !border-green-600 !text-white"
                      : isSelected
                      ? "!bg-red-800 !border-red-600 !text-white"
                      : "")
                  }`}
                >
                  {opt}
                </Button>
              );
            })}
          </div>

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
