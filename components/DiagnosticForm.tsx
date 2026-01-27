import React, { useState } from 'react';
import { DiagnosticState } from '../types';
import { ChevronRight, ChevronLeft, Check, Box, Globe, Briefcase, ShoppingBag, Zap, Users, LayoutGrid, Radio, Layers, DollarSign, Timer, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: (data: DiagnosticState) => void;
}

const STEPS = ['Company Info', 'Business Model', 'Strategy', 'Unit Economics', 'Technology'];
const INDUSTRY_OPTIONS = ['SaaS', 'B2B Services', 'Ecommerce', 'Fintech', 'Healthcare', 'Manufacturing', 'Agency'];

const BUSINESS_MODELS = [
  { id: 'SaaS', label: 'SaaS / Subscription', desc: 'Recurring revenue software access', icon: <Layers size={20}/> },
  { id: 'Marketplace', label: 'Marketplace', desc: 'Connecting buyers & sellers', icon: <Globe size={20}/> },
  { id: 'Enterprise', label: 'Enterprise B2B', desc: 'High-ticket, long sales cycles', icon: <Briefcase size={20}/> },
  { id: 'DTC', label: 'E-commerce / DTC', desc: 'Physical goods to consumers', icon: <ShoppingBag size={20}/> },
  { id: 'Agency', label: 'Agency / Services', desc: 'Project or hourly based work', icon: <Users size={20}/> },
  { id: 'Usage', label: 'Usage / Transactional', desc: 'Pay-as-you-go / Fintech', icon: <Zap size={20}/> },
  { id: 'Freemium', label: 'Freemium / PLG', desc: 'Free entry with upsells', icon: <Box size={20}/> },
  { id: 'Media', label: 'Media / Ad-Supported', desc: 'Monetizing audience attention', icon: <Radio size={20}/> },
  { id: 'Hybrid', label: 'Hybrid / Other', desc: 'Mix of multiple models', icon: <LayoutGrid size={20}/> },
];

