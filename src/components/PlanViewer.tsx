import { X, BookOpen, Target, ListOrdered, CheckSquare } from 'lucide-react';
import type { LessonPlan } from '../lib/supabase';

interface PlanViewerProps {
  plan: LessonPlan;
  onClose: () => void;
}

export function PlanViewer({ plan, onClose }: PlanViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{plan.theme}</h2>
            <div className="flex gap-4 mt-2 text-sm text-slate-600">
              <span className="font-medium">{plan.subject}</span>
              <span>•</span>
              <span>{plan.grade_level}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
            aria-label="Fechar"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Introdução Lúdica</h3>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {plan.introduction_ludica || 'Não especificado'}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Objetivo BNCC</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed">
                {plan.objetivo_bncc || 'Não especificado'}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <ListOrdered className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Passo a Passo</h3>
            </div>
            <div className="space-y-4">
              {plan.activity_steps && plan.activity_steps.length > 0 ? (
                plan.activity_steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {step.step_number || index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 mb-2">
                          {step.title || `Passo ${index + 1}`}
                        </h4>
                        <p className="text-slate-700 leading-relaxed mb-3">
                          {step.description}
                        </p>
                        {step.materials && step.materials.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-slate-600">Materiais:</span>
                            <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                              {step.materials.map((material, idx) => (
                                <li key={idx}>{material}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Nenhum passo especificado</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <CheckSquare className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Rubrica de Avaliação</h3>
            </div>
            <div className="space-y-4">
              {plan.evaluation_rubric && plan.evaluation_rubric.length > 0 ? (
                plan.evaluation_rubric.map((criterion, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-slate-800 mb-3">
                      {criterion.criterion}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex gap-3">
                        <span className="font-medium text-sm text-orange-600 w-20">Nível 1:</span>
                        <p className="text-slate-700 text-sm flex-1">{criterion.level_1}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-sm text-orange-600 w-20">Nível 2:</span>
                        <p className="text-slate-700 text-sm flex-1">{criterion.level_2}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="font-medium text-sm text-orange-600 w-20">Nível 3:</span>
                        <p className="text-slate-700 text-sm flex-1">{criterion.level_3}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Nenhuma rubrica especificada</p>
              )}
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
