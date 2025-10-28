import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { supabase, type LessonPlan, type ActivityStep, type EvaluationCriterion } from '../lib/supabase';

const GEMINI_API_KEY = 'AIzaSyC0ZrH2sxnRb3gM4DcjkCa8lFXjRrZCWmE';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

interface LessonPlanGeneratorProps {
  onPlanGenerated: (plan: LessonPlan) => void;
}

function extractFirstJson(text: string): string | null {
  if (!text) return null;
  text = text.replace(/```(?:json)?\n?/gi, '').replace(/```/g, '');
  const start = text.indexOf('{');
  if (start === -1) return null;

  let inString = false;
  let escape = false;
  let depth = 0;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"' || ch === "'") {
      if (!inString) {
        inString = ch as any;
      } else if (inString === ch) {
        inString = false;
      }
      continue;
    }
    if (inString) continue;

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

function cleanAiText(raw: string): string {
  if (!raw) return '';
  let t = raw.replace(/^[\s\S]*?(\{)/, (m, p1, offset, str) => str.slice(offset));
  t = t.replace(/```/g, '');
  return t.trim();
}

export function LessonPlanGenerator({ onPlanGenerated }: LessonPlanGeneratorProps) {
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    const prompt = `
Você é um assistente pedagógico experiente. Gere APENAS UM JSON VÁLIDO (SEM EXPLICAÇÕES) com os seguintes campos exatos:
{
  "introduction_ludica": "Texto da introdução lúdica envolvente e criativa",
  "objetivo_bncc": "Objetivo de aprendizagem alinhado à BNCC (indicar habilidade quando possível)",
  "activity_steps": [
    { "step_number": 1, "title": "Título do passo", "description": "Descrição detalhada", "materials": ["material1", "material2"] }
  ],
  "evaluation_rubric": [
    { "criterion": "Nome do critério", "level_1": "Descrição nível 1", "level_2": "Descrição nível 2", "level_3": "Descrição nível 3" }
  ]
}

Tema: ${theme}
Disciplina: ${subject}
Ano/Série: ${gradeLevel}

Responda SOMENTE com JSON válido (sem texto extra, sem markdown). Seja direto e gere campos completos e detalhados.
    `.trim();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Erro na API Gemini: ${response.status} — ${txt}`);
      }

      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

      const candidate = cleanAiText(raw);
      const jsonSubstring = extractFirstJson(candidate);

      if (!jsonSubstring) {
        throw new Error('Não foi possível localizar JSON na resposta da IA');
      }

      const parsedPlan = JSON.parse(jsonSubstring);

      const { data: savedPlan, error: saveError } = await supabase
        .from('lesson_plans')
        .insert([
          {
            subject,
            grade_level: gradeLevel,
            theme,
            introduction_ludica: parsedPlan.introduction_ludica || '',
            objetivo_bncc: parsedPlan.objetivo_bncc || '',
            activity_steps: parsedPlan.activity_steps || [],
            evaluation_rubric: parsedPlan.evaluation_rubric || [],
          },
        ])
        .select()
        .maybeSingle();

      if (saveError) throw saveError;
      if (savedPlan) {
        onPlanGenerated(savedPlan);
      }

      setSubject('');
      setGradeLevel('');
      setTheme('');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao gerar plano de aula');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Wand2 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Gerar Novo Plano de Aula</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            Disciplina
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Matemática, Português, Ciências..."
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700 mb-2">
            Ano / Série
          </label>
          <input
            type="text"
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="Ex: 5º ano, 6º ano do Ensino Fundamental..."
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-2">
            Tema da Aula
          </label>
          <input
            type="text"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Frações equivalentes, Fotossíntese..."
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando plano de aula...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Gerar Plano de Aula
            </>
          )}
        </button>

        <p className="text-sm text-slate-500 text-center">
          Configure sua chave da API Gemini no código para habilitar a geração
        </p>
      </form>
    </div>
  );
}
