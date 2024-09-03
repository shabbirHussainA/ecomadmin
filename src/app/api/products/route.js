import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import dbconnect from '../../../lib/dbConnect';
// import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';

export async function GET(req) {
  try {
    await dbconnect();
    // await isAdminRequest(req, res);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await Product.findOne({ _id: id });
      return NextResponse.json(product, { status: 200 });
    } else {
      const products = await Product.find();
      return NextResponse.json(products, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await mongooseConnect();
    // await isAdminRequest(req, res);

    const { title, description, price, images, category, properties } = await req.json();
    const productDoc = await Product.create({
      title, description, price, images, category, properties,
    });

    return NextResponse.json(productDoc, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create product",
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await mongooseConnect();
    // await isAdminRequest(req, res);

    const { title, description, price, images, category, properties, _id } = await req.json();
    await Product.updateOne({ _id }, { title, description, price, images, category, properties });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update product",
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await mongooseConnect();
    // await isAdminRequest(req, res);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      await Product.deleteOne({ _id: id });
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product ID is required for deletion"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    }, { status: 500 });
  }
}
