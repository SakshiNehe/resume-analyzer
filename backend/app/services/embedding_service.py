from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2

# ChromaDB's built-in embedding function
# Uses pre-compiled ONNX binary — no Rust, no PyTorch, no compilation
# Same all-MiniLM-L6-v2 model, 384 dimensions, ~50MB RAM
# Works on Render free tier without any issues

print("Loading ChromaDB built-in embedding function...")
_ef = ONNXMiniLM_L6_V2()
print("Embedding function ready")

def get_embedding(text: str) -> list[float]:
    """Convert one text string to a 384-dimensional vector."""
    text = text.replace("\n", " ").strip()
    result = _ef([text])
    return list(result[0])

def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Convert multiple texts to vectors in one efficient pass."""
    texts = [t.replace("\n", " ").strip() for t in texts]
    result = _ef(texts)
    return [list(e) for e in result]