from django.conf import settings
from django.contrib.sitemaps import Sitemap


class BaseSitemap(Sitemap):
    protocol = 'https'
    changefreq = "weekly"
    priority = 0.5


class StaticViewSitemap(BaseSitemap):
    priority = 1

    def items(self):
        return ['main', 'lections_by_year']

    def location(self, item):
        pages = { 'main': '/', 'lections_by_year': '/lections/years' }
        return pages[item]



