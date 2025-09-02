from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests
from .serializers import MovieSerializer
from django.conf import settings
from rest_framework.views import APIView

TMDB_API_KEY = settings.TMDB_API_KEY  # we’ll add this in settings.py next
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movies_list(request):
    category = request.GET.get('category', 'popular')
    page = request.GET.get('page', 1)

    url = f"{TMDB_BASE_URL}/movie/{category}?api_key={TMDB_API_KEY}&page={page}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        serializer = MovieSerializer(data=data['results'], many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    else:
        return Response({"error": "Failed to fetch movies"}, status=response.status_code)
    



class MovieListView(APIView):
    permission_classes = [IsAuthenticated]  # JWT protected

    def get(self, request):
        search = request.query_params.get("search", "")
        page = request.query_params.get("page", 1)

        if search:
            url = f"{TMDB_BASE_URL}/search/movie?api_key={TMDB_API_KEY}&query={search}&page={page}"
        else:
            url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&page={page}"

        response = requests.get(url)
        return Response(response.json())


class MovieDetailView(APIView):
    permission_classes = [IsAuthenticated]  # JWT protected

    def get(self, request, pk):
        url = f"{TMDB_BASE_URL}/movie/{pk}?api_key={TMDB_API_KEY}"
        response = requests.get(url)
        return Response(response.json())

class PopularMoviesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = request.query_params.get("page", 1)
        url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&page={page}"
        response = requests.get(url)
        return Response(response.json())


class TopRatedMoviesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = request.query_params.get("page", 1)
        url = f"{TMDB_BASE_URL}/movie/top_rated?api_key={TMDB_API_KEY}&page={page}"
        response = requests.get(url)
        return Response(response.json())


class UpcomingMoviesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = request.query_params.get("page", 1)
        url = f"{TMDB_BASE_URL}/movie/upcoming?api_key={TMDB_API_KEY}&page={page}"
        response = requests.get(url)
        return Response(response.json())


class NowPlayingMoviesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = request.query_params.get("page", 1)
        url = f"{TMDB_BASE_URL}/movie/now_playing?api_key={TMDB_API_KEY}&page={page}"
        response = requests.get(url)
        return Response(response.json())
