import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import AnalysisResponse
from app.services.rag_service import analyze_resume_for_job
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/resume", tags=["Resume Analysis"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(..., min_length=50),
):
    """
    Receives resume file + job description from the React frontend.

    WHY UploadFile + Form (not JSON body):
    JSON can only carry text. Files are binary data.
    When sending both together, browsers use multipart/form-data format.
    FastAPI's UploadFile handles the file, Form() handles the text field.
    """
    # Validate file type
    ext = os.path.splitext(resume.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Only PDF or DOCX files accepted. Got: {ext}")

    # Read and validate file size
    content = await resume.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(413, f"File too large. Max: {settings.max_upload_size_mb}MB")

    # Save to disk temporarily (our processors need a file path)
    session_id = str(uuid.uuid4())
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, f"{session_id}{ext}")

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        result = await analyze_resume_for_job(
            resume_file_path=file_path,
            job_description=job_description,
            session_id=session_id,
        )
        return AnalysisResponse(
            success=True,
            analysis=result["analysis"],
            metadata=result["metadata"],
        )
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {str(e)}")
    finally:
        # Always delete the uploaded file — even if analysis crashed
        if os.path.exists(file_path):
            os.remove(file_path)


@router.get("/health")
async def health_check():
    return {"status": "healthy", "model": "gemini-1.5-flash", "embeddings": "local"}