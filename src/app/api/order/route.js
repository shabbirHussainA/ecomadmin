import { NextResponse } from 'next/server';
import dbconnect from '../../../lib/dbConnect';
import { Order } from '../../../models/Order';

export async function GET() {
  try {
    await dbconnect();
    //arranging the order in ascending order date
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    }, { status: 500 });
  }
}
