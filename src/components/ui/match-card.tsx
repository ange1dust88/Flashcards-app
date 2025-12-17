import React from "react";

interface MatchCardProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

function MatchCard({ text, active, onClick }: MatchCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center p-4 h-32 rounded-lg cursor-pointer border transition-all
        ${
          active
            ? "border-green-500 bg-green-500/10"
            : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
        }
      `}
    >
      <span className="text-center">{text}</span>
    </div>
  );
}

export default MatchCard;
