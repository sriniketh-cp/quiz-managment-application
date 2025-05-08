/*
  # Add quiz attempts table

  1. New Tables
    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `user_id` (uuid, references auth.users)
      - `score` (numeric)
      - `answers` (jsonb, stores selected answers)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quiz_attempts` table
    - Add policies for users to:
      - Create their own attempts
      - View their own attempts
*/

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  score numeric NOT NULL,
  answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for quiz attempts
CREATE POLICY "Users can create their own attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);