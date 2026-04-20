from sentence_transformers import SentenceTransformer

# WHY THIS MODEL: 'all-MiniLM-L6-v2' is the most popular lightweight
# embedding model. It produces 384-dimensional vectors, is fast on CPU,
# and has excellent semantic understanding for English text.
# Downloads ~90MB once to C:\Users\you\.cache\huggingface\
# After that, loads from disk in ~2 seconds every time.
_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> list[float]:
    """
    Converts one text string into a vector of 384 numbers.
    These numbers capture the MEANING of the text, not just keywords.
    'Python developer' and 'software engineer using Python' will have
    very similar vectors even though the words are different.
    """
    text = text.replace("\n", " ")
    embedding = _model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """
    Encodes multiple texts at once — much faster than one at a time
    because the model processes them in parallel internally.
    Used when storing all resume chunks at once.
    """
    texts = [t.replace("\n", " ") for t in texts]
    embeddings = _model.encode(texts, convert_to_numpy=True)
    return embeddings.tolist()