from django.contrib.postgres.search import SearchRank, SearchQuery, SearchHeadline
from django.db.models import F, Q
from modules.core.exports import Lection
from modules.search.consts import SEARCH_MIN_RANK


def build_filter(query_str, date_entity):
    base_filter = Q()
    if query_str:
        base_filter.add(Q(tsvector_ru=SearchQuery(query_str, config="russian"), rank__gte=SEARCH_MIN_RANK), Q.AND)
    if date_entity:
        filter_args = {
            f"date__{key}": value
            for key, value in date_entity.fact.as_json.items()
            if value
        }
        base_filter.add(Q(**filter_args), Q.AND)
    return base_filter

def get_base_queryset(query_str, date_entity, paginate_queryset):
    search_query = SearchQuery(query_str, config="russian")
    qs_filter = build_filter(query_str, date_entity)
    base_qs = (
        Lection.objects.annotate(
            rank=SearchRank(F("tsvector_ru"), search_query),
        ).order_by("-rank")
    ).filter(qs_filter)

    return base_qs

def get_highlighted_queryset(query_str, page):
    search_query = SearchQuery(query_str, config="russian")
    search_headline = SearchHeadline(
        "content_ru",
        search_query,
        start_sel='<span class="highlight">',
        stop_sel="</span>",
        max_words="75",
        min_words="55",
    )
    headline_qs = (
        Lection.objects.filter(id__in=[item.id for item in page])
        .annotate(
            content=search_headline,
            rank=SearchRank(F("tsvector_ru"), search_query),
        )
        .select_related("country")
        .order_by("-rank")
    )
    return headline_qs
