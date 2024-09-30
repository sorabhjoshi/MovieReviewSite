'use client'

import { useState } from 'react'
import { trpc } from '../../../../utils/trpc'
import Link from 'next/link'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'

export default function MovieReviews({ params }: { params: { id: string } }) {
  const movieId = parseInt(params.id)
  type Review = {
    id: number;
    reviewerName: string | null; // Change to string | null
    rating: number;
    comments: string;
    movie: { name: string; }; // Assuming the movie object contains a name property
  };
  const { data: reviews, refetch } = trpc.getMovieReviews.useQuery(movieId)
  const updateReviewMutation = trpc.updateReview.useMutation()
  const deleteReviewMutation = trpc.deleteReview.useMutation()

  const [editingReview, setEditingReview] = useState<number | null>(null)
  const [editedReview, setEditedReview] = useState({
    reviewerName: '',
    rating: 0,
    comments: '',
  })

  const handleEdit = (review: Review) => {
    setEditingReview(review.id)
    setEditedReview({
      reviewerName: review.reviewerName || '',
      rating: review.rating,
      comments: review.comments,
    })
  }

  const handleUpdate = async (id: number) => {
    await updateReviewMutation.mutateAsync({
      id,
      ...editedReview,
    })
    setEditingReview(null)
    refetch()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await deleteReviewMutation.mutateAsync(id)
      refetch()
    }
  }

  if (!reviews || reviews.length === 0) return <div>Loading...</div>

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">MOVIECRITIC</h1>
        </div>
        <div>
          <Link href="/add-movie" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Add new movie
          </Link>
          <Link href="/add-review" className="bg-purple-500 text-white px-4 py-2 rounded">
            Add new review
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-100 p-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reviews for {reviews[0]?.movie.name}</h2>
            <Link href="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
          <div className="text-2xl font-semibold text-purple-600">{averageRating.toFixed(2)}/10</div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-purple-100 p-4 rounded-lg">
              {editingReview === review.id ? (
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(review.id); }} className="space-y-4">
                  <input
                    type="text"
                    value={editedReview.reviewerName}
                    onChange={(e) => setEditedReview({ ...editedReview, reviewerName: e.target.value })}
                    placeholder="Reviewer Name"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editedReview.rating}
                    onChange={(e) => setEditedReview({ ...editedReview, rating: parseFloat(e.target.value) })}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={editedReview.comments}
                    onChange={(e) => setEditedReview({ ...editedReview, comments: e.target.value })}
                    placeholder="Comments"
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                  <div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                    <button onClick={() => setEditingReview(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{review.reviewerName || 'Anonymous'}</h3>
                  <p className="text-yellow-500 font-bold mb-2">Rating: {review.rating}/10</p>
                  <p className="text-gray-600 mb-4">{review.comments}</p>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(review)} className="text-blue-500 hover:text-blue-700">
                      <FaEdit size={20} />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-700">
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}