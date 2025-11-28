import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize

def chunk_text(
    text,
    max_tokens=500,
    overlap_tokens=100
):
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_tokens = sentence.split()
        sentence_len = len(sentence_tokens)

        # If adding this sentence exceeds the chunk limit:
        if current_length + sentence_len > max_tokens:
            chunks.append(" ".join(current_chunk))

            # Create overlap from the end of current chunk
            overlap = []
            overlap_len = 0

            for tok in reversed(current_chunk):
                token_len = len(tok.split())
                if overlap_len + token_len > overlap_tokens:
                    break
                overlap.insert(0, tok)
                overlap_len += token_len

            current_chunk = overlap.copy()
            current_length = overlap_len

        # Add sentence
        current_chunk.extend(sentence_tokens)
        current_length += sentence_len

    # Final chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
