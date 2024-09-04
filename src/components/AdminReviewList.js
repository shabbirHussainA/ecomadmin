// app/components/AdminReviewList.js

'use client';

import { useState } from "react";
import axios from "axios";
import useSWR from "swr";

const fetcher = url => axios.get(url).then(res => res.data);

export default function AdminReviewList({ initialReviews }) {
  const { data: reviews, error, mutate } = useSWR('/api/reviews?approved=false', fetcher, { fallbackData: initialReviews });

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
    <ul>
      {reviews.map(review => (
        <li key={review._id}>
          <strong>{review.stars}</strong>: {review.description}
          <button onClick={() => approveReview(review._id)}>Approve</button>
        </li>
      ))}
    </ul>
  );
}
