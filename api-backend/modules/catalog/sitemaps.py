from django.contrib.sitemaps import Sitemap

from modules.catalog.services import years_service
from modules.core.models import Lection
from modules.core.sitemaps import BaseSitemap


class YearSitemap(BaseSitemap):

    def items(self):
        return years_service.get_years_meta_queryset()

    def location(self, obj):
        return f'/lections/years/{obj["date__year"]}'


class LectionSitemap(BaseSitemap):

    def items(self):
        return Lection.objects.all().order_by('id')

    def location(self, obj):
        return f'/lections/{obj.id}'
