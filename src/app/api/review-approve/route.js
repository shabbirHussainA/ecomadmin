//to approve the reviews its working
import dbConnect from "../../../lib/dbConnect"; 
import { Review } from "@/models/Review";

export async function POST(req) {

    await dbConnect();
    const { reviewId } = await req.json();

    try {
      const review = await Review.findById(reviewId);
      if (review) {
        review.approved = true;
        await review.save();
       return Response.json({ message: 'Review approved successfully' },{status:200});
      } else {
       return Response.json({ error: 'Review not found' },{status:404});
      }
    } catch (error) {
       return Response.json({ error: 'Failed to approve review' },{status:500});
    }
 
}
