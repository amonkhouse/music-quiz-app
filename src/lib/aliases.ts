// Extra accepted song-title / artist variants, on top of the canonical
// answers.csv values. Keyed by answers.csv `id`.
export const SONG_ALIASES: Record<number, string[]> = {
  1: ["Country Roads"],
  // Dust Bowl samples this song, so it's a reasonable "gotcha" answer.
  4: ["Stars Will Fall"],
};

export const ARTIST_ALIASES: Record<number, string[]> = {
  4: ["Duster"],
};
