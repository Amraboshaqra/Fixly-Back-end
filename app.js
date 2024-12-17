const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

// Initialize express app
const app = express();

// Import utilities
const appError = require("./utils/appError");
const mountRoutes = require('./routes/appRoutes');
const err = require("./controllers/errorController");


// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Security HTTP headers
app.use(helmet()); 

// Rate limiting
// const limiter = rateLimit({
//     max: 100, // Max requests
//     windowMs: 60 * 60 * 1000, // 1 hour
//     message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api', limiter); // Apply rate limiting only to API routes

// Body parsers and URL encoding
app.use(bodyParser.json({ type: 'application/json; charset=utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection & XSS
app.use(mongoSanitizer());
app.use(xss());

// Compression
app.use(compression());


// CORS setup with allowed origins (configure your allowed domains here)
// const corsOptions = {
//     origin: ['https://your-allowed-domain.com', 'http://localhost:3000'], // Allow only specific origins
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true,
// };
// app.use(cors(corsOptions));
//app.options('*', cors(corsOptions));

app.use(cors());
app.options('*', cors());

// Routes
mountRoutes(app);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(err);

module.exports = app;
