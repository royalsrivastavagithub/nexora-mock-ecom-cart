
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
