"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface AuthorCardTypes {
  username: string;
  image?: string;
}

function AuthorCard({ username, image }: AuthorCardTypes) {
  const router = useRouter();
  return (
    <div className="bg-neutral-900 p-4 mt-8 border flex-shrink-0 border-neutral-800 rounded-lg w-full flex flex-col gap-2 justify-center items-center ">
      <span
        onClick={() => router.push(`/profile/${username}`)}
        className="text-xl cursor-pointer border-b border-transparent hover:border-white transition duration-200"
      >
        {username}
      </span>
      <img
        src="/exampleImage.jpg"
        alt={username}
        className="h-42 w-42 rounded-[50%] flex-shrink-0"
      />
    </div>
  );
}

export default AuthorCard;
