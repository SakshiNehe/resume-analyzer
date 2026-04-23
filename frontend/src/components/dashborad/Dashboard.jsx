import { useState } from 'react';
import OverviewTab from './OverviewTab';
import SkillsAtsTab from './SkillsAtsTab';
import ImprovementsTab from './ImprovementsTab';
import CompareTab from './CompareTab';
import HistoryTab from './HistoryTab';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills', label: 'Skills & ATS' },
  { id: 'improvements', label: 'Improvements' },
  { id: 'compare', label: 'Compare Jobs' },
  { id: 'history', label: 'History' },
];

export default function Dashboard({ result, onReset, history, onRemove, onClear, onRestoreHistory, currentFile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { analysis, metadata } = result;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Analysis Results</h1>
          {/* <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
            {metadata?.chunks_processed} chunks processed · retrieved top {metadata?.chunks_retrieved} · {metadata?.model_used}
          </p> */}
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '10px 20px', borderRadius: 10,
            border: '1px solid #e2e8f0', background: '#fff',
            fontSize: 13, fontWeight: 500, color: '#374151',
          }}
        >
          ← Analyze another
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#fff', borderRadius: '12px 12px 0 0', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
        <div className="tab-bar" style={{ padding: '0 16px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === 'history' && history.length > 0 && (
                <span style={{
                  marginLeft: 6, background: '#eff6ff', color: '#1d4ed8',
                  fontSize: 10, padding: '1px 6px', borderRadius: 10,
                }}>{history.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0',
        borderTop: 'none', borderRadius: '0 0 12px 12px',
        padding: '1.5rem',
        minHeight: 400,
      }}>
        {activeTab === 'overview' && <OverviewTab analysis={analysis} metadata={metadata} />}
        {activeTab === 'skills' && <SkillsAtsTab analysis={analysis} />}
        {activeTab === 'improvements' && <ImprovementsTab analysis={analysis} />}
        {activeTab === 'compare' && <CompareTab currentResult={result} currentFile={currentFile} />}
        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            onRestore={onRestoreHistory}
            onRemove={onRemove}
            onClear={onClear}
          />
        )}
      </div>
    </div>
  );
}