import { useState } from 'react';
import { BookOpen, Plus, List } from 'lucide-react';
import { LessonPlanGenerator } from './components/LessonPlanGenerator';
import { SavedPlans } from './components/SavedPlans';
import { PlanViewer } from './components/PlanViewer';
import type { LessonPlan } from './lib/supabase';

type View = 'generator' | 'saved';

function App() {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePlanGenerated = (plan: LessonPlan) => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedPlan(plan);
  };

  const handleViewPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
  };

  const handleClosePlan = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gerador de Planos de Aula</h1>
                <p className="text-sm text-slate-600">Crie planos de aula personalizados e alinhados à BNCC</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentView('generator')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                currentView === 'generator'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <Plus className="w-5 h-5" />
              Novo Plano
            </button>
            <button
              onClick={() => setCurrentView('saved')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                currentView === 'saved'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <List className="w-5 h-5" />
              Planos Salvos
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'generator' ? (
          <LessonPlanGenerator onPlanGenerated={handlePlanGenerated} />
        ) : (
          <SavedPlans onViewPlan={handleViewPlan} refreshTrigger={refreshTrigger} />
        )}
      </main>

      {selectedPlan && <PlanViewer plan={selectedPlan} onClose={handleClosePlan} />}

      <footer className="absolte block w-full bottom-0 bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">
            Gerador de Planos de Aula com IA - made by Thiago Leite
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
