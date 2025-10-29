export interface CardData {
  term: string;
  definition: string;
  imageUrl?: string;
}

export const parseAIResponseToCards = (text: string): CardData[] => {
  const blocks = text
    .split(";")
    .map((b) => b.trim())
    .filter(Boolean);

  const cards: CardData[] = blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) return null;

      const firstLineMatch = lines[0].match(/^([^,]+),\s*(.+)$/);
      if (!firstLineMatch) return null;

      const term = firstLineMatch[1].trim();
      const definition = lines
        .slice(0)
        .join("\n")
        .replace(`${term}, `, "")
        .trim();

      return { term, definition };
    })
    .filter(Boolean) as CardData[];

  return cards;
};
