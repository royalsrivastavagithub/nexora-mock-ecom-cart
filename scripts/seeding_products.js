// script.js
const mongoose = require("mongoose");
// ✅ Your MongoDB connection URI
const MONGO_URI = "mongodb://localhost:27017/nexora_ecom";

// ✅ Define the Product schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  imageUrl: String,
  stock: { type: Number, default: 9999 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);

// ✅ Product data
const products = [
  {
    name: "Classic Spiral Notebook",
    description: "A5 size ruled notebook with 200 pages and durable spiral binding.",
    price: 120,
    currency: "INR",
    imageUrl: "",
    stock: 500,
    createdAt: new Date()
  },
  {
    name: "Ballpoint Pen Set",
    description: "Pack of 5 smooth-writing ballpoint pens with blue ink.",
    price: 80,
    currency: "INR",
    imageUrl: "",
    stock: 1000,
    createdAt: new Date()
  },
  {
    name: "Highlighter Pack",
    description: "Set of 4 fluorescent highlighters in yellow, pink, green, and orange.",
    price: 150,
    currency: "INR",
    imageUrl: "",
    stock: 800,
    createdAt: new Date()
  },
  {
    name: "Sticky Notes Pad",
    description: "100-sheet sticky notes pad in assorted pastel colors, 3x3 inches.",
    price: 60,
    currency: "INR",
    imageUrl: "",
    stock: 1200,
    createdAt: new Date()
  },
  {
    name: "Metallic Ruler 30cm",
    description: "Durable stainless steel ruler with etched markings.",
    price: 90,
    currency: "INR",
    imageUrl: "",
    stock: 700,
    createdAt: new Date()
  },
  {
    name: "Desk Organizer Tray",
    description: "Multi-compartment plastic organizer for pens, clips, and notes.",
    price: 250,
    currency: "INR",
    imageUrl: "",
    stock: 300,
    createdAt: new Date()
  },
  {
    name: "Eraser Pack",
    description: "Set of 3 dust-free erasers for smooth and clean erasing.",
    price: 45,
    currency: "INR",
    imageUrl: "",
    stock: 1500,
    createdAt: new Date()
  },
  {
    name: "Geometry Box",
    description: "Complete geometry set including compass, divider, protractor, and rulers.",
    price: 180,
    currency: "INR",
    imageUrl: "",
    stock: 400,
    createdAt: new Date()
  },
  {
    name: "Permanent Marker",
    description: "Black permanent marker with quick-drying ink and fine tip.",
    price: 50,
    currency: "INR",
    imageUrl: "",
    stock: 900,
    createdAt: new Date()
  },
  {
    name: "Paper Clip Box",
    description: "Box of 100 nickel-coated paper clips for office and school use.",
    price: 70,
    currency: "INR",
    imageUrl: "",
    stock: 1100,
    createdAt: new Date()
  }
];

// ✅ Main function
async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    await Product.insertMany(products);
    console.log("🌱 Products inserted successfully");

  } catch (error) {
    console.error("❌ Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedProducts();
