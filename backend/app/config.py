from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    groq_api_key: str
    chroma_persist_dir: str = "./chroma_db"
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10
    chunk_size: int = 500
    chunk_overlap: int = 50

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()