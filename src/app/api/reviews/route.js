// app/api/reviews/route.js
import { NextResponse } from 'next/server';
import { Review } from "@/models/Review";
import dbConnect from "../../../lib/dbConnect";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const reviews = await Review.find({ productId, approved: true });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}


