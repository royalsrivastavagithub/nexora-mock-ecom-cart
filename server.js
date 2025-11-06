
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount user authentication routes
app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
