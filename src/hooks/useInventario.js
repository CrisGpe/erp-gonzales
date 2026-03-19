import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Producto } from '../models/Producto';

export function useInventario(salonId) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('salon_id', salonId)
      .order('nombre');

    if (!error) {
      // Transformamos los datos planos en instancias de nuestra clase POO
      setProductos(data.map(p => new Producto(p)));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (salonId) fetchStock();
  }, [salonId]);

  return { productos, loading, refresh: fetchStock };
}