from django.contrib.postgres.search import SearchQuery, SearchHeadline
from django.db.models.functions import Left
from modules.core.exports import Lection

from ..consts import LECTION_PREVIEW_SYMBOLS_COUNT

def get_lections_queryset(highlight=None):
    base_qs = Lection.objects.all().select_related("country").order_by("-date")
    if not highlight:
        return base_qs.annotate(
            content=Left("content_ru", LECTION_PREVIEW_SYMBOLS_COUNT)
        )
    query = SearchQuery(highlight, config="russian")
    return base_qs.annotate(
        content=SearchHeadline(
            "content_ru",
            query,
            start_sel='<span class="highlight">',
            stop_sel="</span>",
            highlight_all=True,
        )
    )

def get_lection_read_queryset(highlight=None):
    base_qs = Lection.objects.all().select_related("country")
    if not highlight:
        return base_qs
    query = SearchQuery(highlight, config="russian")
    return base_qs.annotate(
        content=SearchHeadline(
            "content_ru",
            query,
            start_sel='<span class="highlight">',
            stop_sel="</span>",
            highlight_all=True,
        )
    )
