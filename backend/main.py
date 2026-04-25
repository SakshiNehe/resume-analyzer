import os
import gc
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume
from app.config import get_settings

settings = get_settings()
os.makedirs(settings.upload_dir, exist_ok=True)
os.makedirs(settings.chroma_persist_dir, exist_ok=True)

app = FastAPI(
    title="AI Resume Analyzer",
    description="RAG-powered resume analysis — free tier optimized",
    version="2.0.0",
)

allowed_origins_str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
)
allowed_origins = [o.strip() for o in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.on_event("startup")
async def startup_event():
    """Pre-load the embedding model once at startup."""
    from app.services.embedding_service import get_embedding
    print("Pre-warming embedding model...")
    # Run one dummy embedding to load model into memory
    get_embedding("warmup")
    gc.collect()  # free any unused memory after loading
    print("Server ready")

@app.get("/")
async def root():
    return {
        "message": "AI Resume Analyzer API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
    }