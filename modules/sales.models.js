const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleType: { type: String, enum: ['cash', 'credit'], required: true },
  produceName: { type: String, required: true },
  tonnage: { type: Number, required: true },
  salesAgentName: { type: String, required: true, minlength: 2 },
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  
  // Cash Specific
  amountPaid: { 
    type: Number, 
    min: [10000, "Amount must be at least 5 digits"], 
    required: function() { return this.saleType === 'cash'; } 
  },
  buyerName: { type: String, required: true, minlength: 2 },

  // Credit Specific (Required only if saleType is 'credit')
  nationalID: { 
    type: String, 
    match: /^[A-Z0-9]{14}$/, 
    required: function() { return this.saleType === 'credit'; } 
  },
  location: { type: String, required: function() { return this.saleType === 'credit'; } },
  dueDate: { type: Date, required: function() { return this.saleType === 'credit'; } },
  amountDue: { 
    type: Number, 
    min: 10000, 
    required: function() { return this.saleType === 'credit'; } 
  }
});

module.exports = mongoose.model('Sale', saleSchema);