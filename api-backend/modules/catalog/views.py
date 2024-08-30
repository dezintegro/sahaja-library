from django_filters import rest_framework as filters
from rest_framework import generics

from modules.catalog.filters import LectionFilter
from modules.catalog.serializers import  YearMetaSerializer
from modules.catalog.services import lection_service, years_service
from modules.core.exports import LectionSerializer, LectionReadSerializer


class LectionsListView(generics.ListAPIView):
    serializer_class = LectionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = LectionFilter

    def get_queryset(self):
        highlight = self.request.query_params.get("highlight")
        return lection_service.get_lections_queryset(highlight)


class LectionReadView(generics.RetrieveAPIView):
    serializer_class = LectionReadSerializer

    def get_queryset(self):
        highlight = self.request.query_params.get("highlight")
        return lection_service.get_lection_read_queryset(highlight)


class YearsMetaView(generics.ListAPIView):
    serializer_class = YearMetaSerializer

    def get_queryset(self):
        return years_service.get_years_meta_queryset()

