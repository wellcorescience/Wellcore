import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, unique: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paidAt: Date,
    deliveredAt: Date,
    trackingId: String,
    courier: String,
    shiprocketOrderId: String,
    shiprocketShipmentId: String,
  },
  { timestamps: true }
);

// Auto-generate orderId before save
OrderSchema.pre("save", async function () {
  if (!this.orderId) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderId = `WC-${String(count + 1001).padStart(6, "0")}`;
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
