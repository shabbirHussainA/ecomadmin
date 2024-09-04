import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { Review } from "@/models/Review";

export async function GET() {
    try {
      await dbConnect();
  
      // Fetch reviews that are not approved
      const reviews = await Review.find({ approved: false });
  
      if (!reviews || reviews.length === 0) {
        return NextResponse.json({ message: 'No unapproved reviews found' }, { status: 404 });
      }
  
      return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
  }
  