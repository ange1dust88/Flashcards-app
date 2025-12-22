import Link from "next/link";
import React from "react";

interface ModuleCardTypes {
  title: string;
  author: string | null | undefined;
  imageUrl: string;
  length: number;
  id: string;
  //createdAt: string;
  //id: slug;
}
function ModuleCard({ title, author, length, id, imageUrl }: ModuleCardTypes) {
  return (
    <Link
      href={`/modules/${id}`}
      className="w-full flex flex-col rounded-lg border-neutral-800 border bg-neutral-900 hover:bg-neutral-800 transition-colors duration-300 p-2"
    >
      <div className="rounded-lg overflow-hidden h-40 w-full">
        <img
          src={imageUrl || "/exampleImage.jpg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col items-start w-full">
        <h4 className="pt-1 font-semibold truncate w-full">{title}</h4>
        <p className="text-neutral-500 text-sm truncate w-full">{author}</p>

        <span className="mt-2 text-sm bg-neutral-700 h-6 px-2 flex justify-center items-center rounded-full">
          {length}
        </span>
      </div>
    </Link>
  );
}

export default ModuleCard;
