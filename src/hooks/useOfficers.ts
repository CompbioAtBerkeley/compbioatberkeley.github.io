import { useState, useEffect } from 'react';
import { Officer } from '@/types/officers';

export const useOfficers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from the pre-built JSON file
        const response = await fetch('/officers.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch officers data: ${response.status}`);
        }
        
        const data = await response.json();
        setOfficers(data);
      } catch (err) {
        console.error('Error fetching officers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch officers data');
        setOfficers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  return { officers, loading, error };
};
