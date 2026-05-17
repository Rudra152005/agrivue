const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Mount routers
const auth = require('./routes/auth');
const farmers = require('./routes/farmers');
const lands = require('./routes/lands');
const schemes = require('./routes/schemes');
const aerial = require('./routes/aerial');
const analytics = require('./routes/analytics');
const notifications = require('./routes/notifications');

app.use('/api/v1/auth', auth);
app.use('/api/v1/farmers', farmers);
app.use('/api/v1/lands', lands);
app.use('/api/v1/schemes', schemes);
app.use('/api/v1/aerial', aerial);
app.use('/api/v1/analytics', analytics);
app.use('/api/v1/notifications', notifications);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
