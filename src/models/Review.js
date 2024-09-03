import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  stars: { type: Number, required: true },
  description: { type: String, required: true },
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  approved: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Review = models.Review || model('Review', ReviewSchema);
