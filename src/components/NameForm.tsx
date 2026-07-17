"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const CLIENT_ID_KEY = "quizClientId";
const NAME_KEY = "quizName";

export default function NameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your name to start.");
      return;
    }

    if (!sessionStorage.getItem(CLIENT_ID_KEY)) {
      sessionStorage.setItem(CLIENT_ID_KEY, crypto.randomUUID());
    }
    sessionStorage.setItem(NAME_KEY, trimmed);
    router.push("/quiz");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        name="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Amy"
      />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button type="submit">Start quiz</button>
    </form>
  );
}
