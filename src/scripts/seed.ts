import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from '../lib/db';
import Product from '../models/Product';
import User from '../models/User';
import { Category, Brand } from '../models/CategoryBrand';

const products = [
  {
    title: "Iso-Prime Serum",
    description: "The gold standard in recovery. Pure whey isolate with zero fillers. Clinically proven for 40% faster absorption.",
    price: 3299,
    originalPrice: 4200,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXNvxGNsLfJs_fPckZ5SXZvsue5zo0tqU-vDYNo3MwyinXJKyisftNF4ZOQpTGb6UCKzPbXMC5KZuJGpz4A8Z5jHTMsN-SJrDo2hKK25idRcvhMnfEFcRj8LtF4e9bkO6fh4__JQFbRSZx8olUMZijfHqFXivputjY191cl8CvXamEuu5VTjLfkp3z73mNY5gJupSZ8H9DbZkWT-GpMdzLi5CurCrFNGwIgA818EC-SigPmDkqbxes7FzbfF7Q9ST0dSVVs6Mv_24", public_id: "iso-prime" }],
    categoryName: "Whey Protein",
    brandName: "Wellcore Labs",
    tags: ["protein", "isolate", "recovery"],
    stock: 50,
    isFeatured: true,
    isOnSale: true,
    salePercent: 21,
    sizes: ["1kg", "2kg"],
    flavors: ["Swiss Chocolate", "Vanilla Bean"]
  },
  {
    title: "Neuro-Focus Pre-Ignition",
    description: "Unlock mental dominance and explosive energy without the crash. Features Alpha-GPC and Nuere-IG Matrix.",
    price: 1899,
    originalPrice: 2499,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrd-K9gE7oHjb3HYr-3ikLIAc8l6-Hw5ixrxs9ipRBNVAl6c0GF5mh-O1-6kTvWxEi4x7EIWYeheMqFh_MhRN7fsUjshZFtcbeL8NKzLzOB1FoAhYGgtHhNkGZncHDrOT8kFgavDApqo55gAfGvlLjqrDCBZ3CYX98WuF7Fzlqzp44e81TU-4rAr1y123hTmFmk3WlM7kQqcTeT_G8s_c_NvVnXT5-G-UZGrAQs0eRg9BdNMKw5v1OepKNqsV8DKzD3crnnYOwvhQ", public_id: "neuro-focus" }],
    categoryName: "Pre Workout",
    brandName: "Kinetic Science",
    tags: ["energy", "focus", "pre-workout"],
    stock: 30,
    isFeatured: true,
    isOnSale: true,
    salePercent: 24,
    sizes: ["30 Servings", "60 Servings"],
    flavors: ["Blue Razz", "Fruit Punch"]
  },
  {
    title: "Vitality Core Multi",
    description: "Micro-nutrient optimization for daily health and performance. 24 essential vitamins and minerals.",
    price: 1299,
    originalPrice: 1599,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoJrQXkPBtQag7Ro5-kmzQLdJFzBVN-ZELFpJWKtC0OR51k7kZE0nFHUYyHGPevJj4zY98cgnMpfY8Wpg3nf3fnWcBcLVE_WtWbDqR0flwxGy72tAtH314h43ZeMaTZWyNaSq4NeoHGQYOFp0p2hJ1kG7RapGOuVwWeKvA-jEe6JKnO5lg3mGfzkn0sprZscCea3-EKmcmj2GK9YY3gSSgPVtBDCjNjw6ZZ_fSV6hH8A75-Lf8qNe09acxIw9jg2zcsD8EwvKQ3MQ", public_id: "vitality-core" }],
    categoryName: "Health & Wellness",
    brandName: "Wellcore Labs",
    tags: ["vitamins", "daily", "wellness"],
    stock: 100,
    isFeatured: true,
    isOnSale: true,
    salePercent: 18,
    sizes: ["60 Caps", "120 Caps"],
    flavors: ["Unflavored"]
  },
  {
    title: "Whey Isolate Elite Pro",
    description: "Highest purity whey protein isolate for rapid muscle synthesis. Ultra-filtered for maximum refinement.",
    price: 4599,
    originalPrice: 5999,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQV8_VPmrgoKIS_1GodM7SgUsTTdGy-YSs4PUCFIuk3P-GKbw3Ffuzmg0_VQB4_KbS3_4QZAwGayccvGIWdqrk0XaMjuqxttBh3Dar1BMC5EahV2qzePn07qDVuSl8vvKFQJRnQxSBxlAWRDK_sJz2xfB-9Sli_SoX46VR_eaulZPuDdzTa6bGWjOwOAPg93By3ugDWSExBVkQ4okflUEmCVUq5PQLqquNP32ptIkT9TtEVmSmIpAaCtJXiqn0zyH9MrKskTegV9Q", public_id: "whey-elite" }],
    categoryName: "Whey Protein",
    brandName: "Black Yak",
    tags: ["protein", "muscle", "elite"],
    stock: 45,
    isFeatured: false,
    isOnSale: true,
    salePercent: 23,
    sizes: ["2kg", "4.4lb"],
    flavors: ["Rich Chocolate", "Cookies & Cream"]
  },
  {
    title: "Kinetic Pre 2.0 Max",
    description: "The evolution of pre-workout. Maximum pump and endurance using clinical Vasodilation protocols.",
    price: 2499,
    originalPrice: 2999,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3VOZiVJ7c6ba58WObH7JpRxUQQf9hNEPYprPxMUfyJyX4L5i97sxRKLSh8cRn_G1uv6ki0mxwKRnEyU2aYU1n9fFigdWk4pY_TxGTcrT1qiJ1iT_YENMAU5jE0uPnGkJc_gNKykCKvXfZMJefO8OEKJTfnKzLFlQpNQQZkoTnzbCqG-QuJFSQDrYDLc80-OOy1wRyO-pqZRnMlF9X8-w9MZistd81MAizkprPkYAtlBK3UQUd3YUvgl_CeTGy9m9UvndYmvhapWA", public_id: "kinetic-pre" }],
    categoryName: "Pre Workout",
    brandName: "Kinetic Science",
    tags: ["energy", "pump", "endurance"],
    stock: 60,
    isFeatured: false,
    isOnSale: true,
    salePercent: 16,
    sizes: ["30 Servings"],
    flavors: ["Lava Lemonade", "Arctic Blast"]
  },
  {
    title: "Hyper-Mass Matrix Extreme",
    description: "Scientifically engineered mass gainer for hard-gainers. 1200 calories per serving.",
    price: 3899,
    originalPrice: 4500,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlvafmxFhbxjCiKEPrZHuxicI9SagpH1XxpjsiD6M1vgGzB_8r2Xf6pRLZVqQdnqDGeU4DhkGFbCUDp7Cb9YYJps3Dsr_BSezYNWIU42-wwqfW5fggkxdHS8WfeSjoTld3m4YFwpPvqyuYH6a6Giot8AMV1qt5LZXfyho0P76e6gzcWBgB6RSoWz86EQurLay_5eY1gfy2bcruLON40wKcBG_tCSjuflLRN70vhsw6N2n2K-3Qzc86ypAw1ZtBSy4aSCZMfxckvcM", public_id: "hyper-mass" }],
    categoryName: "Mass Gainer",
    brandName: "Titan Pro",
    tags: ["mass", "weight-gain", "matrix"],
    stock: 25,
    isFeatured: true,
    isOnSale: false,
    sizes: ["3kg", "5kg"],
    flavors: ["Chocolate Gain", "Banana Cream"]
  },
  {
    title: "Recovery BCAA+ Fusion",
    description: "Precision amino acid ration for ultimate recovery and intra-workout endurance.",
    price: 1499,
    originalPrice: 1999,
    images: [{ url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA7I0EBR931q8Z_6e7nhBCtXAhSA_LSTyxjY6CKubVwWJRvKKymMbZUkoZKnPj5h29dwWsbcWJrlhGepqL_2PNue47yhSN6ddVZDohst283FgSA8CBknP72zaPWP7v4dxohWw0mbLX6zM00bUJo3YLCp0qF3AdSEWAh-U6dYZGf1sXHPPrdtrkpTv1mOLfwkVz6NH-15A6vM-9glHbIyE-V9clhzMB5j6gX6-qHcDUzTen1YGhKg_Y8-BP0wJ-kRQwBGg5KV2blgE", public_id: "recovery-bcaa" }],
    categoryName: "Pre Workout",
    brandName: "Muscle Weapon",
    tags: ["bcaa", "amino", "recovery"],
    stock: 40,
    isFeatured: false,
    isOnSale: true,
    salePercent: 25,
    sizes: ["30 Servings"],
    flavors: ["Watermelon", "Green Apple"]
  }
];

const categories = ["Whey Protein", "Pre Workout", "Mass Gainer", "Fat Burner", "Health & Wellness"];
const brands = [
  { name: "Wellcore Labs", logo: "" },
  { name: "Kinetic Science", logo: "" },
  { name: "Black Yak", logo: "" },
  { name: "Titan Pro", logo: "" },
  { name: "Muscle Weapon", logo: "" },
  { name: "Elite Labs", logo: "" }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await dbConnect();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await User.deleteMany({});

    // Create Admin User
    console.log('Creating Admin User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Wellcore Admin',
      email: 'admin@wellcore.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Seed Categories
    console.log('Seeding categories...');
    const createdCategories = await Promise.all(
      categories.map(name => 
        Category.create({ 
          name, 
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        })
      )
    );

    // Seed Brands
    console.log('Seeding brands...');
    const createdBrands = await Promise.all(
      brands.map(b => 
        Brand.create({ 
          ...b, 
          slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        })
      )
    );

    // Map names to IDs
    const categoryMap = createdCategories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat._id }), {});
    const brandMap = createdBrands.reduce((acc, brand) => ({ ...acc, [brand.name]: brand._id }), {});

    // Seed Products
    console.log('Seeding products...');
    await Promise.all(
      products.map(p => {
        const { categoryName, brandName, ...productData } = p;
        const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return Product.create({
          ...productData,
          slug,
          category: categoryMap[categoryName],
          brand: brandMap[brandName],
          ratings: { average: 4.5 + Math.random() * 0.5, count: 10 + Math.floor(Math.random() * 90) }
        });
      })
    );

    console.log('Seeding completed successfully!');
    console.log('--- DEFAULT CREDENTIALS ---');
    console.log('Admin Email: admin@wellcore.com');
    console.log('Admin Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
