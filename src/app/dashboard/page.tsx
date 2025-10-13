import React from "react";
import { getAllModules } from "../firebase/modules";
import ModuleCard from "@/components/ui/module-card";

async function Dashboard() {
  const modules = await getAllModules();

  return (
    <div className="flex h-screen justify-center items-start">
      <div className="container mt-16">
        <div className="flex gap-6 w-full">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              title={mod.title}
              author={mod.author.username}
              imageUrl={mod.imageUrl ?? ""}
              length={mod.wordList.length}
              id={mod.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
