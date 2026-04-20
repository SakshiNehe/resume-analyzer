import chromadb
from app.config import get_settings
from app.services.embedding_service import get_embedding, get_embeddings_batch

settings = get_settings()

# PersistentClient saves data to disk at chroma_persist_dir.
# If the app restarts, data is still there.
# This is different from in-memory databases that vanish on restart.
_client = chromadb.PersistentClient(path=settings.chroma_persist_dir)

def get_or_create_collection(name: str):
    """
    A ChromaDB collection is like a table in SQL.
    hnsw:space=cosine means similarity is measured by cosine distance
    (angle between vectors) which works best for text embeddings.
    """
    return _client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )

def store_chunks(
    chunks: list[str],
    collection_name: str,
    metadata: dict = None
) -> int:
    """
    Takes text chunks → generates vectors → stores both in ChromaDB.

    ChromaDB stores three things per item:
    - id: unique string identifier
    - embedding: the vector (384 numbers)
    - document: the original text (returned during search)
    - metadata: any extra info you want attached

    WHY store original text: when similarity search finds a match,
    you need the actual text to send to Gemini, not just the vector.
    """
    collection = get_or_create_collection(collection_name)
    embeddings = get_embeddings_batch(chunks)
    ids = [f"{collection_name}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [
        {**(metadata or {}), "chunk_index": i}
        for i in range(len(chunks))
    ]
    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
    )
    return len(chunks)

def similarity_search(
    query: str,
    collection_name: str,
    n_results: int = 5
) -> list[dict]:
    """
    THE CORE OF RAG:
    1. Embed the query text into a vector
    2. Compare that vector against all stored vectors
    3. Return the top n_results most similar chunks

    ChromaDB uses HNSW algorithm (Hierarchical Navigable Small World)
    — a graph-based approximate nearest neighbor search that is
    extremely fast even with millions of vectors.

    similarity_score = 1 - distance
    distance=0 means identical, distance=2 means completely opposite
    So similarity=1.0 is perfect match, similarity=0.0 is no match.
    """
    collection = get_or_create_collection(collection_name)
    count = collection.count()
    if count == 0:
        return []

    query_embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, count),
        include=["documents", "metadatas", "distances"],
    )

    output = []
    for i in range(len(results["documents"][0])):
        output.append({
            "text": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "similarity_score": round(1 - results["distances"][0][i], 4),
        })
    return output

def delete_collection(name: str):
    """Delete a collection after use to keep disk clean."""
    try:
        _client.delete_collection(name)
    except Exception:
        pass