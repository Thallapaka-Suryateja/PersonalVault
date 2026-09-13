from groq import Groq
from django.conf import settings
from pgvector.django import CosineDistance
from apps.search.models import Chunk
from apps.search.embeddings import generate_embedding

client = Groq(api_key=settings.GROQ_API_KEY)

RELEVANCE_THRESHOLD = 1.0  # cosine distance cutoff — tune this based on testing

SYSTEM_PROMPT = """You are an assistant that answers questions using ONLY the context provided below,
which comes from the user's own uploaded documents.

Rules you must follow:
- If the context does not contain enough information to answer, say so clearly. Do not use outside knowledge.
- Do not give definitive medical, legal, or financial conclusions — summarize what the document says and
  suggest the user consult a relevant professional for interpretation or decisions.
- Cite which document/page each part of your answer comes from, using the source labels given in the context.
"""


def retrieve_relevant_chunks(user, query, top_k=5):
    query_embedding = generate_embedding(query)
    results = (
        Chunk.objects
        .filter(file__user=user)
        .annotate(distance=CosineDistance('embedding', query_embedding))
        .order_by('distance')[:top_k]
    )
    # Enforce the relevance threshold from the answer policy —
    # weak matches should not be treated as sufficient grounding.
    return [r for r in results if r.distance <= RELEVANCE_THRESHOLD]


def build_context(chunks):
    parts = []
    for i, chunk in enumerate(chunks):
        label = f"[Source {i+1}: {chunk.file.filename}, page {chunk.page_number or 'N/A'}]"
        parts.append(f"{label}\n{chunk.chunk_text}")
    return "\n\n".join(parts)


def ask_question(user, question):
    chunks = retrieve_relevant_chunks(user, question)

    if not chunks:
        return {
            "answer": "I couldn't find anything in your uploaded documents relevant to this question. "
                      "Try uploading a relevant file or rephrasing your question.",
            "sources": [],
        }

    context = build_context(chunks)

    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"},
        ],
        temperature=0.2,
    )

    answer = completion.choices[0].message.content

    return {
        "answer": answer,
        "sources": chunks,
    }