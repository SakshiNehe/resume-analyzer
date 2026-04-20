from pydantic import BaseModel, Field
from typing import Optional

class ImprovementSuggestion(BaseModel):
    section: str
    current_issue: str
    suggestion: str
    example: str

class AnalysisResult(BaseModel):
    compatibility_score: int
    score_rationale: str
    matching_skills: list[str]
    missing_skills: list[str]
    experience_alignment: str
    resume_improvements: list[ImprovementSuggestion]
    interview_talking_points: list[str]
    overall_recommendation: str
    recommendation_explanation: str

class AnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[AnalysisResult] = None
    metadata: Optional[dict] = None
    error: Optional[str] = None