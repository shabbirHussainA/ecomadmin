import mongoose from "mongoose";
import {model, models, Schema} from "mongoose";

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ],
}, {
  timestamps: true,
});

export const Cart = models?.Cart || model('Cart', CartSchema);

// pages/api/cart.js

// import { getSession } from "next-auth/react";
// import dbConnect from "../../../lib/dbConnect"; // Ensure you have a dbConnect function to connect to your database
// import Cart from "@/models/Cart"; // Adjust the import path as necessary

// export default async function handler(req, res) {
//   const session = await getSession({req});

//   if (!session) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = session.user.id; // Assuming the user ID is stored in session.user.id

//   await dbConnect();

//   try {
//     const cart = await Cart.find({ user: userId }).populate('products.productId');

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
