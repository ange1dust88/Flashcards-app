"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ModuleCard from "@/components/ui/module-card";
import { Module } from "@/app/firebase/modules";

interface ModulesFilterProps {
  createdModules: Module[];
  savedModules: Module[];
}

export default function ModulesFilter({
  createdModules,
  savedModules,
}: ModulesFilterProps) {
  const [filter, setFilter] = useState<"created" | "saved">("created");

  const displayed = filter === "created" ? createdModules : savedModules;

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex gap-2">
        <Button
          variant={filter === "created" ? "default" : "outline"}
          onClick={() => setFilter("created")}
        >
          Created
        </Button>
        <Button
          variant={filter === "saved" ? "default" : "outline"}
          onClick={() => setFilter("saved")}
        >
          Saved
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayed.length > 0 ? (
          displayed.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              author={mod.authorUsername}
              imageUrl={mod.imageUrl ?? ""}
              length={mod.wordList.length}
              id={mod.id}
            />
          ))
        ) : (
          <p className="text-neutral-400">No modules yet.</p>
        )}
      </div>
    </div>
  );
}
