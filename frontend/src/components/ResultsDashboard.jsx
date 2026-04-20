import ScoreCard from './ScoreCard';
import SkillsPanel from './SkillsPanel';
import ImprovementCards from './ImprovementCards';

export default function ResultsDashboard({ result, onReset }) {
  const { analysis, metadata } = result;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header with reset button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111' }}>Analysis Results</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>
            {metadata?.chunks_processed} resume sections processed · {metadata?.chunks_retrieved} most relevant retrieved · {metadata?.model_used}
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '10px 20px', borderRadius: 10, border: '1px solid #d1d5db',
            background: '#fff', fontSize: 14, fontWeight: 500, color: '#374151',
          }}
        >
          ← Analyze Another
        </button>
      </div>

      <ScoreCard
        score={analysis.compatibility_score}
        rationale={analysis.score_rationale}
        recommendation={analysis.overall_recommendation}
      />

      {/* Experience alignment */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
        padding: '1.5rem', marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 10 }}>
          Experience Alignment
        </h3>
        <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>
          {analysis.experience_alignment}
        </p>
      </div>

      <SkillsPanel
        matchingSkills={analysis.matching_skills}
        missingSkills={analysis.missing_skills}
      />

      <ImprovementCards
        improvements={analysis.resume_improvements}
        talkingPoints={analysis.interview_talking_points}
      />
    </div>
  );
}