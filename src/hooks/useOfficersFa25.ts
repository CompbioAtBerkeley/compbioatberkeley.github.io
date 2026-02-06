import { useState, useEffect } from 'react';
import { Officer } from '@/types/officers';

export const useOfficersFa25 = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from the pre-built JSON file for FA25
        const response = await fetch('/fetched/officers/fa25/officers-fa25.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch FA25 officers data: ${response.status}`);
        }
        
        const data = await response.json();
        // Sort officers alphabetically by name
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setOfficers(sortedData);
      } catch (err) {
        console.error('Error fetching FA25 officers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch FA25 officers data');
        setOfficers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  return { officers, loading, error };
};
