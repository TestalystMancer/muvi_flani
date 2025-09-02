from rest_framework import serializers

class MovieSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    overview = serializers.CharField()
    poster_path = serializers.CharField(allow_null=True)
    release_date = serializers.CharField(allow_null=True)
    vote_average = serializers.FloatField()
