from sentence_transformers import SentenceTransformer

# Load the free embedding model once, globally
model = SentenceTransformer('BAAI/bge-base-en-v1.5')  # Or use 'intfloat/e5-base-v2'

def embed(text):
    # text can be a string or a list of strings
    embedding = model.encode(text)  # Returns a NumPy array (vector or matrix)
    return embedding
