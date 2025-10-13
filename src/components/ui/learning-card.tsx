"use client";
import React, { useState } from "react";

interface LearningCardTypes {
  term: string;
  definition: string;
  img?: string;
}

function LearningCard({ term, definition, img }: LearningCardTypes) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full h-full [perspective:1000px] cursor-pointer"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 bg-neutral-900 text-white flex flex-col justify-center items-center rounded-xl border border-neutral-800 shadow-lg [backface-visibility:hidden]">
          {img && (
            <img
              src={img}
              alt={term}
              className="w-16 h-16 object-cover rounded-full mb-2"
            />
          )}
          <h3 className="text-xl font-semibold">{term}</h3>
          <p className="text-neutral-500 text-sm mt-2">(click to flip)</p>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 bg-neutral-800 text-white flex justify-center items-center rounded-xl border border-neutral-700 shadow-lg p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-center text-lg">{definition}</p>
        </div>
      </div>
    </div>
  );
}

export default LearningCard;
