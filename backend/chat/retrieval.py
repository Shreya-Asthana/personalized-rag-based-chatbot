from backend.embedding.embedding import embed
from backend.vectorstore.chroma_store import search
from backend.chat.llm import generate_answer

def retrieve_answer(query):
    results = search(embed(query))

    if not results["documents"]:
        return {"answer": "No data found."}

    docs = "\n\n".join(results["documents"][0])
    answer = generate_answer(query, docs)

    return {"answer": answer, "sources": results["metadatas"][0]}