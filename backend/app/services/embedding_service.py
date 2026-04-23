from sentence_transformers import SentenceTransformer

# WHY THIS MODEL: 'all-MiniLM-L6-v2' is the most popular lightweight
# embedding model. It produces 384-dimensional vectors, is fast on CPU,
# and has excellent semantic understanding for English text.
# Downloads ~90MB once to C:\Users\you\.cache\huggingface\
# After that, loads from disk in ~2 seconds every time.
import os
from sentence_transformers import SentenceTransformer

# SENTENCE_TRANSFORMERS_HOME env var controls cache location
MODEL_NAME = 'all-MiniLM-L6-v2'

print(f"Loading embedding model: {MODEL_NAME}")
_model = SentenceTransformer(MODEL_NAME)
print("Embedding model loaded successfully")

def get_embedding(text: str) -> list[float]:
    text = text.replace("\n", " ")
    return _model.encode(text, convert_to_numpy=True).tolist()

def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    texts = [t.replace("\n", " ") for t in texts]
    return _model.encode(texts, convert_to_numpy=True).tolist()