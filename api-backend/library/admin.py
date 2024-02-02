from django.contrib import admin
from library import models


@admin.register(models.Lection)
class LectionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_lection",
        "is_verified",
        "note",
        "country",
        "city",
        "date",
        "is_public_program",
    )
    list_filter = ("is_public_program", "is_lection")
    actions = ("mark_as_non_lection",)

    def mark_as_non_lection(self, request, queryset):
        queryset.update(is_lection=False)


@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    pass
