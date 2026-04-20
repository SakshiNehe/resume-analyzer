import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume
from app.config import get_settings

settings = get_settings()
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(
    title="AI Resume Analyzer",
    description="RAG-powered resume analysis using Gemini + local embeddings",
    version="2.0.0",
)

# CORS allows the React app on port 5173 to call this API on port 8000.
# Browsers block cross-origin requests by default as a security measure.
# This middleware adds the headers that tell the browser: "this is allowed."
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
async def root():
    return {
        "message": "AI Resume Analyzer API",
        "version": "2.0.0",
        "llm": "gemini-1.5-flash (free)",
        "embeddings": "all-MiniLM-L6-v2 (local)",
        "docs": "/docs",
    }