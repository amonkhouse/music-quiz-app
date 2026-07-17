import NameForm from "@/components/NameForm";

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Name That Tune</h1>
      <p>Guess the artist and song title for each track as it plays.</p>
      <NameForm />
    </main>
  );
}
