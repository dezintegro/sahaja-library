from rest_framework import serializers

from modules.core.models import Lection

LINE_SEPARATOR = "<br/>"
INDENT_SYMBOL = "&nbsp" * 8


def format_content(content: str) -> str:
    return "{}{}".format(
        INDENT_SYMBOL,
        content.replace("\n", f"{LINE_SEPARATOR}{INDENT_SYMBOL}"),
    )


class LectionSerializer(serializers.ModelSerializer):
    content_ru = serializers.SerializerMethodField()
    country = serializers.CharField(source="country.name")

    def get_content_ru(self, obj) -> str:
        # Get content from qs annotation with fallback
        content = getattr(obj, "content", obj.content_ru)
        return content

    class Meta:
        model = Lection
        fields = [
            "id",
            "title",
            "content_ru",
            "country",
            "date",
            "city",
        ]


class LectionReadSerializer(LectionSerializer):
    def get_content_ru(self, obj) -> str:
        # Get content from qs annotation and prettify indents
        content = getattr(obj, "content", obj.content_ru)
        return format_content(content)
