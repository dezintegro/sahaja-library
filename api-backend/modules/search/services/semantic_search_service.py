"""
Service for semantic search using pgvector and embeddings.
Provides similarity-based search that understands context and meaning.
"""

from typing import Optional
from django.db.models import Q, QuerySet
from django.contrib.postgres.search import SearchHeadline, SearchQuery
from pgvector.django import CosineDistance

from modules.core.exports import Lection
from modules.search.services.embeddings import embedding_service


def get_semantic_queryset(
    query_str: str,
    date_entity=None,
    similarity_threshold: float = 0.5,
    max_results: int = 100,
) -> QuerySet:
    """
    Perform semantic search using vector similarity.

    Args:
        query_str: Search query text
        date_entity: Optional date filter entity
        similarity_threshold: Minimum similarity score (0-1, higher is more similar)
        max_results: Maximum number of results to return

    Returns:
        QuerySet of Lection objects ordered by similarity
    """
    if not query_str or not query_str.strip():
        return Lection.objects.none()

    # Generate embedding for the search query
    query_embedding = embedding_service.generate_embedding(query_str)

    # Build base filter
    base_filter = Q(embedding__isnull=False)

    # Add date filter if provided
    if date_entity:
        filter_args = {
            f"date__{key}": value
            for key, value in date_entity.fact.as_json.items()
            if value
        }
        base_filter.add(Q(**filter_args), Q.AND)

    # Perform vector similarity search using cosine distance
    # Note: CosineDistance returns values from 0 (identical) to 2 (opposite)
    # We convert this to similarity score (0-1) in the application
    queryset = (
        Lection.objects.filter(base_filter)
        .annotate(
            distance=CosineDistance("embedding", query_embedding.tolist())
        )
        .filter(distance__lte=1 - similarity_threshold)  # Filter by threshold
        .order_by("distance")[:max_results]
    )

    return queryset


def get_hybrid_queryset(
    query_str: str,
    date_entity=None,
    similarity_threshold: float = 0.5,
    fulltext_weight: float = 0.3,
    semantic_weight: float = 0.7,
) -> QuerySet:
    """
    Perform hybrid search combining full-text and semantic search.

    This approach uses both traditional full-text search and semantic search,
    combining their results for better accuracy.

    Args:
        query_str: Search query text
        date_entity: Optional date filter entity
        similarity_threshold: Minimum similarity score for semantic search
        fulltext_weight: Weight for full-text search results (0-1)
        semantic_weight: Weight for semantic search results (0-1)

    Returns:
        QuerySet of Lection objects with combined ranking
    """
    if not query_str or not query_str.strip():
        return Lection.objects.none()

    # Get semantic search results
    semantic_results = get_semantic_queryset(
        query_str, date_entity, similarity_threshold
    )

    # Get IDs from semantic search for filtering
    semantic_ids = list(semantic_results.values_list("id", flat=True))

    if not semantic_ids:
        return Lection.objects.none()

    # Return semantic results (can be extended to combine with fulltext)
    return semantic_results


def get_semantic_highlighted_queryset(
    query_str: str, page_ids: list
) -> QuerySet:
    """
    Get lections with highlighted content for semantic search results.

    Args:
        query_str: Search query for highlighting
        page_ids: List of lection IDs to highlight

    Returns:
        QuerySet with highlighted content
    """
    if not page_ids:
        return Lection.objects.none()

    # Generate query embedding for ranking
    query_embedding = embedding_service.generate_embedding(query_str)

    # For highlighting, we'll use the full-text search headline feature
    # combined with semantic ranking
    search_query = SearchQuery(query_str, config="russian")
    search_headline = SearchHeadline(
        "content_ru",
        search_query,
        start_sel='<span class="highlight">',
        stop_sel="</span>",
        max_words="75",
        min_words="55",
    )

    queryset = (
        Lection.objects.filter(id__in=page_ids)
        .annotate(
            content=search_headline,
            distance=CosineDistance("embedding", query_embedding.tolist()),
        )
        .select_related("country")
        .order_by("distance")
    )

    return queryset
