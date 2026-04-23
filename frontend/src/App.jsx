import { useState } from 'react';
import UploadSection from './components/UploadSection.jsx';
import LoadingState from './components/LoadingState.jsx';
import Dashboard from './components/dashborad/Dashboard.jsx'
import { analyzeResume } from './api/resumeApi.js';
import { useHistory } from './hooks/useHistory.js';

const VIEWS = { UPLOAD: 'upload', LOADING: 'loading', RESULTS: 'results' };

export default function App() {
  const [view, setView] = useState(VIEWS.UPLOAD);
  const [result, setResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentJobDesc, setCurrentJobDesc] = useState('');
  const [apiError, setApiError] = useState('');
  const { history, addEntry, removeEntry, clearAll } = useHistory();

  const handleSubmit = async (file, jobDescription) => {
    setApiError('');
    setCurrentFile(file);
    setCurrentJobDesc(jobDescription);
    setView(VIEWS.LOADING);

    try {
      const data = await analyzeResume(file, jobDescription);
      if (data.success) {
        setResult(data);
        addEntry(data, file.name, jobDescription);
        setView(VIEWS.RESULTS);
      } else {
        setApiError(data.error || 'Analysis failed.');
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

  const handleRestoreHistory = (savedResult) => {
    setResult(savedResult);
    setView(VIEWS.RESULTS);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '2rem 1rem' }}>
      {/* Top nav bar */}
      <div style={{
        maxWidth: 900, margin: '0 auto 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#2563eb', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700,
          }}>R</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>ResumeAI</div>
            {/* <div style={{ fontSize: 11, color: '#64748b' }}>Powered by Llama 3.3 + RAG</div> */}
          </div>
        </div>
        {history.length > 0 && view !== VIEWS.RESULTS && (
          <button
            onClick={() => {
              if (history[0]) handleRestoreHistory(history[0].result);
            }}
            style={{
              fontSize: 12, color: '#2563eb', background: '#eff6ff',
              border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 14px', fontWeight: 500,
            }}
          >
            Last analysis: {history[0]?.score}/100
          </button>
        )}
      </div>

      {view === VIEWS.UPLOAD && (
        <>
          <UploadSection onSubmit={handleSubmit} isLoading={false} />
          {apiError && (
            <div style={{
              maxWidth: 700, margin: '16px auto 0', padding: '12px 16px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, fontSize: 13, color: '#dc2626',
            }}>
              Error: {apiError}
            </div>
          )}
        </>
      )}

      {view === VIEWS.LOADING && <LoadingState />}

      {view === VIEWS.RESULTS && result && (
        <Dashboard
          result={result}
          onReset={handleReset}
          history={history}
          onRemove={removeEntry}
          onClear={clearAll}
          onRestoreHistory={handleRestoreHistory}
          currentFile={currentFile}
        />
      )}
    </div>
  );
}