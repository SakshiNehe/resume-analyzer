import { useState, useCallback } from 'react';

const STORAGE_KEY = 'resumeAnalysisHistory';
const MAX_ITEMS = 15;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addEntry = useCallback((result, fileName, jobSnippet) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      fileName: fileName || 'resume.pdf',
      jobSnippet: jobSnippet?.slice(0, 80) + '...',
      score: result.analysis.compatibility_score,
      recommendation: result.analysis.overall_recommendation,
      result,
    };
    const updated = [entry, ...history].slice(0, MAX_ITEMS);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage full — silently fail
    }
    return entry;
  }, [history]);

  const removeEntry = useCallback((id) => {
    const updated = history.filter(e => e.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [history]);

  const clearAll = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEntry, removeEntry, clearAll };
}