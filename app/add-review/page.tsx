'use client'

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddReview() {
  const [movieId, setMovieId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const router = useRouter();
  const { data: movies } = trpc.getMovies.useQuery();
  const mutation = trpc.createReview.useMutation({
    onSuccess: () => router.push('/'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      movieId: Number(movieId),
      reviewerName: reviewerName || undefined,
      rating: Number(rating),
      comments,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-200 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Add new review</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="movieId" className="block text-sm font-medium text-gray-700">
                  Select a movie
                </label>
                <select
                  id="movieId"
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select a movie</option>
                  {movies?.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  id="reviewerName"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating (0-10)
                </label>
                <input
                  type="number"
                  id="rating"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  Review comments
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={4}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Add review
              </button>
            </form>
            <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}