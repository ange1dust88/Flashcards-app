import React from "react";
interface MatchCardProps {
  text: string;
  active: boolean;
  wrong: boolean | undefined;
  img?: string;
  hidden: boolean;
  onClick: () => void;
}

function MatchCard({
  text,
  active,
  wrong,
  hidden,
  onClick,
  img,
}: MatchCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center p-2 h-full rounded-lg cursor-pointer border transition-all whitespace-pre-wrap
        ${
          wrong
            ? " border-red-500"
            : active
            ? " border-green-500"
            : " border-neutral-800"
        }
        ${hidden ? "bg-neutral-950 border-none pointer-events-none" : ""}
      `}
    >
      <div
        className={` absolute h-full w-full z-3 transition-all${
          wrong
            ? " bg-red-900/40"
            : active
            ? " bg-green-900/40"
            : " bg-neutral-900/50 hover:bg-neutral-800/50"
        }
        ${hidden ? "bg-neutral-950 border-none pointer-events-none" : ""}`}
      ></div>
      {img && (
        <img src={img} alt="" className="absolute h-full w-full rounded-lg" />
      )}
      <span
        className={`text-center text-sm transition-opacity duration-300 z-4 ${
          hidden ? "opacity-0" : "opacity-100"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export default MatchCard;
