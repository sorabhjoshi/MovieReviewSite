'use client'

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

export default function SearchReviews() {
  const [search, setSearch] = useState('');
  const { data: reviews } = trpc.searchReviews.useQuery(search);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Reviews</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            {reviews?.map((review) => (
              <div key={review.id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {review.movie.name} - {review.rating}/10
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    By {review.reviewerName || 'Anonymous'}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{review.comments}</p>
                </div>
              </div>
            ))}
            <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}