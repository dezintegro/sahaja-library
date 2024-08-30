from rest_framework import serializers


class YearMetaSerializer(serializers.Serializer):
    year = serializers.CharField(read_only=True, source="date__year")
    count = serializers.IntegerField(read_only=True)
