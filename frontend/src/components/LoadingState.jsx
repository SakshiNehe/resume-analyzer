import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Extracting text from resume...', duration: 3000 },
  { label: 'Generating semantic embeddings...', duration: 5000 },
  { label: 'Storing vectors in ChromaDB...', duration: 3000 },
  { label: 'Running similarity search...', duration: 4000 },
  { label: 'Sending context to GPT-4o...', duration: 8000 },
  { label: 'Generating analysis and suggestions...', duration: 5000 },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Advance through steps based on durations
    // This is purely visual — actual progress comes from the API
    let stepIndex = 0;
    const advance = () => {
      stepIndex++;
      if (stepIndex < STEPS.length) {
        setCurrentStep(stepIndex);
        setTimeout(advance, STEPS[stepIndex].duration);
      }
    };
    const timer = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(timer); // cleanup if component unmounts
  }, []);

  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
      padding: '3rem 2rem', maxWidth: 700, margin: '0 auto', textAlign: 'center',
    }}>
      {/* Pulsing circle animation */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#eff6ff', border: '3px solid #2563eb',
        margin: '0 auto 24px',
        animation: 'pulse 1.5s ease-in-out infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
      }}>
        🧠
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 8 }}>
        Analyzing your resume...
      </h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
        This takes 15–30 seconds. Our AI is reading your resume and matching it to the job.
      </p>

      {/* Step list */}
      <div style={{ textAlign: 'left', maxWidth: 380, margin: '0 auto' }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 12, opacity: i > currentStep ? 0.35 : 1,
            transition: 'opacity 0.5s',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
              background: i < currentStep ? '#dcfce7' : i === currentStep ? '#eff6ff' : '#f3f4f6',
              color: i < currentStep ? '#16a34a' : i === currentStep ? '#2563eb' : '#9ca3af',
              border: i === currentStep ? '2px solid #2563eb' : '2px solid transparent',
            }}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, color: i <= currentStep ? '#374151' : '#9ca3af' }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}