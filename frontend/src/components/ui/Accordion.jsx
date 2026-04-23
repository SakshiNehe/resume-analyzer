import { useState, useRef, useEffect } from 'react';

export default function Accordion({ title, subtitle, badge, badgeColor = '#eff6ff', badgeText = '#1d4ed8', children, defaultOpen = false, index = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      marginBottom: 8,
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      boxShadow: open ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
    }}>
      <button
        className="accordion-header"
        onClick={() => setOpen(!open)}
        style={{ borderRadius: open ? '10px 10px 0 0' : 10 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: open ? '#dbeafe' : '#f1f5f9',
            color: open ? '#1d4ed8' : '#64748b',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}>{index + 1}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {badge && (
            <span style={{
              marginLeft: 'auto', marginRight: 12,
              background: badgeColor, color: badgeText,
              fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 500,
            }}>{badge}</span>
          )}
        </div>
        <span style={{
          fontSize: 18, color: '#94a3b8', lineHeight: 1,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
          display: 'inline-block',
        }}>↓</span>
      </button>
      <div
        ref={bodyRef}
        className={`accordion-body ${open ? 'open' : ''}`}
      >
        <div style={{ padding: '4px 16px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}