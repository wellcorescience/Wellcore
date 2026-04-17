import mongoose from "mongoose";
import "./Deal";

const ShopVideoSchema = new mongoose.Schema({
  title: String,
  productName: String,
  price: String,
  videoThumbnail: String,
  videoUrl: String
}, { _id: false });

const StorefrontSchema = new mongoose.Schema(
  {
    // High-level settings for the UI. Usually we just have one active document.
    isGlobalActive: { type: Boolean, default: true },
    
    // Header & Announcement Bar
    topBarText: { type: String, default: "Free Protocol Deployment Over ₹999" },
    
    // Hero Section
    heroHeadline: { type: String, default: "BOOST ENERGY & PERFORMANCE" },
    heroSubtitle: { type: String, default: "Clinically dosed, science-backed formulas designed for elite athletes and high-performers who demand more from their bodies." },
    heroButtonText: { type: String, default: "Shop Now" },
    heroButtonLink: { type: String, default: "/category/all" },
    heroBackgroundImage: { type: String, default: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrar8tDsY9pqoXizDU6SAkc-6Jbck-lSMH2Q1WjHP9SuIp4Sb7GA7hNCUlJAN7PgzXF-Z_1DLmEqW8IiiBYx7WQSkuA6TTEfcxabuljZjexVRUkltjwqtB6IZAJ0GN5fInjg_JItpEj3Ey_7XwVwJ8YyB1Q-YAe9CVR9jgH-IZUMl6PUBZ8iqlvADXLBo2J-OJQWmrJuw8hjtgrNENsNJBw9iRNvv3DMZuHUbkXft8CtzN0tX3-o33ecQIGGur_N61Mn_BMxMx2s0" },
    
    // Deals Engine Integration
    activeDeal: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null },

    // Video Reels Section
    shopVideos: [ShopVideoSchema],

    // Testimonials
    trustedReviews: [{
      name: { type: String },
      role: { type: String },
      text: { type: String },
      image: { type: String }
    }],

    // Footer & Contact Information
    hotlinePhone: { type: String, default: "+91 7015553297" },
    whatsappNumber: { type: String, default: "+91 7015553297" },
    supportEmail: { type: String, default: "info.wellcorescience@gmail.com" },
    physicalAddress: { type: String, default: "Add: MangalColony, Part 2, Karnal, HR - 132001." },
    footerAboutText: { type: String, default: "100% Genuine Supplements. Zero Compromise.\nAuthentic Nutrition You Can Trust Only Original.\nAlways Effective.\nCertified Supplements. Real Results." },
    
    // Social Links
    facebookUrl: { type: String, default: "https://www.facebook.com/wellcorescience" },
    instagramUrl: { type: String, default: "https://www.instagram.com/wellcore.science/" },

    // Legal Policies (Raw HTML)
    privacyPolicyHtml: { type: String, default: "<p>We respect your privacy.</p>" },
    termsOfServiceHtml: { type: String, default: "<p>Terms and Conditions apply.</p>" },
    refundPolicyHtml: { type: String, default: "<p>7-day refund policy for sealed items.</p>" },
    shippingPolicyHtml: { type: String, default: "<p>Standard shipping takes 3-7 business days.</p>" }
  },
  { timestamps: true }
);

// Force delete the model in development to pick up schema changes
if (process.env.NODE_ENV === "development") {
  delete (mongoose as any).models.Storefront;
}

const Storefront = mongoose.models.Storefront || mongoose.model("Storefront", StorefrontSchema);

export default Storefront;
