import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Activity, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const PMFTest: React.FC<Props> = ({ onBack }) => {
  const [inputs, setInputs] = useState({
    disappointed: 20, // Slider 0-100: "Very Disappointed" %
    retention: 40,    // Slider 0-100: "Monthly Retention" %
    referrals: 10,    // Slider 0-100: "% Growth from Referrals"
  });
  
  const [showResult, setShowResult] = useState(false);

  // Sean Ellis Method: >40% "Very Disappointed" is the PMF threshold
  const calculatePMF = () => {
    // We normalize the score to 100 for display purposes
    // Logic:
    // - Disappointed % is the most critical driver (60% weight)
    // - Retention is secondary proof (25% weight)
    // - Referrals are tertiary proof (15% weight)
    
    // Score Calculation:
    // If Disappointed is 40%, you get full points for that section (60pts)
    // If Disappointed > 40%, you get bonus
    
    let score = 0;
    
    // 1. The 40% Rule (Sean Ellis)
    // Map 0-40% to 0-60pts. Map 40-100% to 60-75pts (diminishing returns)
    if (inputs.disappointed <= 40) {
      score += (inputs.disappointed / 40) * 60;
    } else {
      score += 60 + ((inputs.disappointed - 40) / 60) * 15;
    }

    // 2. Retention (Target 80% for SaaS, but let's say 60% is 'good' for general SMB)
    // Map 0-60% to 0-20pts
    score += Math.min(20, (inputs.retention / 60) * 20);

    // 3. Referrals (Target 30% organic)
    // Map 0-30% to 0-15pts
    score += Math.min(15, (inputs.referrals / 30) * 15);
    
    return Math.min(100, Math.round(score));
  };

  const finalScore = calculatePMF();
  const hasEllisFit = inputs.disappointed >= 40;

  const getVerdict = () => {
    if (hasEllisFit) return { 
      title: 'Product-Market Fit Achieved', 
      desc: 'You have passed the Sean Ellis threshold (40%). Your customers would be very disappointed without your product.',
      color: 'text-green-400', 
      bg: 'bg-green-500/10',
      border: 'border-green-500'
    };
    if (finalScore >= 50) return { 
      title: 'Approaching Fit', 
      desc: 'You have a solid core, but need to improve retention or differentiation to become essential.',
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500'
    };
    return { 
      title: 'Pre-Market Fit', 
      desc: 'You are likely still in the discovery phase. Focus on iterating your value proposition before scaling.',
      color: 'text-red-400', 
      bg: 'bg-red-500/10',
      border: 'border-red-500'
    };
  };

  const verdict = getVerdict();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
       {/* Nav */}
       <button 
         onClick={onBack}
         className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-10"
       >
         <ArrowLeft size={20} /> Return to Home
       </button>

       <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-fade-in-up">
          
          {/* Left Panel: Inputs */}
          <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                 <Activity size={24} />
               </div>
               <h2 className="text-2xl font-bold text-white">PMF Calculator</h2>
             </div>
             
             <p className="text-slate-400 text-sm mb-8">
               Based on the <span className="text-white font-medium">Sean Ellis Test</span>. Answer based on your latest customer surveys or data.
             </p>

             <div className="space-y-8">
                {/* Q1 */}
                <div>
                   <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-200">"Very Disappointed" Users</label>
                      <span className={`text-sm font-bold ${inputs.disappointed >= 40 ? 'text-green-400' : 'text-slate-400'}`}>
                        {inputs.disappointed}%
                      </span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={inputs.disappointed}
                     onChange={e => setInputs({...inputs, disappointed: Number(e.target.value)})}
                     className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                   />
                   <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                      <span>0%</span>
                      <span className="text-green-500/50">Target: 40%</span>
                      <span>100%</span>
                   </div>
                </div>

                {/* Q2 */}
                <div>
                   <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-200">Monthly Retention Rate</label>
                      <span className="text-sm font-bold text-slate-400">{inputs.retention}%</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={inputs.retention}
                     onChange={e => setInputs({...inputs, retention: Number(e.target.value)})}
                     className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                   />
                </div>

                {/* Q3 */}
                <div>
                   <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-slate-200">Organic / Referral Growth</label>
                      <span className="text-sm font-bold text-slate-400">{inputs.referrals}%</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={inputs.referrals}
                     onChange={e => setInputs({...inputs, referrals: Number(e.target.value)})}
                     className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                   />
                </div>
             </div>

             <button 
               onClick={() => setShowResult(true)}
               className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
             >
               Calculate Score
             </button>
          </div>

          {/* Right Panel: Results */}
          <div className="p-8 md:w-1/2 bg-slate-900/50 flex flex-col justify-center items-center text-center relative overflow-hidden">
             
             {!showResult ? (
               <div className="text-slate-500 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full border-2 border-slate-700 flex items-center justify-center mb-4">
                   <HelpCircle size={32} />
                 </div>
                 <p className="max-w-[200px]">Adjust the sliders to see your Product-Market Fit analysis.</p>
               </div>
             ) : (
               <div className="animate-scale-in w-full">
                 <div className="mb-2 uppercase tracking-wider text-xs font-bold text-slate-500">PMF Score</div>
                 <div className="relative inline-flex items-center justify-center mb-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                         className={verdict.color}
                         strokeDasharray={351} 
                         strokeDashoffset={351 - (351 * finalScore) / 100} 
                         strokeLinecap="round" 
                      />
                    </svg>
                    <span className={`absolute text-4xl font-bold text-white`}>{finalScore}</span>
                 </div>

                 <div className={`p-4 rounded-xl border ${verdict.bg} ${verdict.border} mb-6`}>
                    <h3 className={`font-bold text-lg mb-1 ${verdict.color}`}>{verdict.title}</h3>
                    <p className="text-slate-300 text-sm">{verdict.desc}</p>
                 </div>

                 <div className="space-y-3 text-left">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps</h4>
                    {hasEllisFit ? (
                      <>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <TrendingUp size={16} className="text-green-400 flex-shrink-0" />
                          <span>Aggressively scale marketing spend.</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <Users size={16} className="text-green-400 flex-shrink-0" />
                          <span>Optimize onboarding for the "undecided".</span>
                        </div>
                      </>
                    ) : (
                      <>
                         <div className="flex gap-2 text-sm text-slate-300">
                          <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
                          <span>Stop scaling. Focus on product iteration.</span>
                        </div>
                        <div className="flex gap-2 text-sm text-slate-300">
                          <HelpCircle size={16} className="text-orange-400 flex-shrink-0" />
                          <span>Interview the "somewhat disappointed" users.</span>
                        </div>
                      </>
                    )}
                 </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};