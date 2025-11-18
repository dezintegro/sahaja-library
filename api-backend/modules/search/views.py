from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from modules.core.exports import LectionSerializer
from modules.search.services import search_service, semantic_search_service, date_parser


class LectionSearchView(generics.ListAPIView):
    serializer_class = LectionSerializer

    def get_queryset(self):
        """
        For performance reasons we use little trick here. We have bottleneck
        in ts_headline SQL function, so we don't want to apply it for all entities
        in queryset.
        Details https://www.postgresql.org/docs/15/textsearch-controls.html#TEXTSEARCH-HEADLINE

        Solution:
        In first part we select entities without ts_headline and paginate queryset.
        In second part we apply ts_headline only for one page, so it works 10x faster.
        As result, we have to override list method and remove pagination there
        because we already paginate queryset in get_queryset
        """
        query_str, date_entity = date_parser.extract_date(self.kwargs["query"])
        page = self.paginate_queryset(
            search_service.get_base_queryset(query_str, date_entity, None)
        )
        return search_service.get_highlighted_queryset(query_str, page)

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return self.get_paginated_response(serializer.data)


class LectionSemanticSearchView(generics.ListAPIView):
    """
    Semantic search endpoint using vector embeddings.
    Provides context-aware search that understands meaning.

    Query parameters:
    - similarity_threshold (float): Minimum similarity score (0-1), default 0.5
    """
    serializer_class = LectionSerializer

    def get_queryset(self):
        """
        Perform semantic search using embeddings and pgvector.
        Similar to LectionSearchView, we paginate first, then apply highlighting.
        """
        query_str, date_entity = date_parser.extract_date(self.kwargs["query"])

        # Get similarity threshold from query params
        similarity_threshold = float(
            self.request.query_params.get("similarity_threshold", 0.5)
        )

        # Validate threshold
        if not 0 <= similarity_threshold <= 1:
            similarity_threshold = 0.5

        # Get semantic search results
        base_queryset = semantic_search_service.get_semantic_queryset(
            query_str, date_entity, similarity_threshold
        )

        # Paginate
        page = self.paginate_queryset(base_queryset)

        # Apply highlighting to paginated results
        if page:
            page_ids = [item.id for item in page]
            return semantic_search_service.get_semantic_highlighted_queryset(
                query_str, page_ids
            )

        return base_queryset.none()

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return self.get_paginated_response(serializer.data)


class LectionHybridSearchView(generics.ListAPIView):
    """
    Hybrid search endpoint combining full-text and semantic search.
    Provides best of both worlds for optimal search results.

    Query parameters:
    - similarity_threshold (float): Minimum similarity score (0-1), default 0.5
    - fulltext_weight (float): Weight for full-text results (0-1), default 0.3
    - semantic_weight (float): Weight for semantic results (0-1), default 0.7
    """
    serializer_class = LectionSerializer

    def get_queryset(self):
        """
        Perform hybrid search combining full-text and semantic approaches.
        """
        query_str, date_entity = date_parser.extract_date(self.kwargs["query"])

        # Get parameters from query params
        similarity_threshold = float(
            self.request.query_params.get("similarity_threshold", 0.5)
        )
        fulltext_weight = float(
            self.request.query_params.get("fulltext_weight", 0.3)
        )
        semantic_weight = float(
            self.request.query_params.get("semantic_weight", 0.7)
        )

        # Get hybrid search results
        base_queryset = semantic_search_service.get_hybrid_queryset(
            query_str,
            date_entity,
            similarity_threshold,
            fulltext_weight,
            semantic_weight,
        )

        # Paginate
        page = self.paginate_queryset(base_queryset)

        # Apply highlighting to paginated results
        if page:
            page_ids = [item.id for item in page]
            return semantic_search_service.get_semantic_highlighted_queryset(
                query_str, page_ids
            )

        return base_queryset.none()

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return self.get_paginated_response(serializer.data)
