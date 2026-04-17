import mongoose from "mongoose";

const DealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["Flash Sale", "Discount", "Featured"], 
      default: "Flash Sale" 
    },
    discountPercent: { type: Number, default: 0 },
    activeProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    bannerImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Deal = mongoose.models.Deal || mongoose.model("Deal", DealSchema);

export default Deal;
