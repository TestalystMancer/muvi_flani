from django.urls import path
from .views import (
    MovieListView,
    MovieDetailView,
    PopularMoviesView,
    TopRatedMoviesView,
    UpcomingMoviesView,
    NowPlayingMoviesView
)

urlpatterns = [
    path('movies/', MovieListView.as_view(), name='movies_list'),                # GET all movies + search + pagination
    path('movies/<int:pk>/', MovieDetailView.as_view(), name='movie_detail'),     # GET single movie details
    path('movies/popular/', PopularMoviesView.as_view(), name='movies_popular'),  # GET popular movies
    path('movies/top_rated/', TopRatedMoviesView.as_view(), name='movies_top_rated'),  # GET top rated movies
    path('movies/upcoming/', UpcomingMoviesView.as_view(), name='movies_upcoming'),    # GET upcoming movies
    path('movies/now_playing/', NowPlayingMoviesView.as_view(), name='movies_now_playing'),  # GET now playing movies
]

