import { useState, useEffect } from 'react';
import { Officer } from '@/types/officers';

// Helper function to get current semester based on date
function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  
  // Spring: Jan-July (months 0-6), Fall: Aug-Dec (months 7-11)
  const semester = month <= 6 ? 'sp' : 'fa';
  const semesterYear = String(year).slice(-2);
  
  return `${semester}${semesterYear}`;
}

export const useOfficers = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current semester and fetch from the semester-specific directory
        const semester = getCurrentSemester();
        const response = await fetch(`/fetched/officers/${semester}/officers-${semester}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch officers data: ${response.status}`);
        }
        
        const data = await response.json();
        // Sort officers alphabetically by name
        const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setOfficers(sortedData);
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
