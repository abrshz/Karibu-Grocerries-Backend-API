require("dotenv").config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger.js')
const errorHandler = require('./middleware/error')
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const procurementRoutes = require('./routes/procurementRoutes')
const salesRoutes = require('./routes/salesRoutes')
const app = express()
const port = process.env.PORT


// Connect to Database
connectDB()

// Middleware 
app.use(express.json())
app.use(cors())

app.use('/api-docs', (swaggerUi.serve, swaggerUi.setup(
    swaggerSpec, {
        customSiteTitle: 'KGL Backend',
        customCss: '.swagger-ui .topbar {background-color: #2d7d32;}'
    }
)))


// Login Router 
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KGL (Karibu Groceries Limited) API is running',
    version: '1.0.0',
    docs: `/api-docs`,
    endpoints: {
      users: '/users',
      procurement: '/procurement',
      sales: '/sales',
    },
  });
});

app.use('/users', userRoutes);
app.use('/procurement', procurementRoutes);
app.use('/sales', salesRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`KGL Server running on port ${port}`);
})












