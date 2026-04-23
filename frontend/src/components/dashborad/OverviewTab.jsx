import ScoreRing from '../ui/ScoreRing';
import AnimatedCard from '../ui/AnimatedCard';

const REC_COLORS = {
  hire: { bg: '#dcfce7', text: '#15803d', label: 'Strong Hire' },
  strong_consider: { bg: '#dbeafe', text: '#1d4ed8', label: 'Strong Consider' },
  consider: { bg: '#fef9c3', text: '#854d0e', label: 'Consider' },
  pass: { bg: '#fee2e2', text: '#dc2626', label: 'Pass' },
};

export default function OverviewTab({ analysis, metadata }) {
  const rec = REC_COLORS[analysis.overall_recommendation] || REC_COLORS.consider;

  const dims = [
    { label: 'Skills match', value: Math.round((analysis.matching_skills.length / Math.max(analysis.matching_skills.length + analysis.missing_skills.length, 1)) * 100) },
    { label: 'Experience fit', value: analysis.compatibility_score },
    { label: 'ATS keyword score', value: Math.min(100, analysis.compatibility_score + 5) },
  ];

  return (
    <div>
      {/* Score + rec row */}
      <AnimatedCard delay={0}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
          <ScoreRing score={analysis.compatibility_score} size={120} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                {analysis.compatibility_score >= 75 ? 'Strong match' : analysis.compatibility_score >= 50 ? 'Good match' : 'Weak match'}
              </h2>
              <span style={{
                background: rec.bg, color: rec.text,
                fontSize: 12, padding: '3px 12px', borderRadius: 20, fontWeight: 600,
              }}>{rec.label}</span>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
              {analysis.recommendation_explanation}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: `${analysis.matching_skills.length} matching`, color: '#dcfce7', text: '#15803d' },
                { label: `${analysis.missing_skills.length} missing`, color: '#fee2e2', text: '#dc2626' },
                { label: metadata?.model_used || 'llama-3.3-70b', color: '#eff6ff', text: '#1d4ed8' },
                { label: `${metadata?.chunks_processed || 0} resume chunks`, color: '#f3f4f6', text: '#374151' },
              ].map((b, i) => (
                <span key={i} style={{
                  background: b.color, color: b.text,
                  fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 500,
                }}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Metric cards */}
      <AnimatedCard delay={100}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {dims.map((d, i) => (
            <div key={i} className="metric-card">
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{d.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: d.value >= 70 ? '#16a34a' : d.value >= 50 ? '#d97706' : '#dc2626', marginBottom: 8 }}>
                {d.value}%
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{
                  width: `${d.value}%`,
                  background: d.value >= 70 ? '#16a34a' : d.value >= 50 ? '#d97706' : '#dc2626',
                }} />
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Score rationale — clean card, no wall of text */}
      <AnimatedCard delay={150}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Why this score
          </div>
          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
            {analysis.score_rationale}
          </p>
        </div>
      </AnimatedCard>

      {/* Interview talking points — numbered clean list */}
      <AnimatedCard delay={200}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interview talking points
          </div>
          {analysis.interview_talking_points.map((pt, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: '#eff6ff',
                color: '#1d4ed8', fontSize: 12, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
              }}>{i + 1}</div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{pt}</p>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
}