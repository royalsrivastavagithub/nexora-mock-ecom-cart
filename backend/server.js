const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product'); // Import Product model
const User = require('./models/User'); // Import User model
const bcrypt = require('bcryptjs'); // Import bcryptjs

dotenv.config();

const app = express();
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./middleware/session');

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount user authentication routes
app.use('/api/auth', userRoutes);

// Mount product routes
app.use('/api/products', productRoutes);

// Mount cart routes
app.use('/api/cart', cartRoutes);

// Mount order routes
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

// Product data (copied from seeding_products.js)
const products = [
  {
    name: "Classic Spiral Notebook",
    description: "A5 size ruled notebook with 200 pages and durable spiral binding.",
    price: 120,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR7TvTYwCq88m0CmlxQLzp-h-a96D06iF93TlIlpxlD1DanWKxbz4ZfW61uSyQNevZ4f9btJoDR9HEhmbm0DGuNY0gmJ9rRky3lgOVAJZSAk7b8F2A5kmEn",
    stock: 500,
    createdAt: new Date()
  },
  {
    name: "Ballpoint Pen Set",
    description: "Pack of 5 smooth-writing ballpoint pens with blue ink.",
    price: 80,
    currency: "INR",
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQHpuPwsucZyKKq8AClKqvsIRlUZEZRgFuBF53O06LzeEUQMM4eEGXL84qLWMayTA9X1tIifTwRhoXqKv1knOTltpkLIuQrVSHShsYlxTVTNvm01EJgB23lTyc",
    stock: 1000,
    createdAt: new Date()
  },
  {
    name: "Highlighter Pack",
    description: "Set of 4 fluorescent highlighters in yellow, pink, green, and orange.",
    price: 150,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSeZnu0nQz9AaNpyWIxQcf4c22A2X3lctLVgPBDwxplsdfoxqu8QoBYwxqg9X_RU-sqKrtKekkxnuxNLKbBwTqM1lc7vHCVX4vb9A6cqDlDat7gqLPRWhnf",
    stock: 800,
    createdAt: new Date()
  },
  {
    name: "Sticky Notes Pad",
    description: "100-sheet sticky notes pad in assorted pastel colors, 3x3 inches.",
    price: 60,
    currency: "INR",
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSVzTI1ddfBsMUFAbamUP1Z0-LayWcSZGOPDMR6cypMVm-1TZdnXiqpnuHEQLd5qWBXnbfGNu5JKw8stsNMEoT1IhXKz2jCBq2G8WCsOQtKrDiiiZcZnnb5",
    stock: 1200,
    createdAt: new Date()
  },
  {
    name: "Metallic Ruler 30cm",
    description: "Durable stainless steel ruler with etched markings.",
    price: 90,
    currency: "INR",
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTd_pnFLofVy8Ls9eUbbV0ToKNWWXv-YVYavqQiCxnuhrPbXqgSFFIvh952WAIGI5pWBcuEtoOyWxyAnlDzbuZkSs_6v376a6W81bo8nGaQ2aPsh4g_cLGm",
    stock: 700,
    createdAt: new Date()
  },
  {
    name: "Desk Organizer Tray",
    description: "Multi-compartment plastic organizer for pens, clips, and notes.",
    price: 250,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQHi_Dr6MVF6onR_RTLnm6eVVmT9ORqcpG1BdJFUbXsyzhxfHPZEpDwAp3LC3u1hrTvsTbJdvpZbtIqDJtkgdv0h48BoHMygFDEjZUHYK1rCXTVMECAeVpVlg",
    stock: 300,
    createdAt: new Date()
  },
  {
    name: "Eraser Pack",
    description: "Set of 3 dust-free erasers for smooth and clean erasing.",
    price: 45,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTQ003socF_rdyoSZefv22A8aPu_5-YW1oDD5W-8ckAtzOBljVRX1ch_mh0wOuwDOaMLtvA19-C5625rY00nNSQyZ_cZo3RwkkfBujgAVF_AEyKlJsgjid9",
    stock: 1500,
    createdAt: new Date()
  },
  {
    name: "Geometry Box",
    description: "Complete geometry set including compass, divider, protractor, and rulers.",
    price: 180,
    currency: "INR",
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSWIvi60VBuxWvGMsoaRQHsQ9yc4F9nRs9iVzmCqzDKzDIXsTQ77DtFhJ1TK1TixjskpikhQnYK-ItEu-r3dxnmnnK_PFnPl4pXfFTb4W7s5wPgZyplslOimw8",
    stock: 400,
    createdAt: new Date()
  },
  {
    name: "Permanent Marker",
    description: "Black permanent marker with quick-drying ink and fine tip.",
    price: 50,
    currency: "INR",
    imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQesx0wCJnBrStSDC0NAbw-n9oSY9l7Ca7VFCdtVTBH8picocPmgH2m-OCDhW03w7jxO4Xfh7kekXUZkyIIMtJcOskr1Z9WoXaXzSH4oYZ27fjqw9jYDC62pg",
    stock: 900,
    createdAt: new Date()
  },
  {
    name: "Paper Clip Box",
    description: "Box of 100 nickel-coated paper clips for office and school use.",
    price: 70,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTCXxqlhHh9QEdmjNiYZU6_T49BvDOhhYijvbejZ31k_NsojyMZNWlnM_b_FWp6YXVcmiMyG8co1mz9J6zBlRRVrOpr8rWbPmvKP6n2xRcQTF-vLd3fnJNMkP0",
    stock: 1100,
    createdAt: new Date()
  },
  {
    name: "Correction Pen",
    description: "Fast-drying correction pen for quick corrections and edits.",
    price: 120,
    currency: "INR",
    imageUrl: "https://helloaugust.in/wp-content/uploads/2020/04/correction-pen.jpg",
    stock: 500,
    createdAt: new Date()
  },
  {
    name: "Mechanical Pencil",
    description: "High-quality mechanical pencil with 2 mm lead and ergonomic design.",
    price: 80,
    currency: "INR",
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7QOrIQvU9ITbO6Ctg78q47sMrQLJgj6_gOzeZcUgQeomQMewcb06jSYpD4RSzs8sQXwKq8DcgwUAdEgRu8-aiDPCjtPi6CHzJjqvw6uRcgumkIEranu52K_M",
    stock: 1000,
    createdAt: new Date()
  },
];

const seedProductsIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found in DB. Seeding initial products...');
      await Product.insertMany(products);
      console.log('Products seeded successfully!');
    } else {
      console.log(`Database already contains ${productCount} products. Skipping seeding.`);
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const createTestUserIfNotExist = async () => {
  try {
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found. Creating test user...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123!@#', salt); // A strong password for testing

      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash,
        address: '123 Test Street, Testville',
      });
      await user.save();
      console.log('Test user created successfully!');
    } else {
      console.log('Test user already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Connect to database and then seed products and create test user
connectDB().then(() => {
  seedProductsIfEmpty();
  createTestUserIfNotExist();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});