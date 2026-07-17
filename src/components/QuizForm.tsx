"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SongGuessRow from "./SongGuessRow";

const CLIENT_ID_KEY = "quizClientId";
const NAME_KEY = "quizName";

type GuessState = Record<number, { artist: string; song: string }>;

export default function QuizForm({ songIds }: { songIds: number[] }) {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<GuessState>(
    Object.fromEntries(songIds.map((id) => [id, { artist: "", song: "" }]))
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [score, setScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedName = sessionStorage.getItem(NAME_KEY);
    if (!storedName) {
      router.replace("/");
      return;
    }
    // One-time sync from sessionStorage (an external system) into state on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(storedName);
  }, [router]);

  function handleChange(songId: number, field: "artist" | "song", value: string) {
    setGuesses((prev) => ({ ...prev, [songId]: { ...prev[songId], [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientId = sessionStorage.getItem(CLIENT_ID_KEY);
    if (!clientId || !name) {
      router.replace("/");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          name,
          guesses: songIds.map((songId) => ({ songId, ...guesses[songId] })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }

      const body = await res.json();
      setScore(body.totalScore);
      setStatus("done");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed");
      setStatus("error");
    }
  }

  if (name === null) return null;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <p>Playing as {name}</p>
      {songIds.map((songId) => (
        <SongGuessRow
          key={songId}
          songId={songId}
          artist={guesses[songId].artist}
          song={guesses[songId].song}
          onChange={handleChange}
        />
      ))}
      <button type="submit" disabled={status === "submitting"}>
        {status === "done" ? "Update my answers" : "Submit"}
      </button>
      {status === "done" && score !== null && (
        <p>You scored {score} / {songIds.length * 2}. You can change your answers and resubmit until time&apos;s up.</p>
      )}
      {status === "error" && <p style={{ color: "crimson" }}>{errorMessage}</p>}
    </form>
  );
}
