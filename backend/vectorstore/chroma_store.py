import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection("documents")

def store_chunks(source, text, embedding):
    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[f"{source}-{hash(text)}"],
        metadatas=[{"source": source}]
    )

def search(query_embedding, k=5):
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )