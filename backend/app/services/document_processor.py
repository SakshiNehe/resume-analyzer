import os
import PyPDF2
import docx
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import get_settings

settings = get_settings()

def extract_text_from_pdf(file_path: str) -> str:
    """
    Opens a PDF binary file page by page and extracts all text.
    'rb' = read binary — PDFs are binary format, not plain text.
    Some pages may return None if they contain only images (scanned PDFs).
    """
    text = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text.strip()

def extract_text_from_docx(file_path: str) -> str:
    """
    A .docx file is a ZIP containing XML.
    python-docx unpacks it and exposes paragraphs as objects.
    We skip empty paragraphs (blank lines between sections).
    """
    doc = docx.Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)

def extract_text(file_path: str) -> str:
    """Routes to the correct extractor based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported format: {ext}. Use PDF or DOCX.")

def chunk_text(text: str) -> list[str]:
    """
    Splits long text into overlapping chunks.
    RecursiveCharacterTextSplitter tries paragraph breaks first,
    then sentence breaks, then word breaks — never mid-word.
    chunk_size=500 chars, chunk_overlap=50 chars overlap between chunks.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_text(text)
    return [c.strip() for c in chunks if c.strip()]

def process_document(file_path: str) -> dict:
    """Full pipeline: file path → text → chunks → metadata."""
    raw_text = extract_text(file_path)
    if not raw_text:
        raise ValueError("No text extracted. Is the PDF scanned/image-only?")
    chunks = chunk_text(raw_text)
    return {
        "full_text": raw_text,
        "chunks": chunks,
        "chunk_count": len(chunks),
        "character_count": len(raw_text),
    }