from .chunking import chunk_text
from .embeddings import generate_embedding
from .models import Chunk

def process_file_into_chunks(file_instance):
    """
    Called after text extraction finishes. Splits extracted_text
    into chunks and generates an embedding for each.
    """
    if not file_instance.extracted_text:
        return

    text_chunks = chunk_text(file_instance.extracted_text)

    for index, chunk_str in enumerate(text_chunks):
        embedding = generate_embedding(chunk_str)
        Chunk.objects.create(
            file=file_instance,
            chunk_text=chunk_str,
            chunk_index=index,
            embedding=embedding,
        )