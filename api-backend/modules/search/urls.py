from django.urls import path

from modules.search.views import (
    LectionSearchView,
    LectionSemanticSearchView,
    LectionHybridSearchView,
)

urlpatterns = [
    path("lections/search/<str:query>/", LectionSearchView.as_view(), name="search"),
    path(
        "lections/semantic-search/<str:query>/",
        LectionSemanticSearchView.as_view(),
        name="semantic-search",
    ),
    path(
        "lections/hybrid-search/<str:query>/",
        LectionHybridSearchView.as_view(),
        name="hybrid-search",
    ),
]
