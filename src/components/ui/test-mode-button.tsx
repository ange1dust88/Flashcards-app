"use client";
import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface TestModeButtonProps {
  children: React.ReactNode;
  moduleId: string;
  link: string;
}

function TestModeButton({ children, moduleId, link }: TestModeButtonProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/modules/${moduleId}/${link}`)}
      className="flex justify-center items-center rounded-lg bg-neutral-800 border-neutral-800 border-1 w-full h-full cursor-pointer hover:bg-neutral-700 duration-100 ease-in"
    >
      <span className="text-lg">{children}</span>
    </div>
  );
}

export default TestModeButton;
