import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ActivityStep {
  step_number: number;
  title: string;
  description: string;
  materials?: string[];
}

export interface EvaluationCriterion {
  criterion: string;
  level_1: string;
  level_2: string;
  level_3: string;
}

export interface LessonPlan {
  id: string;
  subject: string;
  grade_level: string;
  theme: string;
  introduction_ludica: string;
  objetivo_bncc: string;
  activity_steps: ActivityStep[];
  evaluation_rubric: EvaluationCriterion[];
  created_at: string;
  updated_at: string;
}
