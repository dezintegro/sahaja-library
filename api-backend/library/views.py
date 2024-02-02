from django.contrib.postgres.search import SearchRank, SearchQuery, SearchHeadline
from django.db.models import F, Count, Q
from django.db.models.functions import Left
from django_filters import rest_framework as filters
from rest_framework import generics

from core.date_parser import extract_date, remove_date
from library.consts import LECTION_PREVIEW_SYMBOLS_COUNT
from library.models import Lection
from library.serializers import (
    LectionSerializer,
    LectionsByYearSerializer, LectionReadSerializer,
)


class LectionFilter(filters.FilterSet):
    year = filters.NumberFilter(field_name="date", lookup_expr="year__exact")

    class Meta:
        model = Lection
        fields = ["year"]


class LectionsListView(generics.ListAPIView):
    serializer_class = LectionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = LectionFilter

    def get_queryset(self):
        base_qs = Lection.objects.all().select_related("country").order_by("-date")
        highlight = self.request.query_params.get("highlight")
        if not highlight:
            return base_qs.annotate(
                content=Left("content_ru", LECTION_PREVIEW_SYMBOLS_COUNT)
            )
        query = SearchQuery(highlight, config="russian")
        qs = base_qs.annotate(
            content=SearchHeadline(
                "content_ru",
                query,
                start_sel='<span class="highlight">',
                stop_sel="</span>",
                highlight_all=True,
            )
        )
        return qs


class LectionSearchView(generics.ListAPIView):
    serializer_class = LectionSerializer

    def get_queryset(self):
        query_str = self.kwargs["query"]
        date_entity = extract_date(query_str)
        if date_entity:
            query_str = remove_date(query_str, date_entity)
        search_query = SearchQuery(query_str, config="russian")
        qs = (
            Lection.objects.annotate(
                rank=SearchRank(F("tsvector_ru"), search_query),
                content=SearchHeadline(
                    "content_ru",
                    search_query,
                    start_sel='<span class="highlight">',
                    stop_sel="</span>",
                    max_words="75",
                    min_words="55",
                ),
            )
            .order_by("-rank")
            .select_related("country")
        )
        base_filter = Q()
        if query_str:
            base_filter.add(Q(tsvector_ru=search_query), Q.AND)
        if date_entity:
            filter_args = {
                f"date__{key}": value
                for key, value in date_entity.fact.as_json.items()
                if value
            }
            base_filter.add(Q(**filter_args), Q.AND)
        return qs.filter(base_filter)


class LectionsYearsMetaView(generics.ListAPIView):
    serializer_class = LectionsByYearSerializer

    def get_queryset(self):
        qs = (
            Lection.objects.filter(date__isnull=False, date__year__gt=1900)
            .values("date__year")
            .annotate(count=Count("*"))
            .order_by("-date__year")
        )
        return qs


class LectionReadView(generics.RetrieveAPIView):
    serializer_class = LectionReadSerializer

    def get_queryset(self):
        base_qs = Lection.objects.all().select_related("country")
        highlight = self.request.query_params.get("highlight")
        if not highlight:
            return base_qs
        query = SearchQuery(highlight, config="russian")
        qs = base_qs.annotate(
            content=SearchHeadline(
                "content_ru",
                query,
                start_sel='<span class="highlight">',
                stop_sel="</span>",
                highlight_all=True,
            )
        )
        return qs
