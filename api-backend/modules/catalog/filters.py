from django_filters import rest_framework as filters

from modules.core.models import Lection


class LectionFilter(filters.FilterSet):
    year = filters.NumberFilter(field_name="date", lookup_expr="year__exact")

    class Meta:
        model = Lection
        fields = ["year"]
