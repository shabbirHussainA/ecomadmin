import dbConnect from '../../../lib/dbConnect';
import { Category } from '../../../models/Category';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
    await dbConnect();
    try {
        const category = await Category.find().populate('parent');
        return Response.json({
            success:true,
            message: "category saved successfully",
            category
        },{status:200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        },{status:500});
    }
}

export async function POST(req, res) {
    await dbConnect();

    try {
        const { name, parentCategory, properties } = await req.json()
        console.log(properties);
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory || undefined,
            properties,
        });
        await categoryDoc.save()
        return Response.json({
            success:true,
            message: "category added successfully",
            categoryDoc
        },{status:200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error adding categories",
            error: error.message
        },{status:500});
    }
}

export async function PUT(req, res) {
    await dbConnect();
    try {
        const { name, parentCategory, properties, _id } = await req.json();
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory || undefined,
            properties,
        });
        return Response.json({
            success:true,
            message: "category updated successfully",
            categoryDoc
        },{status:200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error updating categories",
            error: error.message
        },{status:500});
    }
}

export async function DELETE(req, res) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await Category.deleteOne({ _id: id });
        return Response.json({
            success:true,
            message: "category delete successfully",
        },{status:200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error deleting categories",
            error: error.message
        },{status:500});
    }
}
