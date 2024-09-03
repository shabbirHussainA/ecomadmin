import mongoose from "mongoose";
import {model, models, Schema} from "mongoose";

const WishlistSchema = new Schema({
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

export const Wishlist = models?.Wishlist || model('Wishlist', WishlistSchema);