import { NextRequest, NextResponse } from "next/server";
import { ANSWERS_BY_ID } from "@/lib/answers";
import { ARTIST_ALIASES, SONG_ALIASES } from "@/lib/aliases";
import { isMatchAny } from "@/lib/scoring";
import { withTransaction } from "@/lib/db";
import type { ScoredAnswer, SubmitRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as SubmitRequest | null;

  const clientId = typeof body?.clientId === "string" ? body.clientId.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const guesses = Array.isArray(body?.guesses) ? body!.guesses : [];

  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (guesses.length !== ANSWERS_BY_ID.size) {
    return NextResponse.json(
      { error: `Expected ${ANSWERS_BY_ID.size} guesses` },
      { status: 400 }
    );
  }

  let scored: ScoredAnswer[];
  try {
    scored = guesses.map((g) => {
      const songId = Number(g?.songId);
      const answer = ANSWERS_BY_ID.get(songId);
      if (!answer) throw new Error(`Unknown songId ${songId}`);
      const artistGuess = typeof g?.artist === "string" ? g.artist : "";
      const songGuess = typeof g?.song === "string" ? g.song : "";
      const artistCandidates = [answer.artist, ...(ARTIST_ALIASES[songId] ?? [])];
      const songCandidates = [answer.song, ...(SONG_ALIASES[songId] ?? [])];
      return {
        songId,
        artistGuess,
        songGuess,
        artistCorrect: isMatchAny(artistGuess, artistCandidates),
        songCorrect: isMatchAny(songGuess, songCandidates),
      };
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid guesses" },
      { status: 400 }
    );
  }

  const totalScore = scored.reduce(
    (sum, s) => sum + Number(s.artistCorrect) + Number(s.songCorrect),
    0
  );

  await withTransaction(async (client) => {
    const {
      rows: [{ id: submissionId }],
    } = await client.query<{ id: number }>(
      `INSERT INTO submissions (client_id, name, total_score)
       VALUES ($1, $2, $3)
       ON CONFLICT (client_id) DO UPDATE
         SET name = EXCLUDED.name, total_score = EXCLUDED.total_score, submitted_at = now()
       RETURNING id`,
      [clientId, name, totalScore]
    );

    await client.query(`DELETE FROM submission_answers WHERE submission_id = $1`, [
      submissionId,
    ]);

    for (const s of scored) {
      await client.query(
        `INSERT INTO submission_answers
           (submission_id, song_id, artist_guess, song_guess, artist_correct, song_correct)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [submissionId, s.songId, s.artistGuess, s.songGuess, s.artistCorrect, s.songCorrect]
      );
    }
  });

  return NextResponse.json({ totalScore });
}
