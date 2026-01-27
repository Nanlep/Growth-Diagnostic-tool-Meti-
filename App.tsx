import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { DiagnosticForm } from './components/DiagnosticForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Scheduler } from './components/Scheduler';
import { AdminDashboard } from './components/AdminDashboard';
import { PMFTest } from './components/PMFTest';
import { AppView, AssessmentResult, DiagnosticState } from './types';
import { analyzeGrowth } from './services/geminiService';
import { Loader2, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticState | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setView(AppView.DIAGNOSTIC);
  };

  const handlePmfTest = () => {
    setView(AppView.PMF_TEST);
  };

  const handleDiagnosticComplete = async (data: DiagnosticState) => {
    setDiagnosticData(data);
    setView(AppView.ANALYZING);
    setError(null);
    
    try {
      // Call Backend API
      const analysis = await analyzeGrowth(data);
      setResult(analysis);
      setView(AppView.RESULTS);
    } catch (err: any) {
      console.error("Analysis Failed:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
    }
  };

  const handleSchedule = () => {
    setView(AppView.SCHEDULING);
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        {view === AppView.LANDING && (
          <Hero onStart={handleStart} onPmfTest={handlePmfTest} />
        )}

        {view === AppView.DIAGNOSTIC && (
          <DiagnosticForm onComplete={handleDiagnosticComplete} />
        )}

        {view === AppView.PMF_TEST && (
          <PMFTest onBack={() => setView(AppView.LANDING)} />
        )}

        {view === AppView.ANALYZING && (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
            {error ? (
              <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-red-500/30 shadow-2xl animate-fade-in-up">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2 text-white">Analysis Failed</h2>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                        onClick={() => setView(AppView.DIAGNOSTIC)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors border border-slate-600"
                    >
                        Edit Information
                    </button>
                    <button 
                        onClick={() => diagnosticData && handleDiagnosticComplete(diagnosticData)}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20"
                    >
                        Retry Analysis
                    </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <Loader2 size={64} className="text-brand-500 animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-2">Analyzing your business profile...</h2>
                <p className="text-slate-400 max-w-md">Our AI is comparing your metrics against 10,000+ growth companies to identify your scalability score.</p>
              </>
            )}
          </div>
        )}

        {view === AppView.RESULTS && result && (
          <ResultsDashboard 
            result={result} 
            onSchedule={handleSchedule} 
          />
        )}

        {view === AppView.SCHEDULING && (
          <Scheduler 
            companyName={diagnosticData?.companyName || 'Your Company'} 
            diagnosticScore={result?.overallScore}
            diagnosticSummary={result?.summary}
            businessModel={diagnosticData?.businessModel}
            annualRevenue={diagnosticData?.annualRevenue}
            employeeCount={diagnosticData?.employeeCount}
            onBack={() => setView(AppView.RESULTS)} 
          />
        )}

        {view === AppView.ADMIN && (
          <AdminDashboard onBack={() => setView(AppView.LANDING)} />
        )}
      </div>

      {/* Footer with Gated Admin Link - Hidden on print */}
      {view !== AppView.ADMIN && view !== AppView.PMF_TEST && (
        <footer className="py-8 bg-slate-950 border-t border-slate-900 print:hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-6">
                 <span>&copy; 2024 Meti Growth Diagnostics.</span>
                 <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://meti.pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-brand-500 transition-colors"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={10} />
                </a>
                
                <a 
                  href="https://www.growthforce.meti.pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-brand-500 transition-colors"
                >
                  <span>Apply as an Executive/Consultant</span>
                  <ExternalLink size={10} />
                </a>
                <button 
                  onClick={() => setView(AppView.ADMIN)}
                  className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <ShieldCheck size={12} />
                  <span>Staff Login</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;