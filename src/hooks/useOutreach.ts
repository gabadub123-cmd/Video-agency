import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CompanyOutreach } from '../types/database';

export function useOutreach() {
  const [leads, setLeads] = useState<CompanyOutreach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_outreach')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addLead(lead: Omit<CompanyOutreach, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('company_outreach').insert([lead]).select();
    if (error) throw error;
    setLeads((prev) => [data[0], ...prev]);
    return data[0];
  }

  async function updateLead(id: string, updates: Partial<CompanyOutreach>) {
    const { data, error } = await supabase.from('company_outreach').update(updates).eq('id', id).select();
    if (error) throw error;
    setLeads((prev) => prev.map((l) => (l.id === id ? data[0] : l)));
    return data[0];
  }

  async function deleteLead(id: string) {
    const { error } = await supabase.from('company_outreach').delete().eq('id', id);
    if (error) throw error;
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  return { leads, loading, error, addLead, updateLead, deleteLead, refresh: fetchLeads };
}
