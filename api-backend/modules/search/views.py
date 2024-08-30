from rest_framework import generics

from modules.core.exports import LectionSerializer
from modules.search.services import search_service, date_parser


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
