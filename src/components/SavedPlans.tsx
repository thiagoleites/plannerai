import { useEffect, useState } from 'react';
import { BookOpen, Calendar, GraduationCap, Trash2, Eye } from 'lucide-react';
import { supabase, type LessonPlan } from '../lib/supabase';

interface SavedPlansProps {
  onViewPlan: (plan: LessonPlan) => void;
  refreshTrigger?: number;
}

export function SavedPlans({ onViewPlan, refreshTrigger }: SavedPlansProps) {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlans = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('lesson_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPlans(data || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este plano de aula?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir plano');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">Planos Salvos</h2>
        </div>
        <span className="text-sm text-slate-500">{plans.length} planos</span>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Nenhum plano de aula salvo ainda</p>
          <p className="text-sm text-slate-500 mt-2">Gere seu primeiro plano para começar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onViewPlan(plan)}
              className="border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition truncate">
                    {plan.theme}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{plan.subject}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>{plan.grade_level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(plan.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewPlan(plan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Ver plano"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(plan.id, e)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir plano"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
