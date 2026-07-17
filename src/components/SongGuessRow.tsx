"use client";

type Props = {
  songId: number;
  artist: string;
  song: string;
  onChange: (songId: number, field: "artist" | "song", value: string) => void;
};

export default function SongGuessRow({ songId, artist, song, onChange }: Props) {
  return (
    <fieldset style={{ marginBottom: 16 }}>
      <legend>Song {songId}</legend>
      <div style={{ display: "flex", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          Artist
          <input
            value={artist}
            onChange={(e) => onChange(songId, "artist", e.target.value)}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          Song title
          <input
            value={song}
            onChange={(e) => onChange(songId, "song", e.target.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}
