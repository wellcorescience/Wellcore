import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ url: String, public_id: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: String, default: "" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    tags: [String],
    stock: { type: Number, default: 0 },
    flavors: [String],
    sizes: [String],
    benefits: [String],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    salePercent: { type: Number, default: 0 },
    highlights: [String],
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", tags: "text", description: "text" });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
