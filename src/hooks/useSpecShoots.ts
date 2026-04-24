import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SpecShoot } from '../types/database';

export function useSpecShoots() {
  const [shoots, setShoots] = useState<SpecShoot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchShoots() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('spec_shoots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoots(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addShoot(shoot: Omit<SpecShoot, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('spec_shoots').insert([shoot]).select();
    if (error) throw error;
    setShoots((prev) => [data[0], ...prev]);
    return data[0];
  }

  async function updateShoot(id: string, updates: Partial<SpecShoot>) {
    const { data, error } = await supabase.from('spec_shoots').update(updates).eq('id', id).select();
    if (error) throw error;
    setShoots((prev) => prev.map((s) => (s.id === id ? data[0] : s)));
    return data[0];
  }

  async function deleteShoot(id: string) {
    const { error } = await supabase.from('spec_shoots').delete().eq('id', id);
    if (error) throw error;
    setShoots((prev) => prev.filter((s) => s.id !== id));
  }

  useEffect(() => {
    fetchShoots();
  }, []);

  return { shoots, loading, error, addShoot, updateShoot, deleteShoot, refresh: fetchShoots };
}
