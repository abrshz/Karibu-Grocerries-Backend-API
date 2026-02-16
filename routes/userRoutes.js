const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); 

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ 
            message: "Login successful", 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;








