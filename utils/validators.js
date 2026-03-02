const { body, validationResult } = require('express-validator');

// Validate request and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Reusable phone validator (Uganda format)
const ugandanPhone = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .matches(/^(\+256|0)(7[0-9]|3[0-9])\d{7}$/)
    .withMessage(`${field} must be a valid Ugandan phone number (e.g. +256701234567 or 0701234567)`);

// Reusable NIN validator
const ugandaNIN = (field) =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .matches(/^[A-Za-z]{2}\d{8}[A-Za-z]{4}[LMlm]?$/)
    .withMessage(`${field} must be a valid Uganda NIN format (e.g. CM90002800HNBQ)`);

// Procurement validators
const procurementValidators = [
  body('produceName')
    .notEmpty().withMessage('Produce name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Produce name must be alpha-numeric'),

  body('produceType')
    .notEmpty().withMessage('Produce type is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Produce type must contain only alphabetic characters')
    .isLength({ min: 2 }).withMessage('Produce type must be at least 2 characters'),

  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),

  body('time').notEmpty().withMessage('Time is required'),

  body('tonnage')
    .notEmpty().withMessage('Tonnage is required')
    .isNumeric().withMessage('Tonnage must be numeric')
    .custom((val) => {
      if (Number(val) < 100) throw new Error('Tonnage must be at least 100 kg (minimum 3 digits)');
      return true;
    }),

  body('cost')
    .notEmpty().withMessage('Cost is required')
    .isNumeric().withMessage('Cost must be numeric')
    .custom((val) => {
      if (Number(val) < 10000) throw new Error('Cost must be at least 10,000 UgX (minimum 5 digits)');
      return true;
    }),

  body('dealerName')
    .notEmpty().withMessage('Dealer name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Dealer name must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Dealer name must be at least 2 characters'),

  body('branch')
    .notEmpty().withMessage('Branch is required')
    .isIn(['Maganjo', 'Matugga']).withMessage('Branch must be either Maganjo or Matugga'),

  ugandanPhone('contact'),

  body('sellingPrice')
    .notEmpty().withMessage('Selling price is required')
    .isNumeric().withMessage('Selling price must be numeric')
    .custom((val) => {
      if (Number(val) < 0) throw new Error('Selling price cannot be negative');
      return true;
    }),
];

// Cash sale validators
const cashSaleValidators = [
  body('produceName').notEmpty().withMessage('Produce name is required'),

  body('tonnage')
    .notEmpty().withMessage('Tonnage is required')
    .isNumeric().withMessage('Tonnage must be numeric')
    .isFloat({ min: 1 }).withMessage('Tonnage must be positive'),

  body('amountPaid')
    .notEmpty().withMessage('Amount paid is required')
    .isNumeric().withMessage('Amount paid must be numeric')
    .custom((val) => {
      if (Number(val) < 10000) throw new Error('Amount paid must be at least 10,000 UgX (minimum 5 digits)');
      return true;
    }),

  body('buyerName')
    .notEmpty().withMessage('Buyer name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Buyer name must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Buyer name must be at least 2 characters'),

  body('salesAgentName')
    .notEmpty().withMessage('Sales agent name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Sales agent name must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Sales agent name must be at least 2 characters'),

  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Must be a valid date'),

  body('time').notEmpty().withMessage('Time is required'),
];

// Credit sale validators
const creditSaleValidators = [
  body('buyerName')
    .notEmpty().withMessage('Buyer name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Buyer name must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Buyer name must be at least 2 characters'),

  ugandaNIN('nationalId'),

  body('location')
    .notEmpty().withMessage('Location is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Location must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),

  ugandanPhone('contacts'),

  body('amountDue')
    .notEmpty().withMessage('Amount due is required')
    .isNumeric().withMessage('Amount due must be numeric')
    .custom((val) => {
      if (Number(val) < 10000) throw new Error('Amount due must be at least 10,000 UgX (minimum 5 digits)');
      return true;
    }),

  body('salesAgentName')
    .notEmpty().withMessage('Sales agent name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Sales agent name must be alpha-numeric')
    .isLength({ min: 2 }).withMessage('Sales agent name must be at least 2 characters'),

  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Must be a valid date'),

  body('produceName').notEmpty().withMessage('Produce name is required'),

  body('produceType')
    .notEmpty().withMessage('Produce type is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Produce type must be alphabetic only')
    .isLength({ min: 2 }).withMessage('Produce type must be at least 2 characters'),

  body('tonnage')
    .notEmpty().withMessage('Tonnage is required')
    .isNumeric().withMessage('Tonnage must be numeric')
    .isFloat({ min: 1 }).withMessage('Tonnage must be positive'),

  body('dispatchDate').notEmpty().withMessage('Dispatch date is required').isISO8601().withMessage('Must be a valid date'),
];

// User registration validators
const userValidators = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 2 }).withMessage('Username must be at least 2 characters')
    .trim(),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['Manager', 'SalesAgent']).withMessage('Role must be Manager or SalesAgent'),
];

module.exports = {
  validate,
  procurementValidators,
  cashSaleValidators,
  creditSaleValidators,
  userValidators,
};
