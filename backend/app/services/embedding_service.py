from fastembed import TextEmbedding

# fastembed uses ONNX runtime — much lighter than PyTorch
# all-MiniLM-L6-v2 via ONNX uses ~80MB RAM vs ~400MB with sentence-transformers
# Same model, same 384-dimensional output, same quality
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

print(f"Loading embedding model via fastembed: {MODEL_NAME}")
_model = TextEmbedding(model_name=MODEL_NAME)
print("Embedding model ready")

def get_embedding(text: str) -> list[float]:
    """Convert one text string to a 384-dimensional vector."""
    text = text.replace("\n", " ").strip()
    # fastembed returns a generator — convert to list first
    embeddings = list(_model.embed([text]))
    return embeddings[0].tolist()

def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Convert multiple texts to vectors in one efficient pass."""
    texts = [t.replace("\n", " ").strip() for t in texts]
    embeddings = list(_model.embed(texts))
    return [e.tolist() for e in embeddings]