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

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Documentation ────────────────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "KGL API Documentation",
    customCss: ".swagger-ui .topbar { background-color: #2d7d32; }",
  }),
);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KGL (Karibu Groceries Limited) API is running",
    version: "1.0.0",
    docs: `/api-docs`,
    endpoints: {
      users: "/users",
      procurement: "/procurement",
      sales: "/sales",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/users", userRoutes);
app.use("/procurement", procurementRoutes);
app.use("/sales", salesRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`KGL API Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
