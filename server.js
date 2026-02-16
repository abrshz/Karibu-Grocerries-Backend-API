require("dotenv").config()
const express = require('express')
const app = express()
const connectDB = require("./config/db")
const port = process.env.PORT


// Connect to Database
connectDB()

// Middleware 
app.use(express.json())

app.listen(port, ()=>{
    console.log(`KGL Server running on port ${port}`);
})












