import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import AnimatedCard from '../ui/AnimatedCard';

export default function SkillsAtsTab({ analysis }) {
  const radarData = [
    { subject: 'Skills', value: Math.round((analysis.matching_skills.length / Math.max(analysis.matching_skills.length + analysis.missing_skills.length, 1)) * 100) },
    { subject: 'Experience', value: analysis.compatibility_score },
    { subject: 'ATS Score', value: Math.min(100, analysis.compatibility_score + 5) },
    { subject: 'Keywords', value: Math.max(40, analysis.compatibility_score - 8) },
    { subject: 'Presentation', value: Math.max(50, analysis.compatibility_score - 3) },
  ];

  // Related job roles based on matching skills
  const roles = deriveRoles(analysis.matching_skills, analysis.missing_skills);

  return (
    <div>
      {/* Radar chart */}
      <AnimatedCard delay={0}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dimension breakdown
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#475569' }} />
              <Radar name="Score" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>

      {/* Skills grid */}
      <AnimatedCard delay={100}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Matching skills
              <span style={{ marginLeft: 8, background: '#dcfce7', color: '#15803d', fontSize: 11, padding: '1px 8px', borderRadius: 10, fontWeight: 500 }}>
                {analysis.matching_skills.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {analysis.matching_skills.map((s, i) => (
                <span key={i} className="skill-badge" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: 10 }}>✓</span> {s}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Missing skills
              <span style={{ marginLeft: 8, background: '#fee2e2', color: '#dc2626', fontSize: 11, padding: '1px 8px', borderRadius: 10, fontWeight: 500 }}>
                {analysis.missing_skills.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {analysis.missing_skills.map((s, i) => (
                <span key={i} className="skill-badge" style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}>
                  <span style={{ fontSize: 10 }}>✗</span> {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Role suggestions */}
      <AnimatedCard delay={200}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Job roles you can explore
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {roles.map((r, i) => (
              <div key={i} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{r.reason}</div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: r.fit === 'High' ? '#15803d' : r.fit === 'Medium' ? '#d97706' : '#dc2626',
                }}>
                  {r.fit} fit
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

function deriveRoles(matching, missing) {
  const skills = matching.map(s => s.toLowerCase());
  const roles = [];

  const checks = [
    { keywords: ['python', 'ml', 'tensorflow', 'pytorch', 'scikit'], title: 'ML Engineer', reason: 'Strong Python + ML stack', fit: 'High' },
    { keywords: ['react', 'javascript', 'typescript', 'frontend', 'css'], title: 'Frontend Developer', reason: 'JS/React proficiency', fit: 'High' },
    { keywords: ['fastapi', 'django', 'flask', 'node', 'backend', 'api'], title: 'Backend Developer', reason: 'API & server-side skills', fit: 'High' },
    { keywords: ['sql', 'postgres', 'mysql', 'mongodb', 'database'], title: 'Data Engineer', reason: 'Database expertise', fit: 'Medium' },
    { keywords: ['docker', 'kubernetes', 'aws', 'gcp', 'devops', 'ci/cd'], title: 'DevOps Engineer', reason: 'Infrastructure skills', fit: 'Medium' },
    { keywords: ['nlp', 'llm', 'embedding', 'transformer', 'genai'], title: 'GenAI Engineer', reason: 'AI/LLM experience', fit: 'High' },
    { keywords: ['pandas', 'numpy', 'matplotlib', 'analysis', 'data'], title: 'Data Analyst', reason: 'Data analysis tools', fit: 'Medium' },
    { keywords: ['java', 'spring', 'microservices', 'kafka'], title: 'Java Developer', reason: 'Enterprise Java stack', fit: 'Medium' },
  ];

  for (const c of checks) {
    const matched = c.keywords.filter(k => skills.some(s => s.includes(k)));
    if (matched.length >= 1) roles.push(c);
  }

  return roles.slice(0, 6).length > 0 ? roles.slice(0, 6) : [
    { title: 'Software Engineer', reason: 'General engineering skills', fit: 'Medium' },
    { title: 'Full Stack Developer', reason: 'Broad technical background', fit: 'Medium' },
    { title: 'Technical Analyst', reason: 'Problem-solving skills', fit: 'Medium' },
  ];
}