require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/db");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");

// Import routers
const userRoutes = require("./routes/userRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// --- FIX 1: Improve CORS Configuration (Recommended) ---
// This is more secure than a blanket app.use(cors()).
// It specifies exactly which frontend origins are allowed to make requests.
const allowedOrigins = [
  'http://localhost:5173', // Your local Vue dev server
  // TODO: Add your deployed frontend URL for production, e.g., 'https://karibu-groceries.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));


// Global Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "KGL API Documentation",
    customCss: ".swagger-ui .topbar { background-color: #2d7d32; }",
  }),
);

// --- FIX 2: Correct API Route Prefixes ---
// All routes are now prefixed with /api to match the frontend's axios baseURL.
// I'm assuming userRoutes handles login/registration, so it's mapped to /api/auth.
app.use("/api/auth", userRoutes); 
app.use("/api/procurement", procurementRoutes);
app.use("/api/sales", salesRoutes);

// 404 Handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`KGL API Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
