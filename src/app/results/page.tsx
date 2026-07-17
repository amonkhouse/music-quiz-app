import { query } from "@/lib/db";
import ResultsTable, { type SubmissionRow } from "@/components/ResultsTable";

// DB query must run per-request, not be baked in at build time.
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  name: string;
  total_score: number;
  submitted_at: string;
  song_id: number | null;
  artist_guess: string | null;
  song_guess: string | null;
  artist_correct: boolean | null;
  song_correct: boolean | null;
};

export default async function ResultsPage() {
  const rows = await query<Row>(
    `SELECT s.id, s.name, s.total_score, s.submitted_at,
            sa.song_id, sa.artist_guess, sa.song_guess, sa.artist_correct, sa.song_correct
     FROM submissions s
     LEFT JOIN submission_answers sa ON sa.submission_id = s.id
     ORDER BY s.total_score DESC, s.name ASC`
  );

  const bySubmission = new Map<number, SubmissionRow>();
  for (const row of rows) {
    if (!bySubmission.has(row.id)) {
      bySubmission.set(row.id, {
        id: row.id,
        name: row.name,
        totalScore: row.total_score,
        submittedAt: row.submitted_at,
        answers: [],
      });
    }
    if (row.song_id !== null) {
      bySubmission.get(row.id)!.answers.push({
        songId: row.song_id,
        artistGuess: row.artist_guess ?? "",
        songGuess: row.song_guess ?? "",
        artistCorrect: row.artist_correct ?? false,
        songCorrect: row.song_correct ?? false,
      });
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Quiz results</h1>
      <ResultsTable submissions={Array.from(bySubmission.values())} />
    </main>
  );
}
