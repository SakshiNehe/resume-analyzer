import ScoreRing from '../ui/ScoreRing';
import AnimatedCard from '../ui/AnimatedCard';

export default function HistoryTab({ history, onRestore, onRemove, onClear }) {
  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No analyses yet</div>
        <div style={{ fontSize: 13 }}>Your past analyses will appear here automatically.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>{history.length} past analyses saved locally</span>
        <button
          onClick={onClear}
          style={{ fontSize: 12, color: '#dc2626', background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px' }}
        >
          Clear all
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((entry, i) => (
          <AnimatedCard key={entry.id} delay={i * 40}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1rem 1.25rem' }}>
              <ScoreRing score={entry.score} size={60} strokeWidth={6} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.fileName}
                  </span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 500, flexShrink: 0,
                    background: entry.recommendation === 'hire' ? '#dcfce7' : entry.recommendation === 'pass' ? '#fee2e2' : '#eff6ff',
                    color: entry.recommendation === 'hire' ? '#15803d' : entry.recommendation === 'pass' ? '#dc2626' : '#1d4ed8',
                  }}>
                    {entry.recommendation?.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.jobSnippet}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{entry.timestamp}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => onRestore(entry.result)}
                  style={{
                    background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                    borderRadius: 7, padding: '6px 14px', fontSize: 12, fontWeight: 500,
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => onRemove(entry.id)}
                  style={{
                    background: 'none', color: '#94a3b8', border: '1px solid #e2e8f0',
                    borderRadius: 7, padding: '6px 10px', fontSize: 12,
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}