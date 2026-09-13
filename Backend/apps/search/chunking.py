def chunk_text(text, chunk_size=500, overlap=50):
    """
    Splits text into word-based chunks with overlap between them,
    based on the chunking research we discussed earlier.
    """
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks