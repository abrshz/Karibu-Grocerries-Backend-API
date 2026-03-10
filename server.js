require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/db");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/User");

// Import routers
const userRoutes = require("./routes/userRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const ensureDefaultDirector = async () => {
  const { DEFAULT_DIRECTOR_USERNAME, DEFAULT_DIRECTOR_EMAIL, DEFAULT_DIRECTOR_PASSWORD } =
    process.env;

  if (!DEFAULT_DIRECTOR_USERNAME || !DEFAULT_DIRECTOR_EMAIL || !DEFAULT_DIRECTOR_PASSWORD) {
    return;
  }

  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  await User.create({
    username: DEFAULT_DIRECTOR_USERNAME,
    email: DEFAULT_DIRECTOR_EMAIL,
    password: DEFAULT_DIRECTOR_PASSWORD,
    role: "Director",
  });

  console.log("Default Director user created.");
};

//Global Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "KGL API Documentation",
    customCss: ".swagger-ui .topbar { background-color: #2d7d32; }",
  }),
);

//Routes 
app.use("/users", userRoutes);
app.use("/procurement", procurementRoutes);
app.use("/sales", salesRoutes);

//404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

//Global Error Handler
app.use(errorHandler);

// Start Server (after DB connection)
const startServer = async () => {
  await connectDB();
  await ensureDefaultDirector();

  app.listen(PORT, () => {
    console.log(`KGL API Server running on port ${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();

module.exports = app;
