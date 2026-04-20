import { useState } from 'react';
import UploadSection from './components/UploadSection';
import LoadingState from './components/LoadingState';
import ResultsDashboard from './components/ResultsDashboard';
import { analyzeResume } from './api/resumeApi';

// Three possible "screens" — the app shows exactly one at a time
const VIEWS = { UPLOAD: 'upload', LOADING: 'loading', RESULTS: 'results' };

export default function App() {
  const [view, setView] = useState(VIEWS.UPLOAD);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState('');

const handleSubmit = async (file, jobDescription) => {
  setApiError('');
  setView(VIEWS.LOADING);

  try {
    const data = await analyzeResume(file, jobDescription);

    if (data.success) {
      setResult(data);

      // ✅ HISTORY LOGIC HERE (correct place)
      const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        score: data.analysis.compatibility_score,
        recommendation: data.analysis.overall_recommendation,
        result: data
      };

      const saved = localStorage.getItem('analysisHistory');
      const prevHistory = saved ? JSON.parse(saved) : [];

      const updated = [entry, ...prevHistory].slice(0, 10);

      setHistory(updated);
      localStorage.setItem('analysisHistory', JSON.stringify(updated));

      setView(VIEWS.RESULTS);
    } else {
      setApiError(data.error || 'Analysis failed. Please try again.');
      setView(VIEWS.UPLOAD);
    }
  } catch (err) {
    const msg = err.response?.data?.detail || err.message || 'Something went wrong.';
    setApiError(msg);
    setView(VIEWS.UPLOAD);
  }
};

  const handleReset = () => {
    setResult(null);
    setApiError('');
    setView(VIEWS.UPLOAD);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '2rem 1rem' }}>
      {view === VIEWS.UPLOAD && (
        <>
          <UploadSection onSubmit={handleSubmit} isLoading={false} />
          {apiError && (
            <div style={{
              maxWidth: 700, margin: '16px auto 0', padding: '12px 16px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, fontSize: 14, color: '#dc2626',
            }}>
              Error: {apiError}
            </div>
          )}
        </>
      )}

      {view === VIEWS.LOADING && <LoadingState />}

      {view === VIEWS.RESULTS && result && (
        <ResultsDashboard result={result} onReset={handleReset} />
      )}
    </div>
  );
}