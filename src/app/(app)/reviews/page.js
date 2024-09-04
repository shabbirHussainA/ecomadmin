'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";

const fetcher = url => axios.get(url).then(res => res.data);

export default function AdminReviewsPage() {
    const [initialReviews, setInitialReviews] = useState()
    useEffect(() => {
     setInitialReviews(axios.get('/api/unapproved-reviews'))
    }, [])
    
  const { data: reviews, error, mutate } = useSWR('/api/unapproved-reviews', fetcher, { initialData: initialReviews });

  async function approveReview(reviewId) {
    try {
      await axios.post('/api/review-approve', { reviewId });
      mutate(); // Revalidate the data
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  }

  if (error) return <div>Failed to load reviews</div>;
  if (!reviews) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pending Reviews</h1>
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <strong>{review.stars}</strong>: {review.description}
            <button onClick={() => approveReview(review._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
