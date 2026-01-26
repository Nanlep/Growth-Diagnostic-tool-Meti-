import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Save, ExternalLink, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { saveLeadToDb } from '../services/bookingService';

interface Props {
  companyName: string;
  diagnosticScore?: number;
  diagnosticSummary?: string;
  businessModel?: string;
  annualRevenue?: string;
  employeeCount?: string;
  onBack: () => void;
}

// Helper to safely access env vars in various build environments
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore - Vite specific
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Node/Webpack specific
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

const GOOGLE_CALENDAR_URL = getEnvVar('VITE_GOOGLE_CALENDAR_URL');

export const Scheduler: React.FC<Props> = ({ 
  companyName, 
  diagnosticScore, 
  diagnosticSummary,
  businessModel, 
  annualRevenue, 
  employeeCount,
  onBack 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

  // Debug logging to help troubleshoot
  useEffect(() => {
    console.log('[Meti Debug] Checking Environment Configuration...');
    console.log('[Meti Debug] VITE_GOOGLE_CALENDAR_URL found:', !!GOOGLE_CALENDAR_URL);
    if (!GOOGLE_CALENDAR_URL) {
      console.warn('[Meti Debug] Calendar URL is missing. Ensure VITE_GOOGLE_CALENDAR_URL is set in .env');
    }
  }, []);

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save to Database (Supabase) before showing Calendar
    // This captures the lead even if they drop off during booking
    await saveLeadToDb({
       name: formData.name,
       email: formData.email,
       companyName,
       slotId: 'PENDING_GOOGLE_CAL',
       date: new Date().toISOString(),
       time: 'Pending',
       notes: formData.notes,
       diagnosticScore,
       diagnosticSummary,
       businessModel,
       annualRevenue,
       employeeCount
    });

    setIsSaved(true);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4">
       {/* Navigation */}
       <button 
         onClick={onBack}
         className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-10"
       >
         <ArrowLeft size={20} /> Back to Results
       </button>

       <div className="w-full max-w-5xl bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl mt-16 min-h-[600px] flex flex-col md:flex-row">
          
          {/* Left Panel: Context */}
          <div className="md:w-1/3 bg-slate-900/50 p-8 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
             <div className="mb-6">
               <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-900/50">
                 <span className="font-bold text-white text-xl">M</span>
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Strategy Session</h2>
               <p className="text-brand-400 font-medium text-sm">Complimentary 45-min Growth Audit</p>
             </div>
             
             <div className="space-y-4 mb-8">
               <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Your Diagnostic Score</div>
                 <div className="text-2xl font-bold text-white">{diagnosticScore}/100</div>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Our consultants will analyze your <span className="text-white">{companyName}</span> results, focusing on your {businessModel} model and unit economics to build a roadmap for scaling from {annualRevenue} to the next stage.
               </p>
             </div>

             <div className="mt-auto pt-6 border-t border-slate-800">
               <div className="flex items-center gap-2 text-xs text-slate-500">
                 <ExternalLink size={12} />
                 <span>Powered by Google Calendar & Meti AI</span>
               </div>
             </div>
          </div>

          {/* Right Panel: Form or Calendar */}
          <div className="md:w-2/3 relative bg-slate-50">
             
             {!isSaved ? (
               <div className="h-full flex flex-col justify-center p-8 md:p-12 bg-slate-800">
                  <h3 className="text-xl font-bold text-white mb-6">Final Step: Save Your Results</h3>
                  <p className="text-slate-400 mb-8">Enter your details to save your diagnostic report and unlock the booking calendar.</p>
                  
                  <form onSubmit={handleSaveAndContinue} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Work Email</label>
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="jane@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Specific questions? (Optional)</label>
                      <textarea 
                        rows={2}
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-lg shadow-lg shadow-brand-500/20 transition-all mt-4 flex justify-center items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : (
                        <>
                          <Save size={18} />
                          <span>Save & Select Time</span>
                        </>
                      )}
                    </button>
                  </form>
               </div>
             ) : (
               <div className="h-full w-full bg-white relative">
                 {GOOGLE_CALENDAR_URL ? (
                    <iframe 
                      src={GOOGLE_CALENDAR_URL} 
                      className="w-full h-full min-h-[600px] border-0" 
                      title="Schedule Appointment"
                      loading="lazy"
                    ></iframe>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                        <CalendarIcon className="text-slate-400" size={32} />
                      </div>
                      <h3 className="text-slate-900 font-bold text-xl mb-2">Demo Mode: Calendar Integration</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        In a production environment, your Calendly or Google Calendar booking page would appear here automatically.
                      </p>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm text-left mx-auto">
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                           <div>
                             <p className="text-yellow-800 font-semibold text-sm mb-1">Configuration Note</p>
                             <p className="text-yellow-700 text-xs">
                               To enable the live calendar, set the <code className="bg-yellow-100 px-1 rounded">VITE_GOOGLE_CALENDAR_URL</code> environment variable.
                               <br/><br/>
                               Check the browser console (F12) for detailed debugging info.
                             </p>
                           </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => window.open('https://calendar.google.com', '_blank')}
                        className="mt-8 text-brand-600 font-medium hover:text-brand-700 flex items-center gap-2"
                      >
                        <span>Open External Calendar (Example)</span>
                        <ExternalLink size={16} />
                      </button>
                   </div>
                 )}
               </div>
             )}
          </div>
       </div>
    </div>
  );
};