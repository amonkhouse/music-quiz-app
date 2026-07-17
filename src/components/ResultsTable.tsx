import { ANSWERS_BY_ID } from "@/lib/answers";

export type SubmissionRow = {
  id: number;
  name: string;
  totalScore: number;
  submittedAt: string;
  answers: {
    songId: number;
    artistGuess: string;
    songGuess: string;
    artistCorrect: boolean;
    songCorrect: boolean;
  }[];
};

export default function ResultsTable({ submissions }: { submissions: SubmissionRow[] }) {
  if (submissions.length === 0) return <p>No submissions yet.</p>;

  return (
    <table border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Submitted at</th>
          <th>Per-song breakdown</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.totalScore}</td>
            <td>{new Date(s.submittedAt).toLocaleString()}</td>
            <td>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {s.answers
                  .sort((a, b) => a.songId - b.songId)
                  .map((a) => {
                    const answer = ANSWERS_BY_ID.get(a.songId);
                    return (
                      <li key={a.songId}>
                        Song {a.songId} ({answer?.artist} - {answer?.song}): artist{" "}
                        {a.artistCorrect ? "✅" : "❌"} (&quot;{a.artistGuess}&quot;), title{" "}
                        {a.songCorrect ? "✅" : "❌"} (&quot;{a.songGuess}&quot;)
                      </li>
                    );
                  })}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
