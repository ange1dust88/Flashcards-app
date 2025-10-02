import React from "react";
import { Input } from "./input";

interface CreateCardProps {
  index: number;
  term: string;
  definition: string;
  imageUrl?: string;
  onChange: (field: "term" | "definition" | "imageUrl", value: string) => void;
}

function CreateCard({ index, term, definition, imageUrl, onChange }: CreateCardProps) {
  return (
    <div className="bg-neutral-900 rounded flex flex-col px-4 py-2 border-1 border-neutral-800 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span>{index}</span>
        <span className="flex flex-col justify-center items-center text-muted-foreground transition-colors hover:text-foreground hover:bg-accent cursor-pointer border-1 border-neutral-800 rounded-[50%] p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            className="h-5 w-5"
          >
            <path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z" />
          </svg>
        </span>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-[43%_43%_10%] gap-[2%]">
        <Input
          placeholder="Enter term"
          value={term}
          onChange={(e) => onChange("term", e.target.value)}
        />
        <Input
          placeholder="Enter definition"
          value={definition}
          onChange={(e) => onChange("definition", e.target.value)}
        />
        <span
          className="justify-self-end flex flex-col justify-center items-center text-muted-foreground transition-colors hover:text-foreground hover:bg-accent cursor-pointer border-1 border-dashed w-22 py-1 rounded"
          onClick={() => {
            const url = prompt("Paste image URL") || "";
            if (url) onChange("imageUrl", url);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            className="h-5 w-5"
          >
            <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM224 176C250.5 176 272 197.5 272 224C272 250.5 250.5 272 224 272C197.5 272 176 250.5 176 224C176 197.5 197.5 176 224 176zM368 288C376.4 288 384.1 292.4 388.5 299.5L476.5 443.5C481 450.9 481.2 460.2 477 467.8C472.8 475.4 464.7 480 456 480L184 480C175.1 480 166.8 475 162.7 467.1C158.6 459.2 159.2 449.6 164.3 442.3L220.3 362.3C224.8 355.9 232.1 352.1 240 352.1C247.9 352.1 255.2 355.9 259.7 362.3L286.1 400.1L347.5 299.6C351.9 292.5 359.6 288.1 368 288.1z" />
          </svg>
          <span className="text-sm">Image</span>
        </span>
      </div>

      {/* Labels */}
      <div className="grid grid-cols-[43%_43%_10%] gap-[2%] text-neutral-400 text-sm">
        <span>TERM</span>
        <span>DEFINITION</span>
      </div>
    </div>
  );
}

export default CreateCard;
