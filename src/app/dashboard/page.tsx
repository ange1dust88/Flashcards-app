import React from "react";
import { getAllModules } from "../firebase/modules";
import ModuleCard from "@/components/ui/module-card";
import UserSync from "@/components/UserSync";

async function Dashboard() {
  const modules = await getAllModules();

  return (
    <div className="flex min-h-[calc(100vh-4.1rem)] justify-center items-start">
      <div className="container mt-16">
        <div className="flex gap-6 w-full">
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
      </div>
      <UserSync />
    </div>
  );
}

export default Dashboard;
