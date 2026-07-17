export type Guess = {
  songId: number;
  artist: string;
  song: string;
};

export type SubmitRequest = {
  clientId: string;
  name: string;
  guesses: Guess[];
};

export type ScoredAnswer = {
  songId: number;
  artistGuess: string;
  songGuess: string;
  artistCorrect: boolean;
  songCorrect: boolean;
};
