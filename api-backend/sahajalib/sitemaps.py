from modules.catalog.sitemaps import YearSitemap, LectionSitemap
from modules.core.sitemaps import StaticViewSitemap

sitemaps = {
    'static': StaticViewSitemap,
    'years': YearSitemap,
    'lections': LectionSitemap,
}
