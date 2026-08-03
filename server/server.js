const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const actionRoutes = require('./routes/actionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

connectDB();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/actions', actionRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value entered' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
