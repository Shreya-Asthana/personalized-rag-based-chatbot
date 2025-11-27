from embedding.gemini_embed import embed
from vectorstore import chroma_store
from processors.extract import extract_text

# embedding test
vec = embed("hello world")
print("embedding shape/type:", getattr(vec, "shape", type(vec)), type(vec))

# vectorstore add+query (convert to list)
emb_list = vec.tolist() if hasattr(vec, "tolist") else list(vec)
chroma_store.store_chunks("test-src", "test doc content", emb_list)
res = chroma_store.search(emb_list, k=1)
print("chroma search result keys:", res.keys() if hasattr(res, "keys") else str(res))

# extract test (update path to a small test file)
# print(extract_text(r"C:\path\to\sample.pdf"))