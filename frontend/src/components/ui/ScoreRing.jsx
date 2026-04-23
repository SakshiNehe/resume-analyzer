import { useEffect, useState } from 'react';

export default function ScoreRing({ score, size = 120, strokeWidth = 10 }) {
  const [animated, setAnimated] = useState(0);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;

  const getColor = (s) => {
    if (s >= 75) return '#16a34a';
    if (s >= 50) return '#d97706';
    return '#dc2626';
  };

  const getBg = (s) => {
    if (s >= 75) return '#f0fdf4';
    if (s >= 50) return '#fffbeb';
    return '#fef2f2';
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circ - (animated / 100) * circ;
  const color = getColor(score);

  return (
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill={getBg(score)} stroke="#e2e8f0" strokeWidth={strokeWidth}
        />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: size * 0.28, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: size * 0.11, color, opacity: 0.7 }}>/100</div>
      </div>
    </div>
  );
}