import { useState } from 'react';
import { analyzeResume } from '../../api/resumeApi';
import ScoreRing from '../ui/ScoreRing';
import AnimatedCard from '../ui/AnimatedCard';
import Accordion from '../ui/Accordion';

// ── Inline detail panel shown inside each card ──────────────────────
function JobDetailPanel({ result }) {
  const { analysis } = result;

  return (
    <div style={{
      marginTop: 14,
      borderTop: '1px solid #f1f5f9',
      paddingTop: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>

      {/* Score rationale */}
      <div style={{
        background: '#f8fafc', borderRadius: 8,
        padding: '10px 12px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Why this score
        </div>
        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
          {analysis.score_rationale}
        </p>
      </div>

      {/* Matching skills */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#15803d', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Matching skills ({analysis.matching_skills.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {analysis.matching_skills.map((s, i) => (
            <span key={i} style={{
              background: '#f0fdf4', color: '#15803d',
              border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '3px 10px',
              fontSize: 11, fontWeight: 500,
            }}>✓ {s}</span>
          ))}
        </div>
      </div>

      {/* Missing skills */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Missing skills ({analysis.missing_skills.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {analysis.missing_skills.map((s, i) => (
            <span key={i} style={{
              background: '#fff1f2', color: '#be123c',
              border: '1px solid #fecdd3',
              borderRadius: 20, padding: '3px 10px',
              fontSize: 11, fontWeight: 500,
            }}>✗ {s}</span>
          ))}
        </div>
      </div>

      {/* Top 2 improvements */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Top improvements
        </div>
        {analysis.resume_improvements.slice(0, 2).map((item, i) => (
          <Accordion
            key={i}
            index={i}
            title={item.section}
            subtitle={item.current_issue}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#2563eb', marginBottom: 3, textTransform: 'uppercase' }}>Suggestion</div>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{item.suggestion}</p>
              </div>
              {item.example && (
                <div style={{ background: '#f0fdf4', borderRadius: 6, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#15803d', marginBottom: 3, textTransform: 'uppercase' }}>Example</div>
                  <p style={{ fontSize: 11, color: '#166534', fontStyle: 'italic', lineHeight: 1.5 }}>"{item.example}"</p>
                </div>
              )}
            </div>
          </Accordion>
        ))}
      </div>

      {/* Interview talking points */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Interview talking points
        </div>
        {analysis.interview_talking_points.slice(0, 3).map((pt, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#eff6ff', color: '#1d4ed8',
              fontSize: 10, fontWeight: 700, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 1,
            }}>{i + 1}</div>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{pt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full analysis slide-over panel ───────────────────────────────────
function FullAnalysisPanel({ result, jobLabel, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { analysis, metadata } = result;

  // Import tab components dynamically to avoid circular deps
  const [OverviewTab, setOverviewTab] = useState(null);
  const [SkillsTab, setSkillsTab] = useState(null);
  const [ImprovementsTab, setImprovementsTab] = useState(null);

  // Lazy load tab components
  useState(() => {
    import('./OverviewTab').then(m => setOverviewTab(() => m.default));
    import('./SkillsAtsTab').then(m => setSkillsTab(() => m.default));
    import('./ImprovementsTab').then(m => setImprovementsTab(() => m.default));
  });

  const TABS = [
    { id: 'overview', label: 'Overview', Component: OverviewTab },
    { id: 'skills', label: 'Skills & ATS', Component: SkillsTab },
    { id: 'improvements', label: 'Improvements', Component: ImprovementsTab },
  ];

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.5)',
        zIndex: 1000,
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      {/* Panel — stop click propagation so panel clicks don't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 720,
          height: '100%', background: '#fff',
          overflowY: 'auto',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          animation: 'slideIn 0.3s ease',
        }}
      >
        <style>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>

        {/* Panel header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              Full analysis — {jobLabel}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {metadata?.model_used} · {metadata?.chunks_processed} chunks
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: 8,
              width: 32, height: 32, fontSize: 18, color: '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Score summary bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 20px', background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: `3px solid ${analysis.compatibility_score >= 75 ? '#16a34a' : analysis.compatibility_score >= 50 ? '#d97706' : '#dc2626'}`,
            background: analysis.compatibility_score >= 75 ? '#f0fdf4' : analysis.compatibility_score >= 50 ? '#fffbeb' : '#fef2f2',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 18, fontWeight: 700,
              color: analysis.compatibility_score >= 75 ? '#16a34a' : analysis.compatibility_score >= 50 ? '#d97706' : '#dc2626',
              lineHeight: 1,
            }}>{analysis.compatibility_score}</span>
            <span style={{ fontSize: 9, color: '#64748b' }}>/100</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>
              {analysis.overall_recommendation?.replace(/_/g, ' ')}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              {analysis.matching_skills.length} matching · {analysis.missing_skills.length} missing
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #e2e8f0', padding: '0 20px' }}>
          <div className="tab-bar">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ padding: '20px' }}>
          {TABS.map(({ id, Component }) =>
            activeTab === id && Component
              ? <Component key={id} analysis={analysis} metadata={metadata} />
              : activeTab === id && !Component
              ? <div style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>Loading...</div>
              : null
          )}
        </div>
      </div>
    </div>
  );
}

// ── Individual job card ──────────────────────────────────────────────
function JobCard({ job, index, canRemove, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const [showFullPanel, setShowFullPanel] = useState(false);

  const scoreColor = job.result
    ? job.result.analysis.compatibility_score >= 75 ? '#16a34a'
    : job.result.analysis.compatibility_score >= 50 ? '#d97706'
    : '#dc2626'
    : '#94a3b8';

  return (
    <>
      <AnimatedCard delay={index * 80}>
        <div className="card" style={{ position: 'relative' }}>

          {/* Remove button */}
          {canRemove && (
            <button
              onClick={onRemove}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'none', border: 'none',
                color: '#94a3b8', fontSize: 18, padding: 4, lineHeight: 1,
              }}
            >×</button>
          )}

          {/* Job label */}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', marginBottom: 12 }}>
            {job.label}
          </div>

          {/* Loading state */}
          {job.loading && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: 13 }}>
              <div style={{
                width: 32, height: 32, border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb', borderRadius: '50%',
                margin: '0 auto 10px',
                animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Analyzing resume...
            </div>
          )}

          {/* Error state */}
          {job.error && (
            <div style={{ color: '#dc2626', fontSize: 13, padding: '8px 0' }}>{job.error}</div>
          )}

          {/* Result state */}
          {job.result && !job.loading && (
            <>
              {/* Score ring */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <ScoreRing score={job.result.analysis.compatibility_score} size={100} strokeWidth={9} />
              </div>

              {/* Recommendation */}
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'center', marginBottom: 10 }}>
                {job.result.analysis.overall_recommendation?.replace(/_/g, ' ')}
              </div>

              {/* Job description snippet */}
              {job.description && job.description !== '(current analysis)' && (
                <div style={{
                  fontSize: 11, color: '#64748b',
                  background: '#f8fafc', borderRadius: 6,
                  padding: '6px 10px', marginBottom: 10,
                  lineHeight: 1.5,
                }}>
                  {job.description.slice(0, 120)}...
                </div>
              )}

              {/* Quick stats */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 5 }}>
                  <span>Matching skills</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {job.result.analysis.matching_skills.length}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                  <span>Missing skills</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>
                    {job.result.analysis.missing_skills.length}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setExpanded(!expanded)}
                  style={{
                    flex: 1, padding: '8px 0',
                    background: expanded ? '#eff6ff' : '#f8fafc',
                    color: expanded ? '#1d4ed8' : '#475569',
                    border: `1px solid ${expanded ? '#bfdbfe' : '#e2e8f0'}`,
                    borderRadius: 8, fontSize: 12, fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {expanded ? '↑ Hide' : '↓ Details'}
                </button>
                <button
                  onClick={() => setShowFullPanel(true)}
                  style={{
                    flex: 1, padding: '8px 0',
                    background: '#2563eb', color: '#fff',
                    border: 'none', borderRadius: 8,
                    fontSize: 12, fontWeight: 600,
                  }}
                >
                  Full analysis →
                </button>
              </div>

              {/* Inline expanded detail */}
              <div style={{
                overflow: 'hidden',
                maxHeight: expanded ? 1200 : 0,
                opacity: expanded ? 1 : 0,
                transition: 'max-height 0.4s ease, opacity 0.3s ease',
              }}>
                {expanded && <JobDetailPanel result={job.result} />}
              </div>
            </>
          )}
        </div>
      </AnimatedCard>

      {/* Full analysis slide-over */}
      {showFullPanel && job.result && (
        <FullAnalysisPanel
          result={job.result}
          jobLabel={job.label}
          onClose={() => setShowFullPanel(false)}
        />
      )}
    </>
  );
}

// ── Main CompareTab export ───────────────────────────────────────────
export default function CompareTab({ currentResult, currentFile }) {
  const [jobs, setJobs] = useState(() => [
    {
      id: 1,
      label: 'Job 1 (current)',
      description: '(current analysis)',
      result: currentResult,
      loading: false,
      error: '',
    }
  ]);
  const [newJobDesc, setNewJobDesc] = useState('');
  const [addingJob, setAddingJob] = useState(false);

  const addComparison = async () => {
    if (!newJobDesc.trim() || newJobDesc.trim().length < 50 || !currentFile) return;
    setAddingJob(true);

    const newId = Date.now();
    const newJob = {
      id: newId,
      label: `Job ${jobs.length + 1}`,
      description: newJobDesc.trim(),
      result: null,
      loading: true,
      error: '',
    };

    setJobs(prev => [...prev, newJob]);
    setNewJobDesc('');
    setAddingJob(false);

    try {
      const { analyzeResume } = await import('../../api/resumeApi');
      const data = await analyzeResume(currentFile, newJob.description);
      setJobs(prev => prev.map(j =>
        j.id === newId ? { ...j, result: data, loading: false } : j
      ));
    } catch (err) {
      setJobs(prev => prev.map(j =>
        j.id === newId
          ? { ...j, loading: false, error: 'Analysis failed. Check backend and try again.' }
          : j
      ));
    }
  };

  const removeJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div>
      {/* Add job form */}
      <AnimatedCard delay={0}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Add another job to compare
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
            Paste a different job description — the same uploaded resume will be reused automatically.
          </div>

          {!currentFile && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', marginBottom: 12,
              fontSize: 12, color: '#dc2626',
            }}>
              No resume loaded. Go back to upload, then return here to compare.
            </div>
          )}

          <textarea
            value={newJobDesc}
            onChange={e => setNewJobDesc(e.target.value)}
            placeholder="Paste a different job description here (min 50 characters)..."
            rows={4}
            style={{
              width: '100%', border: '1px solid #d1d5db',
              borderRadius: 8, padding: '10px 12px',
              fontSize: 13, resize: 'vertical', outline: 'none',
              lineHeight: 1.6, marginBottom: 10,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#d1d5db'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              {newJobDesc.length} chars
              {newJobDesc.length > 0 && newJobDesc.length < 50 && (
                <span style={{ color: '#f59e0b' }}> · need {50 - newJobDesc.length} more</span>
              )}
              {newJobDesc.length >= 50 && (
                <span style={{ color: '#16a34a' }}> · ready</span>
              )}
            </span>
            <button
              onClick={addComparison}
              disabled={!currentFile || newJobDesc.trim().length < 50 || addingJob}
              style={{
                background: (!currentFile || newJobDesc.trim().length < 50) ? '#94a3b8' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 22px', fontSize: 13, fontWeight: 600,
                transition: 'background 0.2s',
              }}
            >
              + Analyze & Compare
            </button>
          </div>
        </div>
      </AnimatedCard>

      {/* Legend */}
      {jobs.length > 1 && (
        <div style={{
          display: 'flex', gap: 16, marginBottom: 16,
          fontSize: 11, color: '#64748b', flexWrap: 'wrap',
        }}>
          <span>↓ Details — expand skills and improvements inline</span>
          <span>Full analysis → — open complete dashboard for that job</span>
        </div>
      )}

      {/* Job cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {jobs.map((job, i) => (
          <JobCard
            key={job.id}
            job={job}
            index={i}
            canRemove={jobs.length > 1}
            onRemove={() => removeJob(job.id)}
          />
        ))}
      </div>
    </div>
  );
}