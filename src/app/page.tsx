"use client";

import React, { useEffect, useState } from "react";
import ModuleCard from "@/components/ui/module-card";
import UserSync from "@/components/UserSync";

interface Module {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  wordList: any[];
  authorUsername: string | null | undefined;
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pageSize = 20;

  const loadModules = async () => {
    if (loading) return;
    setLoading(true);

    const url = `/api/modules?pageSize=${pageSize}${
      lastDocId ? `&lastDocId=${lastDocId}` : ""
    }`;

    const res = await fetch(url);
    const data = await res.json();

    setModules((prev) => [...prev, ...data.modules]);
    setLastDocId(data.lastDocId ?? null);

    setLoading(false);
  };

  useEffect(() => {
    loadModules();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4.1rem)] justify-center items-start">
      <div className="container mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              author={mod.authorUsername}
              imageUrl={mod.imageUrl ?? ""}
              length={mod.wordList.length}
              id={mod.id}
            />
          ))}
        </div>
        {lastDocId && (
          <button
            className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded"
            onClick={loadModules}
          >
            Load more
          </button>
        )}
      </div>
      <UserSync />
    </div>
  );
}
