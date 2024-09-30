import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc'; 
import Link from 'next/link';

interface Movie {
  id: number;
  name: string;
  releaseDate: string;
  averageRating: number;
  reviews: Review[];
}

interface Review {
  id: number;
  movieId: number;
  reviewerName: string;
  rating: number;
  comments: string;
}

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data: movie, isLoading, isError } = trpc.getMovie.useQuery(Number(id), {
    enabled: !!id, 
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">MOVIECRITIC</h1>
          <div>
            <Link href="/" passHref>
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Home</a>
            </Link>
            <Link href="/add-review" passHref>
              <a className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Add new review</a>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{movie.name}</h2>
            <p className="text-lg text-gray-700 mb-2">
              Released: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Average Rating: {movie.averageRating ? movie.averageRating.toFixed(2) : 'N/A'}/10
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reviews:</h3>

            {movie.reviews.length > 0 ? (
              movie.reviews.map((review: Review) => (
                <div key={review.id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-lg font-medium text-gray-900">
                      {review.reviewerName || 'Anonymous'} - {review.rating}/10
                    </h4>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{review.comments}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
