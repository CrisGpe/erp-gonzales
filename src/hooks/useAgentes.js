import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAgentes(salonId = null) {
  const [agentes, setAgentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgentes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('agentes')
        .select(`
          *,
          perfiles (nombre_completo)
        `)
        .order('posicion_cola', { ascending: true });

      if (salonId) {
        query = query.eq('salon_id', salonId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAgentes(data);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentes();
  }, [salonId]);

  return { agentes, loading, refresh: fetchAgentes };
}