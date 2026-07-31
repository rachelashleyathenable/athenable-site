import { randomUUID } from "crypto";

export function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: "block" as const,
    _key: randomUUID().slice(0, 12),
    style: "normal" as const,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: randomUUID().slice(0, 12),
        text,
        marks: [],
      },
    ],
  }));
}
