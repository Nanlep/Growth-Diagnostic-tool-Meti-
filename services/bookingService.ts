import { BookingRequest, StoredLead } from '../types';
import { supabase } from './supabase';

/**
 * PRODUCTION BOOKING SERVICE
 * Strictly connects to Supabase. No local fallbacks.
 */

const ensureConnection = () => {
  if (!supabase) {
    throw new Error("Database connection missing. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required in environment variables.");
  }
};

/**
 * Saves a lead to the database.
 */
export const saveLeadToDb = async (request: BookingRequest): Promise<{ success: boolean; error?: string }> => {
  try {
    ensureConnection();
    
    // @ts-ignore - supabase is guaranteed not null by ensureConnection
    const { error } = await supabase!
      .from('leads')
      .insert([{
        company_name: request.companyName,
        contact_name: request.name,
        email: request.email,
        business_model: request.businessModel,
        annual_revenue: request.annualRevenue,
        pre_revenue: request.preRevenue,
        employee_count: request.employeeCount,
        diagnostic_score: request.diagnosticScore,
        diagnostic_summary: request.diagnosticSummary,
        notes: request.notes,
        referrer: request.referrer,
        // Full diagnostic fields
        value_proposition: request.valueProposition,
        industry: request.industry,
        primary_goal: request.primaryGoal,
        biggest_challenge: request.biggestChallenge,
        marketing_channel: request.marketingChannel,
        cac: request.cac,
        ltv: request.ltv,
        payback_period: request.paybackPeriod,
        sales_cycle_length: request.salesCycleLength,
        tech_stack_rating: request.techStackRating,
        customer_retention: request.customerRetention,
        status: 'Pending Booking' 
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase Error:', err);
    return { success: false, error: err.message || 'Database error' };
  }
};

/**
 * Authenticate Admin via Supabase Auth
 */
export const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    ensureConnection();
    
    const { error } = await supabase!.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Auth Error:', err);
    return { success: false, error: err.message || 'Authentication failed' };
  }
};

/**
 * Get All Leads (Admin) from Supabase
 */
export const getAdminLeads = async (): Promise<StoredLead[]> => {
  try {
    ensureConnection();

    const { data, error } = await supabase!
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!data) return [];
    
    // Map DB columns to frontend type
    return data.map((row: any) => ({
      id: row.id,
      name: row.contact_name,
      email: row.email,
      companyName: row.company_name,
      date: row.created_at,
      time: 'Via Calendly',
      slotId: 'N/A',
      notes: row.notes,
      referrer: row.referrer,
      diagnosticScore: row.diagnostic_score,
      diagnosticSummary: row.diagnostic_summary,
      businessModel: row.business_model,
      annualRevenue: row.annual_revenue,
      preRevenue: row.pre_revenue,
      employeeCount: row.employee_count,
      // Full diagnostic fields
      valueProposition: row.value_proposition,
      industry: row.industry,
      primaryGoal: row.primary_goal,
      biggestChallenge: row.biggest_challenge,
      marketingChannel: row.marketing_channel,
      cac: row.cac,
      ltv: row.ltv,
      paybackPeriod: row.payback_period,
      salesCycleLength: row.sales_cycle_length,
      techStackRating: row.tech_stack_rating,
      customerRetention: row.customer_retention,
      status: row.status,
      timestamp: row.created_at
    }));
  } catch (err) {
    console.error('Fetch Error:', err);
    // In production, we return empty array on failure but log it
    return [];
  }
};