"use client";

import React, { useEffect, useState, useRef } from "react";
import { getModuleById } from "@/app/firebase/modules";
import { Spinner } from "@/components/ui/spinner";
import MatchCard from "@/components/ui/match-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface WordItem {
  term: string;
  definition: string;
  imageUrl?: string;
}

interface Module {
  id: string;
  wordList: WordItem[];
}

interface MatchProps {
  params: Promise<{ id: string }>;
}

type MatchItem = {
  id: string;
  pairId: number;
  value: string;
  type: "term" | "definition";
  hidden: boolean;
  img?: string;
  wrong?: boolean;
};

function Match({ params }: MatchProps) {
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selected, setSelected] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    params.then(async ({ id }) => {
      const data = await getModuleById(id);
      setModuleData(data);
      setLoading(false);
    });
  }, [params]);

  useEffect(() => {
    if (!moduleData) return;

    let pairCounter = 0;
    const generated: MatchItem[] = [];

    const shuffledWords = [...moduleData.wordList].sort(
      () => Math.random() - 0.5
    );
    const limitedWords = shuffledWords.slice(0, 6);

    limitedWords.forEach((word) => {
      pairCounter++;

      generated.push({
        id: `${pairCounter}-term`,
        pairId: pairCounter,
        value: word.term,
        type: "term",
        hidden: false,
      });

      generated.push({
        id: `${pairCounter}-definition`,
        pairId: pairCounter,
        value: word.definition,
        type: "definition",
        hidden: false,
        img: word.imageUrl ? word.imageUrl : undefined,
      });
    });

    setItems(generated.sort(() => Math.random() - 0.5));
  }, [moduleData]);

  useEffect(() => {
    if (!loading && !finished) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, finished]);

  useEffect(() => {
    if (selected.length !== 2) return;
    const [a, b] = selected;

    if (a.pairId === b.pairId && a.type !== b.type) {
      setItems((prev) =>
        prev.map((item) =>
          item.pairId === a.pairId ? { ...item, hidden: true } : item
        )
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === a.id || item.id === b.id ? { ...item, wrong: true } : item
        )
      );
    }

    setTimeout(() => {
      setSelected([]);
      setItems((prev) => prev.map((item) => ({ ...item, wrong: false })));
    }, 400);
  }, [selected]);

  useEffect(() => {
    if (items.length > 0 && items.every((i) => i.hidden)) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [items]);

  const handleClick = (item: MatchItem) => {
    if (item.hidden) return;
    setSelected((prev) => {
      if (prev.some((s) => s.id === item.id))
        return prev.filter((s) => s.id !== item.id);
      if (prev.length === 2) return prev;
      return [...prev, item];
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!moduleData) return <div className="text-white">Module not found</div>;

  if (finished) {
    return (
      <div className="h-[calc(100vh-4.1rem)] bg-neutral-950 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-300">
          You completed all matches in {Math.floor(time / 60)}:
          {String(time % 60).padStart(2, "0")}
        </p>

        <div className="flex gap-4 mt-4">
          <Button
            onClick={() => {
              setItems([]);
              setSelected([]);
              setFinished(false);
              setTime(0);

              if (moduleData) {
                let pairCounter = 0;
                const generated: MatchItem[] = [];
                const shuffledWords = [...moduleData.wordList].sort(
                  () => Math.random() - 0.5
                );
                const limitedWords = shuffledWords.slice(0, 6);

                limitedWords.forEach((word) => {
                  pairCounter++;
                  generated.push({
                    id: `${pairCounter}-term`,
                    pairId: pairCounter,
                    value: word.term,
                    type: "term",
                    hidden: false,
                  });
                  generated.push({
                    id: `${pairCounter}-definition`,
                    pairId: pairCounter,
                    value: word.definition,
                    type: "definition",
                    hidden: false,
                    img: word.imageUrl ? word.imageUrl : undefined,
                  });
                });
                setItems(generated.sort(() => Math.random() - 0.5));
              }
            }}
          >
            Retry
          </Button>

          <Button
            onClick={() => {
              const url = window.location.href;
              const newUrl = url.replace(/\/match\/?$/, "");
              router.push(newUrl);
            }}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.1rem)] bg-neutral-950 text-white flex flex-col items-center py-6 overflow-hidden">
      <div className="mb-4 text-xl ">
        {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
      </div>

      <div className="container grid grid-cols-4 gap-4">
        {items.map((item) => (
          <MatchCard
            key={item.id}
            text={item.value}
            active={selected.some((s) => s.id === item.id)}
            onClick={() => handleClick(item)}
            hidden={item.hidden}
            wrong={item.wrong}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}

export default Match;
