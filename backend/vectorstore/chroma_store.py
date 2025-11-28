import chromadb

# In-memory client (temporary) – will be reinitialized for each ingest
client = None
collection = None

def init_vectorstore():
    """Initialize a fresh in‑memory Chroma client and collection.
    This should be called at the start of each ingestion to ensure a clean store.
    """
    global client, collection
    client = chromadb.Client()
    collection = client.get_or_create_collection("documents")

# Initialize on module load for safety (optional)
init_vectorstore()


def store_chunks(source, text, embedding):
    """Add a chunk to the current in‑memory collection.
    Assumes `init_vectorstore` has been called.
    """
    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[f"{source}-{hash(text)}"],
        metadatas=[{"source": source}]
    )

def search(query_embedding, k=5):
    """Search the current in‑memory collection.
    Returns the top `k` matching documents.
    """
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )