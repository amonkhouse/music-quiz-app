CREATE TABLE submissions (
  id           SERIAL PRIMARY KEY,
  client_id    TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  total_score  INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submission_answers (
  id             SERIAL PRIMARY KEY,
  submission_id  INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  song_id        INTEGER NOT NULL,
  artist_guess   TEXT NOT NULL DEFAULT '',
  song_guess     TEXT NOT NULL DEFAULT '',
  artist_correct BOOLEAN NOT NULL,
  song_correct   BOOLEAN NOT NULL
);

CREATE INDEX idx_submission_answers_submission_id ON submission_answers(submission_id);
