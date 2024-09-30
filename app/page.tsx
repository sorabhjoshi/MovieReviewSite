'use client';

import { useState } from 'react';
import { trpc } from '../utils/trpc';
import Link from 'next/link';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function Home() {
  const [search, setSearch] = useState('');
  const { data: movies, refetch } = trpc.getMovies.useQuery();
  const deleteMovieMutation = trpc.deleteMovie.useMutation({
    onSuccess: () => refetch(),
  });

  const filteredMovies = movies?.filter(movie =>
    movie.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteMovie = async (movieId: number) => {
    if (confirm('Are you sure you want to delete this movie and all its reviews?')) {
      await deleteMovieMutation.mutateAsync(movieId);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="header">
        <div className="flex justify-between items-center">
          <h1 className="header-title">MOVIECRITIC</h1>
          <div className="header-buttons">
            <Link href="/add-movie" className="button">
              Add new movie
            </Link>
            <Link href="/add-review" className="button button-secondary">
              Add new review
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h2 className="main-title">The best movie reviews site!</h2>
        <input
          type="text"
          placeholder="Search for your favorite movie"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies?.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h3 className="movie-card-title">{movie.name}</h3>
              <p className="movie-card-release">
                Released: {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p className="movie-card-rating">
                Rating: {movie.averageRating ? movie.averageRating.toFixed(2) : 'N/A'}/10
              </p>
              <div className="movie-card-buttons">
                <Link href={`/movie/${movie.id}/reviews`} className="edit-button">
                  <FaEdit />
                </Link>
                <button className="delete-button" onClick={() => handleDeleteMovie(movie.id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}