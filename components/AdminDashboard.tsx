import React, { useState, useEffect } from 'react';
import { StoredLead } from '../types';
import { adminLogin, getAdminLeads } from '../services/bookingService';
import { Lock, Search, RefreshCcw, LogOut, ArrowLeft, Calendar, User, Building2, Mail, FileText, Activity, Download, Layers, ChevronDown, ChevronUp, Target, TrendingUp, DollarSign, Briefcase, Timer, Cpu, Heart, Globe, Megaphone } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  onBack: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed due to network error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    const data = await getAdminLeads();
    setLeads(data);
  };

  const handleExport = () => {
    if (leads.length === 0) return;

    const headers = [
      'Booking ID',
      'Status',
      'Date Created',
      'Time/Slot',
      'Company Name',
      'Value Proposition',
      'Industry',
      'Business Model',
      'Annual Revenue',
      'Pre-Revenue',
      'Employee Count',
      'Contact Person',
      'Email Address',
      'Referrer ID',
      'Primary Goal',
      'Biggest Challenge',
      'Marketing Channel',
      'CAC',
      'LTV',
      'Payback Period',
      'Sales Cycle Length',
      'Tech Stack Rating',
      'Customer Retention',
      'Growth Score (0-100)',
      'AI Summary',
      'Client Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...leads.map(lead => {
        const dateStr = lead.date ? format(new Date(lead.date), 'yyyy-MM-dd') : 'N/A';
        const esc = (t: string | undefined) => `"${(t || '').replace(/"/g, '""')}"`;
        
        return [
          lead.id,
          lead.status,
          dateStr,
          lead.time,
          esc(lead.companyName),
          esc(lead.valueProposition),
          esc(lead.industry),
          esc(lead.businessModel || 'N/A'),
          esc(lead.annualRevenue || 'N/A'),
          esc(lead.preRevenue || 'N/A'),
          esc(lead.employeeCount || 'N/A'),
          esc(lead.name),
          lead.email,
          esc(lead.referrer || 'N/A'),
          esc(lead.primaryGoal || 'N/A'),
          esc(lead.biggestChallenge || 'N/A'),
          esc(lead.marketingChannel || 'N/A'),
          esc(lead.cac || 'N/A'),
          esc(lead.ltv || 'N/A'),
          esc(lead.paybackPeriod || 'N/A'),
          esc(lead.salesCycleLength || 'N/A'),
          lead.techStackRating || 0,
          lead.customerRetention || 0,
          lead.diagnosticScore || 0,
          esc(lead.diagnosticSummary),
          esc(lead.notes)
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meti_leads_export_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.referrer && l.referrer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.industry && l.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400 bg-slate-800';
    if (score >= 80) return 'text-green-400 bg-green-900/20 border-green-500/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    return 'text-red-400 bg-red-900/20 border-red-500/30';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2">
            <ArrowLeft size={16} /> Return to App
          </button>
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                <Lock className="text-brand-500" size={24} />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">Restricted Access</h2>
            <p className="text-slate-400 text-center mb-8 text-sm">Please enter root credentials to view lead database.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Admin Email"
                  autoFocus
                />
              </div>
              <div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Password"
                />
              </div>
              
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center"
              >
                {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : 'Authenticate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              Root Access
            </div>
            <span className="font-semibold ml-2">Lead Database</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-brand-500/20 mr-2"
              title="Download CSV for Google Sheets/CRM"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            
            <div className="h-6 w-px bg-slate-700 mx-1"></div>

            <button onClick={loadData} className="p-2 text-slate-400 hover:text-white bg-slate-700/50 rounded-lg" title="Refresh">
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut size={16} /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-slate-400 text-sm font-medium mb-1">Total Leads</h3>
              <p className="text-3xl font-bold text-white">{leads.length}</p>
           </div>
           <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-slate-400 text-sm font-medium mb-1">Pending Conversions</h3>
              <p className="text-3xl font-bold text-brand-400">{leads.length > 0 ? 'Active' : '0'}</p>
           </div>
           <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-slate-400 text-sm font-medium mb-1">Data Source</h3>
              <p className="text-sm text-slate-300 mt-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 Supabase Connected
              </p>
           </div>
        </div>

        {/* Search & Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search companies, emails, industries, referrers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-medium w-10"></th>
                  <th className="p-4 font-medium w-24">Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Scale Profile</th>
                  <th className="p-4 font-medium">Created At</th>
                  <th className="p-4 font-medium">Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No leads found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <React.Fragment key={lead.id}>
                      {/* Main Row */}
                      <tr 
                        className="hover:bg-slate-700/50 transition-colors group cursor-pointer"
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      >
                        <td className="p-4">
                          <button className="text-slate-500 hover:text-white transition-colors">
                            {expandedId === lead.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${getScoreColor(lead.diagnosticScore)}`}>
                            {lead.diagnosticScore || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            {lead.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-white flex items-center gap-2">
                               <User size={14} className="text-slate-500" /> {lead.name}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                               <Mail size={14} className="text-slate-500" /> {lead.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Building2 size={16} className="text-slate-500" />
                              {lead.companyName}
                            </div>
                            {lead.referrer && (
                              <div className="text-xs text-brand-400 flex items-center gap-1">
                                Referrer: {lead.referrer}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="text-xs font-semibold text-brand-400 flex items-center gap-1 mb-1">
                                <Layers size={12} /> {lead.businessModel || 'N/A'}
                              </span>
                              <div className="text-xs text-slate-400">
                                {lead.annualRevenue || '-'} <span className="text-slate-600">|</span> {lead.employeeCount ? `${lead.employeeCount} staff` : '-'}
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                             <span className="text-sm text-white font-medium">{lead.date ? format(new Date(lead.date), 'MMM d, yyyy') : '-'}</span>
                             <span className="text-xs text-brand-400">{lead.time}</span>
                          </div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="space-y-1">
                            {lead.notes && (
                               <div className="flex gap-1 text-xs text-slate-400">
                                 <FileText size={12} className="mt-0.5 flex-shrink-0" /> 
                                 <span className="truncate" title={lead.notes}>{lead.notes}</span>
                               </div>
                            )}
                            {lead.diagnosticSummary && (
                               <div className="flex gap-1 text-xs text-brand-400/80">
                                 <Activity size={12} className="mt-0.5 flex-shrink-0" /> 
                                 <span className="truncate" title={lead.diagnosticSummary}>{lead.diagnosticSummary}</span>
                               </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Detail Row */}
                      {expandedId === lead.id && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <div className="bg-slate-900/70 border-t border-slate-700/50 p-6 animate-fade-in">
                              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Full Diagnostic Data</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Company Profile */}
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Building2 size={12} /> Company Profile
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <DetailItem label="Value Proposition" value={lead.valueProposition} />
                                    <DetailItem label="Industry" value={lead.industry} />
                                    <DetailItem label="Annual Revenue" value={lead.annualRevenue} />
                                    <DetailItem label="Pre-Revenue" value={lead.preRevenue} />
                                    <DetailItem label="Employees" value={lead.employeeCount} />
                                  </div>
                                </div>

                                {/* Strategy */}
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target size={12} /> Strategy & Goals
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <DetailItem label="Primary Goal" value={lead.primaryGoal} />
                                    <DetailItem label="Biggest Challenge" value={lead.biggestChallenge} />
                                    <DetailItem label="Marketing Channel" value={lead.marketingChannel} />
                                  </div>
                                </div>

                                {/* Unit Economics */}
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <TrendingUp size={12} /> Unit Economics & Ops
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <DetailItem label="CAC" value={lead.cac} />
                                    <DetailItem label="LTV" value={lead.ltv} />
                                    <DetailItem label="Payback Period" value={lead.paybackPeriod} />
                                    <DetailItem label="Sales Cycle" value={lead.salesCycleLength} />
                                    <DetailItem label="Tech Stack" value={lead.techStackRating ? `${lead.techStackRating}/10` : undefined} />
                                    <DetailItem label="Retention" value={lead.customerRetention ? `${lead.customerRetention}/10` : undefined} />
                                  </div>
                                </div>
                              </div>

                              {/* AI Summary (full view) */}
                              {lead.diagnosticSummary && (
                                <div className="mt-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Activity size={12} /> AI Assessment Summary
                                  </h5>
                                  <p className="text-sm text-slate-300 leading-relaxed">{lead.diagnosticSummary}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-start">
    <span className="text-slate-500 text-xs">{label}</span>
    <span className="text-slate-200 text-xs text-right max-w-[60%]">{value || '—'}</span>
  </div>
);