from pgvector.django import CosineDistance
from apps.search.models import Chunk
from .models import RelatedDocument

SIMILARITY_THRESHOLD = 0.70
TOP_N_RELATED = 5


def find_related_documents(file_instance):
    """
    Compares this file's chunks against all other chunks the user owns
    and stores the top similar files.
    """
    my_chunks = Chunk.objects.filter(file=file_instance)

    if not my_chunks.exists():
        return

    other_files_scores = {}

    for chunk in my_chunks:
        similar = (
            Chunk.objects
            .filter(file__user=file_instance.user)
            .exclude(file=file_instance)
            .annotate(distance=CosineDistance('embedding', chunk.embedding))
            .order_by('distance')[:10]
        )

        for s in similar:
            score = 1 - s.distance

            if score >= SIMILARITY_THRESHOLD:
                other_files_scores.setdefault(s.file_id, []).append(score)

    ranked = sorted(
        (
            (fid, sum(scores) / len(scores))
            for fid, scores in other_files_scores.items()
        ),
        key=lambda x: x[1],
        reverse=True,
    )[:TOP_N_RELATED]

    for other_file_id, avg_score in ranked:
        RelatedDocument.objects.update_or_create(
            file1=file_instance,
            file2_id=other_file_id,
            defaults={'similarity_score': avg_score},
        )


def update_related_documents_for_new_file(file_instance):
    """
    Recalculates relationships in both directions when a new file is uploaded.
    """

    # Find related existing files for the new file
    find_related_documents(file_instance)

    # Recalculate existing files so they can also see the new file
    other_files = (
        Chunk.objects
        .filter(file__user=file_instance.user)
        .exclude(file=file_instance)
        .values_list('file_id', flat=True)
        .distinct()
    )

    for file_id in other_files:
        from apps.files.models import File

        old_file = File.objects.get(id=file_id)
        find_related_documents(old_file)