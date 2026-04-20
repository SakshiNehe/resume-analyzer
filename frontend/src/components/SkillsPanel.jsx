export default function SkillsPanel({ matchingSkills, missingSkills }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16,
    }}>
      {/* Matching skills */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 14 }}>
          ✓ Matching Skills
          <span style={{
            marginLeft: 8, fontSize: 12, background: '#dcfce7', color: '#15803d',
            padding: '2px 8px', borderRadius: 12, fontWeight: 500,
          }}>{matchingSkills.length}</span>
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {matchingSkills.map((skill, i) => (
            <span key={i} style={{
              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500,
            }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Missing skills */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 14 }}>
          ✗ Missing Skills
          <span style={{
            marginLeft: 8, fontSize: 12, background: '#fee2e2', color: '#dc2626',
            padding: '2px 8px', borderRadius: 12, fontWeight: 500,
          }}>{missingSkills.length}</span>
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {missingSkills.map((skill, i) => (
            <span key={i} style={{
              background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3',
              borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500,
            }}>{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}