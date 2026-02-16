require("dotenv").config()
const express = require('express')
const app = express()
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const port = process.env.PORT


// Connect to Database
connectDB()

// Middleware 
app.use(express.json())

// Login Router 
app.use('/', userRoutes);

app.listen(port, ()=>{
    console.log(`KGL Server running on port ${port}`);
})












