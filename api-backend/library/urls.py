from django.urls import path

from library.views import (
    LectionsListView,
    LectionReadView,
    LectionSearchView,
    LectionsYearsMetaView,
)

urlpatterns = [
    path("lections/", LectionsListView.as_view(), name="lections-list"),
    path("lections/<int:pk>/", LectionReadView.as_view(), name="lection-read"),
    path("lections/search/<str:query>/", LectionSearchView.as_view(), name="search"),
    path("lections/years/", LectionsYearsMetaView.as_view(), name="lections_by_year"),
]