export const DiagnosticForm: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<DiagnosticState>({
    companyName: '',
    valueProposition: '',
    industry: 'SaaS',
    businessModel: 'SaaS',
    annualRevenue: '$1M - $5M',
    employeeCount: '11-50',
    primaryGoal: 'Increase Revenue',
    biggestChallenge: 'Lead Generation',
    marketingChannel: 'Outbound Sales',
    cac: '$200 - $1,000',
    ltv: '$1,000 - $5,000',
    paybackPeriod: '6-12 Months',
    salesCycleLength: '1-3 Months',
    techStackRating: 5,
    customerRetention: 5
  });

  const handleChange = (field: keyof DiagnosticState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Clear error on change
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!formData.companyName.trim()) {
        setError("Please enter your Company Name.");
        return false;
      }
      if (!formData.valueProposition.trim()) {
        setError("Please briefly describe your company and value proposition.");
        return false;
      }
      if (formData.industry === 'Others' || !formData.industry) {
         if (formData.industry === '') {
            setError("Please specify your industry.");
            return false;
         }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isCustomIndustry = !INDUSTRY_OPTIONS.includes(formData.industry);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{STEPS[currentStep]}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
          {/* Form Content */}
          <div className="animate-fade-in-up flex-grow">
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Company Profile</h2>
                <Input 
                  label="Company Name" 
                  value={formData.companyName} 
                  onChange={(v) => handleChange('companyName', v)}
                  placeholder="Acme Corp"
                  autoFocus
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Briefly describe company and value proposition</label>
                  <textarea 
                    value={formData.valueProposition}
                    onChange={(e) => handleChange('valueProposition', e.target.value)}
                    placeholder="e.g. We provide AI-driven logistics optimization for last-mile delivery fleets to reduce fuel costs by 15%."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all h-24 resize-none"
                  />
                </div>

                <div>
                  <Select
                    label="Industry"
                    value={isCustomIndustry ? 'Others' : formData.industry}
                    options={[...INDUSTRY_OPTIONS, 'Others']}
                    onChange={(v) => handleChange('industry', v === 'Others' ? 'Others' : v)}
                  />
                  {isCustomIndustry && (
                    <div className="mt-3 animate-fade-in">
                      <Input 
                        label="Specify Industry"
                        value={formData.industry === 'Others' ? '' : formData.industry}
                        onChange={(v) => handleChange('industry', v)}
                        placeholder="e.g. Construction, Logistics..."
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Annual Revenue"
                    value={formData.annualRevenue}
                    options={['<$10k', '$10k - $100k', '$100k - $500k', '$500k - $1M', '$1M - $5M', '$5M - $20M', '$20M+']}
                    onChange={(v) => handleChange('annualRevenue', v)}
                  />
                  <Select
                    label="Employees"
                    value={formData.employeeCount}
                    options={['1-10', '11-50', '51-200', '200+']}
                    onChange={(v) => handleChange('employeeCount', v)}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">How do you make money?</h2>
                  <p className="text-slate-400 text-sm mb-6">Select the primary business model that drives your growth.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {BUSINESS_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleChange('businessModel', model.id)}
                      className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                        formData.businessModel === model.id 
                          ? 'bg-brand-900/20 border-brand-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`mb-3 ${formData.businessModel === model.id ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {model.icon}
                      </div>
                      <div className={`font-semibold text-sm mb-1 ${formData.businessModel === model.id ? 'text-white' : 'text-slate-200'}`}>
                        {model.label}
                      </div>
                      <div className="text-xs text-slate-500 leading-tight">
                        {model.desc}
                      </div>
                      {formData.businessModel === model.id && (
                        <div className="absolute top-2 right-2 text-brand-500">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Strategy & Goals</h2>
                <Select
                  label="Primary Growth Goal"
                  value={formData.primaryGoal}
                  options={['Increase Revenue', 'Market Expansion', 'Profitability', 'Brand Awareness', 'Customer Retention']}
                  onChange={(v) => handleChange('primaryGoal', v)}
                />
                <Select
                  label="Biggest Challenge"
                  value={formData.biggestChallenge}
                  options={['Lead Generation', 'Sales Closing', 'Operational Efficiency', 'Hiring/Talent', 'Churn/Retention']}
                  onChange={(v) => handleChange('biggestChallenge', v)}
                />
                 <Select
                  label="Primary Marketing Channel"
                  value={formData.marketingChannel}
                  options={['SEO/Content', 'Paid Ads', 'Outbound Sales', 'Referrals/Partners', 'Social Media']}
                  onChange={(v) => handleChange('marketingChannel', v)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-2">Unit Economics</h2>
                   <p className="text-slate-400 text-sm">Understanding your efficiency ratio is critical for our AI assessment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2 text-red-400">
                      <DollarSign size={16} />
                      <span className="font-semibold text-sm">CAC</span>
                    </div>
                    <Select
                      label="Cost to Acquire Customer"
                      value={formData.cac}
                      options={['<$50', '$50 - $200', '$200 - $1,000', '$1,000 - $5,000', '$5,000+']}
                      onChange={(v) => handleChange('cac', v)}
                    />
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2 text-green-400">
                      <Briefcase size={16} />
                      <span className="font-semibold text-sm">LTV</span>
                    </div>
                    <Select
                      label="Customer Lifetime Value"
                      value={formData.ltv}
                      options={['<$500', '$500 - $2,000', '$2,000 - $10k', '$10k - $50k', '$50k+']}
                      onChange={(v) => handleChange('ltv', v)}
                    />
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                   <div className="flex items-center gap-2 mb-2 text-yellow-400">
                      <Timer size={16} />
                      <span className="font-semibold text-sm">Payback Period</span>
                    </div>
                   <Select
                    label="Time to recover CAC"
                    value={formData.paybackPeriod}
                    options={['Immediate', '< 3 Months', '3-6 Months', '6-12 Months', '12+ Months']}
                    onChange={(v) => handleChange('paybackPeriod', v)}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Technology & Operations</h2>
                <RangeInput 
                  label="Tech Stack Maturity (CRM, Automation, Analytics)"
                  value={formData.techStackRating}
                  onChange={(v) => handleChange('techStackRating', v)}
                  min={1} max={10}
                  description="1 = Spreadsheets, 10 = Fully Integrated AI-driven Stack"
                />
                 <Select
                  label="Average Sales Cycle"
                  value={formData.salesCycleLength}
                  options={['< 1 Month', '1-3 Months', '3-6 Months', '6-12 Months', '12+ Months']}
                  onChange={(v) => handleChange('salesCycleLength', v)}
                />
                <RangeInput 
                  label="Customer Retention Confidence"
                  value={formData.customerRetention}
                  onChange={(v) => handleChange('customerRetention', v)}
                  min={1} max={10}
                  description="1 = High Churn, 10 = Negative Churn / High Loyalty"
                />
              </div>
            )}
          </div>

          {/* Error Message Area */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 text-sm animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
             <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0 
                    ? 'text-slate-600 cursor-not-allowed' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
             >
               <ChevronLeft size={18} /> Back
             </button>

             <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold shadow-lg shadow-brand-500/20 transition-all hover:translate-x-1"
             >
               {currentStep === STEPS.length - 1 ? 'Generate Report' : 'Next Step'}
               {currentStep === STEPS.length - 1 ? <Check size={18} /> : <ChevronRight size={18} />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI Components
const Input = ({ label, value, onChange, placeholder, autoFocus }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
    />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-3 rounded-lg text-sm text-left transition-all border ${
            value === opt 
              ? 'bg-brand-600/20 border-brand-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const RangeInput = ({ label, value, onChange, min, max, description }: any) => (
  <div>
    <div className="flex justify-between items-end mb-4">
       <label className="block text-sm font-medium text-slate-400">{label}</label>
       <span className="text-2xl font-bold text-brand-400">{value}/10</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
    />
    <p className="text-xs text-slate-500 mt-2">{description}</p>
    <div className="flex justify-between text-xs text-slate-600 mt-1">
      <span>Low Maturity</span>
      <span>World Class</span>
    </div>
  </div>
);