'use client'

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddMovie() {
  const [name, setName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const router = useRouter();
  const mutation = trpc.createMovie.useMutation({
    onSuccess: () => router.push('/'),
    onError: (error) => {
      console.error('Error creating movie:', error);
      alert('Error creating movie: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedReleaseDate = new Date(releaseDate);

    if (isNaN(parsedReleaseDate.getTime())) {
      alert("Please enter a valid date.");
      return;
    }

    const formattedReleaseDate = parsedReleaseDate.toISOString().split('T')[0];

  const payload = { name, releaseDate: formattedReleaseDate }; // pass the release date as a string
  console.log("Payload:", payload);

  mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-200 shadow ">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Add new movie</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
                  Release date
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create movie
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
