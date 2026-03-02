const mongoose = require('mongoose');

// Cash Sale Schema
const cashSaleSchema = new mongoose.Schema(
  {
    saleType: {
      type: String,
      default: 'cash',
      immutable: true,
    },
    produceName: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true,
    },
    tonnage: {
      type: Number,
      required: [true, 'Tonnage is required'],
      min: [1, 'Tonnage must be positive'],
    },
    amountPaid: {
      type: Number,
      required: [true, 'Amount paid is required'],
      min: [10000, 'Amount paid must be at least 5 digits (10,000 UgX minimum)'],
    },
    buyerName: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Buyer name must be alpha-numeric'],
      minlength: [2, 'Buyer name must be at least 2 characters'],
    },
    salesAgentName: {
      type: String,
      required: [true, 'Sales agent name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Sales agent name must be alpha-numeric'],
      minlength: [2, 'Sales agent name must be at least 2 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Credit Sale Schema
const creditSaleSchema = new mongoose.Schema(
  {
    saleType: {
      type: String,
      default: 'credit',
      immutable: true,
    },
    buyerName: {
      type: String,
      required: [true, 'Buyer name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Buyer name must be alpha-numeric'],
      minlength: [2, 'Buyer name must be at least 2 characters'],
    },
    nationalId: {
      type: String,
      required: [true, 'National ID (NIN) is required'],
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z]{2}\d{8}[A-Z]{4}[LM]?$/,
        'Please provide a valid Uganda NIN (e.g. CM90002800HNBQ)',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Location must be alpha-numeric'],
      minlength: [2, 'Location must be at least 2 characters'],
    },
    contacts: {
      type: String,
      required: [true, 'Contact is required'],
      trim: true,
      match: [
        /^(\+256|0)(7[0-9]|3[0-9])\d{7}$/,
        'Please provide a valid Ugandan phone number',
      ],
    },
    amountDue: {
      type: Number,
      required: [true, 'Amount due is required'],
      min: [10000, 'Amount due must be at least 5 digits (10,000 UgX minimum)'],
    },
    salesAgentName: {
      type: String,
      required: [true, 'Sales agent name is required'],
      trim: true,
      match: [/^[a-zA-Z0-9\s]+$/, 'Sales agent name must be alpha-numeric'],
      minlength: [2, 'Sales agent name must be at least 2 characters'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    produceName: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true,
    },
    produceType: {
      type: String,
      required: [true, 'Produce type is required'],
      trim: true,
      match: [/^[a-zA-Z\s]+$/, 'Produce type must be alphabetic only'],
      minlength: [2, 'Produce type must be at least 2 characters'],
    },
    tonnage: {
      type: Number,
      required: [true, 'Tonnage is required'],
      min: [1, 'Tonnage must be positive'],
    },
    dispatchDate: {
      type: Date,
      required: [true, 'Dispatch date is required'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const CashSale = mongoose.model('CashSale', cashSaleSchema);
const CreditSale = mongoose.model('CreditSale', creditSaleSchema);

module.exports = { CashSale, CreditSale };
