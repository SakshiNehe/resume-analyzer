import json
from groq import Groq
from app.config import get_settings
from app.services.vector_store import similarity_search, store_chunks, delete_collection
from app.services.document_processor import process_document

settings = get_settings()

# Groq runs Llama 3.3 70B — powerful open source model, completely free
# 14,400 requests/day, resets every 24 hours, no credit card ever
client = Groq(api_key=settings.groq_api_key)

MODEL_NAME = "llama-3.3-70b-versatile"

ANALYSIS_PROMPT = """You are a senior technical recruiter and career coach with 15 years of experience.

CANDIDATE RESUME SECTIONS (most relevant to this job, retrieved by semantic search):
{resume_context}

JOB DESCRIPTION:
{job_description}

Analyze the match between this candidate and the job.
Respond with ONLY a valid JSON object. No text before it. No text after it. No markdown. No explanation. Just the raw JSON.

{{
  "compatibility_score": <integer 0-100>,
  "score_rationale": "<2-3 sentences explaining exactly why this score was given>",
  "matching_skills": ["<skill found in both resume and job>"],
  "missing_skills": ["<skill required by job but absent from resume>"],
  "experience_alignment": "<one detailed paragraph about how their experience matches>",
  "resume_improvements": [
    {{
      "section": "<Summary OR Experience OR Skills OR Education>",
      "current_issue": "<specific problem with this section>",
      "suggestion": "<concrete actionable fix>",
      "example": "<rewritten example showing the improvement>"
    }}
  ],
  "interview_talking_points": [
    "<specific talking point the candidate should prepare>",
    "<another talking point>",
    "<another talking point>"
  ],
  "overall_recommendation": "<hire OR strong_consider OR consider OR pass>",
  "recommendation_explanation": "<one sentence: why this recommendation>"
}}"""


async def analyze_resume_for_job(
    resume_file_path: str,
    job_description: str,
    session_id: str,
) -> dict:
    """
    Complete RAG pipeline using Groq + Llama 3.3 70B as the LLM.

    STAGE 1 — Extract & Chunk:
      Read PDF/DOCX → split into ~500 char overlapping chunks
      Why: focused chunks are retrievable; one giant blob loses detail

    STAGE 2 — Embed & Store:
      sentence-transformers converts chunks to 384-dim vectors → ChromaDB stores them
      Why: vectors enable mathematical similarity comparison

    STAGE 3 — Retrieve:
      Embed job description → find top 6 most similar resume chunks
      Why: send only relevant context to LLM, not the whole resume

    STAGE 4 — Augment & Generate:
      Retrieved chunks + job description → prompt → Groq/Llama → JSON
      Why: LLM has specific evidence to reason from

    STAGE 5 — Parse & Return:
      Clean response → parse JSON → return to frontend
    """

    # STAGE 1: Extract text and chunk it
    doc_data = process_document(resume_file_path)

    # STAGE 2: Embed all chunks and store in ChromaDB
    # Each session gets its own collection so users don't interfere
    collection_name = f"resume_{session_id}"
    store_chunks(
        chunks=doc_data["chunks"],
        collection_name=collection_name,
        metadata={"session_id": session_id, "source": "resume"},
    )

    # STAGE 3: Find most relevant resume sections for this job
    relevant_chunks = similarity_search(
        query=job_description,
        collection_name=collection_name,
        n_results=6,
    )

    # STAGE 4: Build the augmented prompt
    resume_context = "\n\n---\n\n".join([
        f"[Resume Section {i+1} | Relevance: {chunk['similarity_score']}]\n{chunk['text']}"
        for i, chunk in enumerate(relevant_chunks)
    ])

    prompt = ANALYSIS_PROMPT.format(
        resume_context=resume_context,
        job_description=job_description,
    )

    # Call Groq API — synchronous SDK wrapped in async function
    # temperature=0.2: low randomness = consistent structured JSON
    # max_tokens=2048: enough for full analysis response
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": "You are a resume analysis expert. Always respond with valid JSON only. No markdown, no explanation, just the JSON object."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=2048,
    )

    raw_text = response.choices[0].message.content.strip()

    # Clean up in case model adds markdown fences
    if "```" in raw_text:
        parts = raw_text.split("```")
        raw_text = parts[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    # Find JSON object boundaries as extra safety
    start = raw_text.find("{")
    end = raw_text.rfind("}") + 1
    if start != -1 and end > start:
        raw_text = raw_text[start:end]

    try:
        analysis = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"LLM returned invalid JSON.\nError: {e}\nRaw: {raw_text[:500]}"
        )

    # Cleanup ChromaDB collection for this session
    delete_collection(collection_name)

    return {
        "analysis": analysis,
        "metadata": {
            "chunks_processed": doc_data["chunk_count"],
            "chunks_retrieved": len(relevant_chunks),
            "model_used": f"{MODEL_NAME} via Groq (free)",
            "embedding_model": "all-MiniLM-L6-v2 (local, free)",
            "retrieval_scores": [c["similarity_score"] for c in relevant_chunks],
        },
    }