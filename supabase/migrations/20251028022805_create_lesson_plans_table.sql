/*
  # Create lesson_plans table

  1. New Tables
    - `lesson_plans`
      - `id` (uuid, primary key)
      - `subject` (text) - Disciplina
      - `grade_level` (text) - Ano/Série
      - `theme` (text) - Tema da aula
      - `introduction_ludica` (text) - Introdução lúdica
      - `objetivo_bncc` (text) - Objetivo alinhado à BNCC
      - `activity_steps` (jsonb) - Array de passos da atividade
      - `evaluation_rubric` (jsonb) - Array de critérios de avaliação
      - `created_at` (timestamptz) - Data de criação
      - `updated_at` (timestamptz) - Data de atualização

  2. Security
    - Enable RLS on `lesson_plans` table
    - Add policy for public read access (anyone can view)
    - Add policy for public insert access (anyone can create)
*/

CREATE TABLE IF NOT EXISTS lesson_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  grade_level text NOT NULL,
  theme text NOT NULL,
  introduction_ludica text DEFAULT '',
  objetivo_bncc text DEFAULT '',
  activity_steps jsonb DEFAULT '[]'::jsonb,
  evaluation_rubric jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lesson plans"
  ON lesson_plans FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create lesson plans"
  ON lesson_plans FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update lesson plans"
  ON lesson_plans FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete lesson plans"
  ON lesson_plans FOR DELETE
  TO anon, authenticated
  USING (true);