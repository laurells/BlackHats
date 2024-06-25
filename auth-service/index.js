const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const helloRoute = require('./routes/helloRoute');
const platformRoute = require('./routes/autoAccountRoutes');
const verifyToken = require('./middleware/authenticate');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);


//Routes with tokens
app.use('/api/hello', verifyToken, helloRoute);
app.use('/api/platform', verifyToken, platformRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});
