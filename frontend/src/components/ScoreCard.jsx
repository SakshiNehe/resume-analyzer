export default function ScoreCard({ score, rationale, recommendation }) {
  // Determine color based on score range
  const getScoreColor = (s) => {
    if (s >= 75) return { bg: '#dcfce7', text: '#15803d', bar: '#16a34a' };
    if (s >= 50) return { bg: '#fef9c3', text: '#854d0e', bar: '#ca8a04' };
    return { bg: '#fef2f2', text: '#dc2626', bar: '#ef4444' };
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent match';
    if (s >= 65) return 'Good match';
    if (s >= 50) return 'Moderate match';
    return 'Weak match';
  };

  const colors = getScoreColor(score);

  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
      padding: '1.75rem', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {/* The big score number */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%', flexShrink: 0,
          background: colors.bg, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          border: `3px solid ${colors.bar}`,
        }}>
          <span style={{ fontSize: 40, fontWeight: 700, color: colors.text, lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: 12, color: colors.text, opacity: 0.8 }}>/ 100</span>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111' }}>
              {getLabel(score)}
            </h2>
            <span style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 20,
              background: colors.bg, color: colors.text, fontWeight: 500,
            }}>
              {recommendation?.replace('_', ' ')}
            </span>
          </div>

          {/* Score progress bar */}
          <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, marginBottom: 12 }}>
            <div style={{
              height: 8, borderRadius: 4, background: colors.bar,
              width: `${score}%`, transition: 'width 1s ease',
            }} />
          </div>

          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
            {rationale}
          </p>
        </div>
      </div>
    </div>
  );
}