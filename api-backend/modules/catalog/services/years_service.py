from django.db.models import Count
from modules.core.exports import Lection

def get_years_meta_queryset():
    return (
        Lection.objects.filter(date__isnull=False, date__year__gt=1900)
        .values("date__year")
        .annotate(count=Count("*"))
        .order_by("date__year")
    )
