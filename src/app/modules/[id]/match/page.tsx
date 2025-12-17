"use client";

import React, { useEffect, useState } from "react";
import { getModuleById } from "@/app/firebase/modules";
import { Spinner } from "@/components/ui/spinner";
import MatchCard from "@/components/ui/match-card";

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
  pairId: number;
  value: string;
  type: "term" | "definition";
};

function Match({ params }: MatchProps) {
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selected, setSelected] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

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

    moduleData.wordList.forEach((word) => {
      pairCounter++;

      generated.push({
        pairId: pairCounter,
        value: word.term,
        type: "term",
      });

      generated.push({
        pairId: pairCounter,
        value: word.definition,
        type: "definition",
      });
    });

    setItems(generated.sort(() => Math.random() - 0.5));
  }, [moduleData]);

  useEffect(() => {
    if (selected.length !== 2) return;

    const [a, b] = selected;

    if (a.pairId === b.pairId && a.type !== b.type) {
      setItems((prev) => prev.filter((i) => i.pairId !== a.pairId));
    }

    setTimeout(() => setSelected([]), 600);
  }, [selected]);

  const handleClick = (item: MatchItem) => {
    if (selected.length === 2) return;
    if (selected.includes(item)) return;

    setSelected((prev) => [...prev, item]);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!moduleData) {
    return <div className="text-white">Module not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex justify-center py-12">
      <div className="container grid grid-cols-4 gap-4">
        {items.map((item, index) => (
          <MatchCard
            key={index}
            text={item.value}
            active={selected.includes(item)}
            onClick={() => handleClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default Match;
