import QuizForm from "@/components/QuizForm";
import { ANSWERS } from "@/lib/answers";

export default function QuizPage() {
  const songIds = ANSWERS.map((a) => a.id);
  return (
    <main style={{ padding: 32 }}>
      <h1>Name That Tune</h1>
      <QuizForm songIds={songIds} />
    </main>
  );
}
