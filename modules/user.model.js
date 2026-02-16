const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Username is required'], 
        unique: true,
        trim: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: { 
        type: String, 
        required: [true, 'Password is required']
    }, 
    role: { 
        type: String, 
        enum: ['Manager', 'Sales Agent', 'Admin', 'Director'], 
        required: true 
    },
    branch: { 
        type: String, 
        enum: ['Maganjo', 'Matugga'], 
        required: [true, 'Branch must be either Maganjo or Matugga'] 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);