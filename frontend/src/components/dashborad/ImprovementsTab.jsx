import Accordion from '../ui/Accordion';
import AnimatedCard from '../ui/AnimatedCard';

const SECTION_COLORS = {
  Summary: { bg: '#eff6ff', text: '#1d4ed8' },
  Experience: { bg: '#f0fdf4', text: '#15803d' },
  Skills: { bg: '#fef9c3', text: '#854d0e' },
  Education: { bg: '#fdf4ff', text: '#7e22ce' },
};

export default function ImprovementsTab({ analysis }) {
  return (
    <div>
      <AnimatedCard delay={0}>
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#854d0e' }}>How to use these suggestions</div>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 3 }}>
              Each card shows a specific section to fix, what's wrong, and an example rewrite. Click any card to expand.
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Experience alignment — clean paragraph converted to bullet points */}
      <AnimatedCard delay={50}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Experience alignment
          </div>
          {analysis.experience_alignment
            .split('. ')
            .filter(s => s.trim().length > 10)
            .map((sentence, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#2563eb',
                  flexShrink: 0, marginTop: 7,
                }} />
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{sentence.trim().replace(/\.$/, '')}.</p>
              </div>
            ))}
        </div>
      </AnimatedCard>

      {/* Improvement cards as accordions */}
      <AnimatedCard delay={100}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resume improvements — click to expand
          </div>
          {analysis.resume_improvements.map((item, i) => {
            const colors = SECTION_COLORS[item.section] || { bg: '#f3f4f6', text: '#374151' };
            return (
              <Accordion
                key={i}
                index={i}
                title={item.section}
                subtitle={item.current_issue}
                badge={item.section}
                badgeColor={colors.bg}
                badgeText={colors.text}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* What to fix */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Current issue
                    </div>
                    <p style={{ fontSize: 13, color: '#374151' }}>{item.current_issue}</p>
                  </div>
                  {/* What to do */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#2563eb', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      What to do
                    </div>
                    <p style={{ fontSize: 13, color: '#374151' }}>{item.suggestion}</p>
                  </div>
                  {/* Example rewrite */}
                  {item.example && (
                    <div style={{
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#15803d', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Example rewrite
                      </div>
                      <p style={{ fontSize: 13, color: '#166534', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{item.example}"
                      </p>
                    </div>
                  )}
                </div>
              </Accordion>
            );
          })}
        </div>
      </AnimatedCard>
    </div>
  );
}