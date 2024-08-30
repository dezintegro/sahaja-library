from django.urls import path

from .views import LectionsListView, YearsMetaView, LectionReadView

urlpatterns = [
    path("lections/", LectionsListView.as_view(), name="lections-list"),
    path("lections/<int:pk>/", LectionReadView.as_view(), name="lection-read"),
    path("lections/years/", YearsMetaView.as_view(), name="lections_by_year"),
]
