/*
  # Quiz Management System Schema

  1. New Tables
    - `quizzes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)
      
    - `questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, foreign key)
      - `question_text` (text)
      - `created_at` (timestamp)
      
    - `answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `answer_text` (text)
      - `is_correct` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer_text text NOT NULL,
  is_correct boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes
CREATE POLICY "Users can create quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for questions
CREATE POLICY "Users can manage questions for their quizzes"
  ON questions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = quiz_id
    AND quizzes.user_id = auth.uid()
  ));

-- Policies for answers
CREATE POLICY "Users can manage answers for their questions"
  ON answers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM questions
    JOIN quizzes ON questions.quiz_id = quizzes.id
    WHERE questions.id = question_id
    AND quizzes.user_id = auth.uid()
  ));