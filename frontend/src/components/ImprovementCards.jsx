import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

function ImprovementCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 12,
      overflow: 'hidden', marginBottom: 10,
    }}>
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 16px',
          background: expanded ? '#eff6ff' : '#fff',
          border: 'none', textAlign: 'left', transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%', background: '#dbeafe',
            color: '#1d4ed8', fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{index + 1}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
              {item.section}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              {item.current_issue}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '14px 16px', background: '#fff', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
              Suggestion
            </div>
            <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>
              {item.suggestion}
            </p>
          </div>
          {item.example && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: 8, padding: '10px 14px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#15803d', marginBottom: 4 }}>
                <Lightbulb size={11} style={{ marginRight: 4 }} />
                EXAMPLE
              </div>
              <p style={{ fontSize: 13, color: '#166534', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{item.example}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImprovementCards({ improvements, talkingPoints }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 14 }}>
          Resume Improvements
        </h3>
        {improvements.map((item, i) => (
          <ImprovementCard key={i} item={item} index={i} />
        ))}
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 14 }}>
          Interview Talking Points
        </h3>
        {talkingPoints.map((point, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%', background: '#eff6ff',
              color: '#1d4ed8', fontSize: 11, fontWeight: 700, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
            }}>{i + 1}</span>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}