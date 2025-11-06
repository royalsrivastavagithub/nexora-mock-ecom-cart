
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount user authentication routes
app.use('/api/auth', userRoutes);

// Mount product routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
