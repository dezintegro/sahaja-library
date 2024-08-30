from django.urls import path

from modules.search.views import (
    LectionSearchView,
)

urlpatterns = [
    path("lections/search/<str:query>/", LectionSearchView.as_view(), name="search"),
]
