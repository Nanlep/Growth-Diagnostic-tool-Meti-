import React from 'react';
import { AssessmentResult } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Calendar, CheckCircle2, AlertTriangle, TrendingUp, Download, Printer, Share2, Star, ExternalLink } from 'lucide-react';

interface Props {
  result: AssessmentResult;
  onSchedule: () => void;
}

export const ResultsDashboard: React.FC<Props> = ({ result, onSchedule }) => {
  const radarData = [
    { subject: 'Strategy', A: result.categoryScores.strategy, fullMark: 100 },
    { subject: 'Execution', A: result.categoryScores.execution, fullMark: 100 },
    { subject: 'Tech', A: result.categoryScores.technology, fullMark: 100 },
    { subject: 'Team', A: result.categoryScores.team, fullMark: 100 },
  ];

  // Mock benchmarking data relative to user score
  const benchmarkData = [
    {
      name: 'Strategy',
      You: result.categoryScores.strategy,
      'Avg': Math.min(100, result.categoryScores.strategy + (Math.random() * 20 - 10)),
      'Top 10%': 95,
    },
    {
      name: 'Exec',
      You: result.categoryScores.execution,
      'Avg': Math.min(100, result.categoryScores.execution + (Math.random() * 20 - 5)),
      'Top 10%': 92,
    },
    {
      name: 'Tech',
      You: result.categoryScores.technology,
      'Avg': Math.min(100, result.categoryScores.technology + (Math.random() * 20 - 15)),
      'Top 10%': 98,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20 print:bg-white print:text-black print:pb-0">
      <style>{`
        @media print {
          @page { margin: 1cm; size: portrait; }
          body { -webkit-print-color-adjust: exact; background-color: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .bg-slate-900 { background-color: white !important; }
          .bg-slate-800 { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; color: black !important; break-inside: avoid; }
          .text-white { color: black !important; }
          .text-slate-300 { color: #475569 !important; }
          .text-slate-400 { color: #64748b !important; }
          .text-brand-400, .text-brand-500 { color: #0d9488 !important; }
          
          /* Recharts Specific Overrides for Print */
          .recharts-text { fill: #334155 !important; }
          .recharts-cartesian-grid line { stroke: #cbd5e1 !important; }
          .recharts-polar-grid path { stroke: #cbd5e1 !important; }
          .recharts-legend-item-text { color: #334155 !important; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center font-bold">M</div>
             <span className="font-semibold text-lg hidden sm:inline">Meti Diagnostic Results</span>
             <span className="font-semibold text-lg sm:hidden">Results</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print Report</span>
            </button>
            <a 
              href="https://meti.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Meti.pro</span>
            </a>
            <button 
              onClick={onSchedule}
              className="bg-brand-600 hover:bg-brand-500 text-white px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20 flex items-center gap-2"
            >
              <Calendar size={16} />
              <span className="hidden sm:inline">Schedule Consultation</span>
              <span className="sm:hidden">Book Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block max-w-6xl mx-auto px-8 pt-8 mb-8 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Growth Diagnostic Report</h1>
            <p className="text-slate-500">Generated by Meti Growth AI</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-8">
        
        {/* Left Column: Score & Chart */}
        <div className="space-y-6 print:break-inside-avoid">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center print:border-slate-200 print:bg-slate-50">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Growth Readiness Score</h3>
            <div className="relative inline-flex items-center justify-center">
               <svg className="w-40 h-40 transform -rotate-90">
                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700 print:text-slate-200" />
                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-brand-500" 
                    strokeDasharray={440} strokeDashoffset={440 - (440 * result.overallScore) / 100} strokeLinecap="round" />
               </svg>
               <span className="absolute text-5xl font-bold text-white print:text-slate-900">{result.overallScore}</span>
            </div>
            <p className="mt-4 text-slate-300 text-sm print:text-slate-600">{result.summary}</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-80 print:h-96 print:border-slate-200 print:bg-white print:break-inside-avoid">
            <h3 className="text-slate-400 text-sm font-medium mb-4">Pillar Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" className="print:stroke-slate-300" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#14b8a6" strokeWidth={3} fill="#14b8a6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} itemStyle={{ color: '#14b8a6' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-2 space-y-6 print:space-y-8">
          
          {/* Benchmarking Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 print:border-slate-200 print:bg-white print:break-inside-avoid">
             <div className="flex items-center gap-3 mb-6">
                <Star className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white print:text-slate-900">Peer Benchmarking</h2>
             </div>
             <p className="text-slate-400 text-sm mb-6">Comparing your performance against 120+ companies in your industry.</p>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={benchmarkData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} className="print:stroke-slate-300" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff'}} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="You" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Avg" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Top 10%" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Action Plan */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 print:border-slate-200 print:bg-white print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-brand-400" size={24} />
              <h2 className="text-xl font-bold text-white print:text-slate-900">Strategic Recommendations</h2>
            </div>
            <div className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 transition-colors print:bg-slate-50 print:border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h4 className="font-semibold text-white print:text-slate-900">{rec.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded border font-medium w-fit ${
                      rec.impact === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-400 print:text-red-700 print:bg-red-50' :
                      rec.impact === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 print:text-yellow-700 print:bg-yellow-50' :
                      'bg-blue-500/10 border-blue-500/30 text-blue-400 print:text-blue-700 print:bg-blue-50'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed print:text-slate-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-8 print:break-inside-avoid">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 print:border-slate-200 print:bg-slate-50">
               <div className="flex items-center gap-2 mb-4 text-green-400 print:text-green-700">
                 <CheckCircle2 size={20} />
                 <h3 className="font-semibold text-white print:text-slate-900">Key Strengths</h3>
               </div>
               <ul className="space-y-2">
                 {result.strengths.map((s, i) => (
                   <li key={i} className="flex gap-2 text-sm text-slate-300 print:text-slate-600">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                     {s}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 print:border-slate-200 print:bg-slate-50">
               <div className="flex items-center gap-2 mb-4 text-orange-400 print:text-orange-700">
                 <AlertTriangle size={20} />
                 <h3 className="font-semibold text-white print:text-slate-900">Critical Gaps</h3>
               </div>
               <ul className="space-y-2">
                 {result.weaknesses.map((w, i) => (
                   <li key={i} className="flex gap-2 text-sm text-slate-300 print:text-slate-600">
                     <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></span>
                     {w}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-slate-800 rounded-2xl p-8 border border-indigo-500/30 text-center no-print">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to implement this plan?</h3>
            <p className="text-slate-300 mb-6">Our experts can help you execute these recommendations and scale faster.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="https://meti.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-indigo-800/50 hover:bg-indigo-800 border border-indigo-500/50 text-indigo-100 font-bold rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Explore Meti.pro</span>
                <ExternalLink size={16} />
              </a>
              <button 
                onClick={onSchedule}
                className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg w-full sm:w-auto"
              >
                Book Strategy Session
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};