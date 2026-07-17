import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export type Answer = { id: number; artist: string; song: string };

const raw = readFileSync(path.join(process.cwd(), "answers.csv"), "utf-8");

const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Array<{
  id: string;
  artist: string;
  song: string;
}>;

export const ANSWERS: Answer[] = rows.map((r) => ({
  id: Number(r.id),
  artist: r.artist.trim(),
  song: r.song.trim(),
}));

export const ANSWERS_BY_ID: Map<number, Answer> = new Map(
  ANSWERS.map((a) => [a.id, a])
);
