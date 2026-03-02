const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema(
  {
    produceName: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Produce name must be alpha-numeric'],
    },
    produceType: {
      type: String,
      required: [true, 'Produce type is required'],
      trim: true,
      match: [/^[a-zA-Z\s]+$/, 'Produce type must contain alphabetic characters only'],
      minlength: [2, 'Produce type must be at least 2 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },
    tonnage: {
      type: Number,
      required: [true, 'Tonnage is required'],
      min: [100, 'Tonnage must be at least 100 kg (3 digits minimum)'],
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [10000, 'Cost must be at least 5 digits (10,000 UgX minimum)'],
    },
    dealerName: {
      type: String,
      required: [true, 'Dealer name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Dealer name must be alpha-numeric'],
      minlength: [2, 'Dealer name must be at least 2 characters'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: {
        values: ['Maganjo', 'Matugga'],
        message: 'Branch must be either Maganjo or Matugga',
      },
    },
    contact: {
      type: String,
      required: [true, 'Contact is required'],
      trim: true,
      match: [
        /^(\+256|0)(7[0-9]|3[0-9])\d{7}$/,
        'Please provide a valid Ugandan phone number',
      ],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Procurement', procurementSchema);
